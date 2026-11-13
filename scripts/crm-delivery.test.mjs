// Run manually (needs `npm install` for @libsql/client):  node --test scripts/crm-delivery.test.mjs
// Uses a throwaway SQLite file in the OS temp dir. Never touches jandr.sqlite or Turso.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createClient } from '@libsql/client';

import { readCrmDeliveryConfig } from '../lib/crm-delivery/config.mjs';
import { buildOpsPayload, OPS_LIMITS } from '../lib/crm-delivery/payload.mjs';
import { computeBackoffMs, parseRetryAfterMs } from '../lib/crm-delivery/backoff.mjs';
import { sendLeadToOps } from '../lib/crm-delivery/client.mjs';
import { CRM_DELIVERIES_SCHEMA_STATEMENTS } from '../lib/crm-delivery/schema.mjs';
import { recordContactMessage, resolveSubmissionId } from '../lib/crm-delivery/intake.mjs';
import { claimNextDelivery, markDelivered, markRetry, markNeedsReview, requeueDelivery } from '../lib/crm-delivery/queue.mjs';
import { runDeliveryCycle } from '../lib/crm-delivery/worker.mjs';

const TOKEN = 'x'.repeat(40);
const CONFIG = { enabled: true, url: 'https://ops.example.test/api/crm/leads', token: TOKEN };
const FIELDS = {
    name: 'Ana Pérez', email: 'ana@example.com', phone: '503-555-0100',
    serviceType: 'Kitchen remodel', message: 'Quisiera un estimado.'
};

async function freshDb() {
    const dir = await mkdtemp(path.join(tmpdir(), 'crm-delivery-'));
    const url = `file:${path.join(dir, 'test.sqlite')}`;
    const db = createClient({ url });
    await db.execute(`CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, full_name TEXT,
        email TEXT, phone TEXT, message TEXT, service_type TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await db.batch(CRM_DELIVERIES_SCHEMA_STATEMENTS, 'write');
    return { db, url, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

const rowCount = async (db, table) => Number((await db.execute(`SELECT COUNT(*) AS n FROM ${table}`)).rows[0].n);
const jsonResponse = (status, body, headers = {}) =>
    new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers });

// ---------- config ----------
test('config: disabled by default and for anything other than exactly "true"', () => {
    assert.equal(readCrmDeliveryConfig({}).enabled, false);
    assert.equal(readCrmDeliveryConfig({ JRNW_OPS_CRM_ENABLED: '1' }).enabled, false);
    assert.equal(readCrmDeliveryConfig({ JRNW_OPS_CRM_ENABLED: 'TRUE' }).enabled, false);
});

test('config: enabled flag with bad url or short token stays disabled and never echoes secrets', () => {
    const base = { JRNW_OPS_CRM_ENABLED: 'true', JRNW_OPS_CRM_LEADS_URL: 'https://ops.example.test/api/crm/leads', JRNW_OPS_CRM_TOKEN: TOKEN };
    assert.equal(readCrmDeliveryConfig(base).enabled, true);
    const http = readCrmDeliveryConfig({ ...base, JRNW_OPS_CRM_LEADS_URL: 'http://ops.example.test/api/crm/leads' });
    assert.equal(http.enabled, false);
    assert.equal(http.reason, 'invalid_url');
    assert.equal(readCrmDeliveryConfig({ ...base, JRNW_OPS_CRM_LEADS_URL: 'https://user:pw@ops.example.test/x' }).enabled, false);
    const short = readCrmDeliveryConfig({ ...base, JRNW_OPS_CRM_TOKEN: 'short' });
    assert.equal(short.enabled, false);
    assert.equal(short.reason, 'invalid_token');
    assert.ok(!JSON.stringify(short).includes('short'));
});

// ---------- payload ----------
test('payload: maps landing fields to OPS contract with stable submission id', () => {
    const built = buildOpsPayload({ submissionId: 'web:abc', ...FIELDS });
    assert.equal(built.ok, true);
    assert.deepEqual(built.payload, {
        submission_id: 'web:abc', client_name: 'Ana Pérez', client_email: 'ana@example.com',
        client_phone: '503-555-0100', title: 'Kitchen remodel', message: 'Quisiera un estimado.', lead_source: 'website'
    });
    assert.equal(built.json, JSON.stringify(built.payload));
});

test('payload: over-limit fields are rejected with the field named, never truncated', () => {
    const built = buildOpsPayload({
        submissionId: 'web:abc', ...FIELDS,
        name: 'n'.repeat(OPS_LIMITS.name + 1), message: 'm'.repeat(OPS_LIMITS.message + 1)
    });
    assert.equal(built.ok, false);
    assert.equal(built.reason, 'payload_exceeds_ops_limits');
    assert.deepEqual(built.violations.map((v) => v.field).sort(), ['client_name', 'message']);
    assert.ok(built.json.includes('m'.repeat(OPS_LIMITS.message + 1)), 'candidate json keeps the full text');
});

test('payload: total JSON bytes above 32768 is rejected even when each field is within limits', () => {
    const ctrl = (n) => '\u0001'.repeat(n); // each control char escapes to 6 bytes in JSON
    const built = buildOpsPayload({
        submissionId: 'web:abc', name: ctrl(OPS_LIMITS.name), serviceType: ctrl(OPS_LIMITS.title),
        message: ctrl(OPS_LIMITS.message), phone: ctrl(OPS_LIMITS.phone), email: `${'a'.repeat(240)}@x.co`
    });
    assert.equal(built.ok, false);
    assert.ok(built.violations.some((v) => v.field === 'body_bytes'));
});

test('payload: missing contact or invalid email rejected', () => {
    assert.equal(buildOpsPayload({ submissionId: 'web:abc', ...FIELDS, email: '', phone: '' }).ok, false);
    assert.equal(buildOpsPayload({ submissionId: 'web:abc', ...FIELDS, email: 'not-an-email' }).ok, false);
    assert.equal(buildOpsPayload({ submissionId: 'bad id!', ...FIELDS }).ok, false);
});

// ---------- backoff ----------
test('backoff: grows, is capped, and jitter stays within bounds', () => {
    const noJitter = () => 1;
    const a1 = computeBackoffMs(1, noJitter);
    const a2 = computeBackoffMs(2, noJitter);
    const a3 = computeBackoffMs(3, noJitter);
    assert.ok(a2 > a1 && a3 > a2);
    assert.ok(computeBackoffMs(50, noJitter) <= 6 * 60 * 60 * 1000);
    assert.ok(computeBackoffMs(3, () => 0) < a3);
    assert.ok(computeBackoffMs(3, () => 0) > 0);
});

test('backoff: Retry-After accepts seconds and HTTP dates, rejects garbage, caps at one hour', () => {
    assert.equal(parseRetryAfterMs('120', 0), 120_000);
    assert.equal(parseRetryAfterMs(new Date(60_000).toUTCString(), 0), 60_000);
    assert.equal(parseRetryAfterMs('soon', 0), null);
    assert.equal(parseRetryAfterMs(null, 0), null);
    assert.equal(parseRetryAfterMs('999999', 0), 3_600_000);
});

// ---------- client ----------
const ok = { submission_id: 'web:abc', accepted: true, opportunity_id: 'opp-1' };
async function send(fetchImpl) {
    return sendLeadToOps({ config: CONFIG, payloadJson: '{"submission_id":"web:abc"}', submissionId: 'web:abc', fetchImpl, now: () => 0 });
}

test('client: sends Bearer token, JSON, no redirect following; confirms only valid OPS answer', async () => {
    let seen;
    const result = await send(async (url, init) => { seen = { url, init }; return jsonResponse(201, ok); });
    assert.equal(result.outcome, 'delivered');
    assert.equal(result.opportunityId, 'opp-1');
    assert.equal(seen.url, CONFIG.url);
    assert.equal(seen.init.redirect, 'manual');
    assert.equal(seen.init.headers.Authorization, `Bearer ${TOKEN}`);
    assert.equal(seen.init.headers['Content-Type'], 'application/json');
    assert.equal((await send(async () => jsonResponse(200, ok))).outcome, 'delivered');
});

test('client: 2xx with wrong body or other submission id is NOT delivered', async () => {
    assert.equal((await send(async () => jsonResponse(200, '<html>proxy</html>'))).outcome, 'retry');
    assert.equal((await send(async () => jsonResponse(201, { ...ok, accepted: false }))).outcome, 'retry');
    assert.equal((await send(async () => jsonResponse(201, { ...ok, submission_id: 'other' }))).outcome, 'retry');
    assert.equal((await send(async () => jsonResponse(201, { ...ok, opportunity_id: '' }))).outcome, 'retry');
});

test('client: transient failures retry; Retry-After honoured on 429', async () => {
    assert.equal((await send(async () => { throw new TypeError('fetch failed'); })).outcome, 'retry');
    const timeout = await send(async () => { const e = new Error('t'); e.name = 'TimeoutError'; throw e; });
    assert.equal(timeout.outcome, 'retry');
    assert.equal(timeout.errorCode, 'timeout');
    for (const status of [408, 500, 502, 503, 504]) assert.equal((await send(async () => jsonResponse(status, {}))).outcome, 'retry');
    const limited = await send(async () => jsonResponse(429, {}, { 'Retry-After': '90' }));
    assert.equal(limited.outcome, 'retry');
    assert.equal(limited.retryAfterMs, 90_000);
});

test('client: permanent errors go to review, split config vs payload', async () => {
    for (const status of [401, 403, 404, 405]) {
        const r = await send(async () => jsonResponse(status, {}));
        assert.equal(r.outcome, 'review');
        assert.equal(r.errorCode, 'configuration_error');
    }
    for (const status of [400, 409, 413, 415]) {
        const r = await send(async () => jsonResponse(status, {}));
        assert.equal(r.outcome, 'review');
        assert.equal(r.errorCode, 'payload_rejected');
    }
    const redirect = await send(async () => jsonResponse(301, '', { Location: 'https://elsewhere.test/' }));
    assert.equal(redirect.outcome, 'review');
    assert.equal(redirect.errorCode, 'redirect_not_followed');
});

test('client: result never contains token or response body', async () => {
    const r = await send(async () => jsonResponse(500, { secret: 'LEAK' }));
    assert.ok(!JSON.stringify(r).includes('LEAK'));
    assert.ok(!JSON.stringify(r).includes(TOKEN));
});

// ---------- intake (atomic save + enqueue) ----------
test('intake: crm disabled writes only the message, no delivery row', async () => {
    const { db, cleanup } = await freshDb();
    try {
        const r = await recordContactMessage(db, FIELDS, { crmEnabled: false, submissionId: 'web:one' });
        assert.equal(r.duplicate, false);
        assert.equal(await rowCount(db, 'messages'), 1);
        assert.equal(await rowCount(db, 'crm_deliveries'), 0);
    } finally { await cleanup(); }
});

test('intake: crm enabled writes message and pending delivery together', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 1000 });
        const msg = (await db.execute('SELECT id FROM messages')).rows[0];
        const d = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(d.status, 'pending');
        assert.equal(d.submission_id, 'web:one');
        assert.equal(Number(d.message_id), Number(msg.id));
        assert.equal(Number(d.next_attempt_at), 1000);
        assert.equal(JSON.parse(d.payload_json).client_email, 'ana@example.com');
    } finally { await cleanup(); }
});

test('intake: same submission id twice (browser retry) creates one message and one delivery', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one' });
        const again = await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one' });
        assert.equal(again.duplicate, true);
        assert.equal(await rowCount(db, 'messages'), 1, 'rolled back batch leaves no orphan message');
        assert.equal(await rowCount(db, 'crm_deliveries'), 1);
    } finally { await cleanup(); }
});

test('intake: delivery insert failure rolls back the message (atomic)', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await db.execute('DROP TABLE crm_deliveries');
        await assert.rejects(recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one' }));
        assert.equal(await rowCount(db, 'messages'), 0);
    } finally { await cleanup(); }
});

test('intake: over-limit message is saved locally and queued as needs_review, not truncated', async () => {
    const { db, cleanup } = await freshDb();
    try {
        const long = 'm'.repeat(OPS_LIMITS.message + 1);
        await recordContactMessage(db, { ...FIELDS, message: long }, { crmEnabled: true, submissionId: 'web:one' });
        const saved = (await db.execute('SELECT message FROM messages')).rows[0];
        assert.equal(saved.message.length, OPS_LIMITS.message + 1);
        const d = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(d.status, 'needs_review');
        assert.equal(d.last_error_code, 'payload_exceeds_ops_limits');
        assert.equal(await claimNextDelivery(db, { now: Date.now() + 1e9, leaseMs: 1000, workerId: 'w' }), null);
    } finally { await cleanup(); }
});

test('intake: submission id from browser is validated; invalid or missing gets a server id', () => {
    assert.equal(resolveSubmissionId('3f2b8c1e-9d4a-4c1b-8e7f-0a1b2c3d4e5f'), 'web:3f2b8c1e-9d4a-4c1b-8e7f-0a1b2c3d4e5f');
    for (const bad of [undefined, null, 42, '', 'short', 'a b c d e f g h i j k l', 'x'.repeat(65), '../../etc/passwd-padding']) {
        const id = resolveSubmissionId(bad);
        assert.match(id, /^web:[A-Za-z0-9-]{36}$/);
    }
    assert.notEqual(resolveSubmissionId(undefined), resolveSubmissionId(undefined));
});

test('payload is immutable once queued', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one' });
        await assert.rejects(db.execute(`UPDATE crm_deliveries SET payload_json = '{}'`));
        await assert.rejects(db.execute(`UPDATE crm_deliveries SET submission_id = 'web:two'`));
        await db.execute(`UPDATE crm_deliveries SET attempts = attempts + 1`);
    } finally { await cleanup(); }
});

// ---------- queue ----------
test('queue: claim returns due job once; concurrent workers never share a job', async () => {
    const { db, url, cleanup } = await freshDb();
    try {
        for (let i = 0; i < 6; i++) {
            await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: `web:job-${i}`, now: () => 0 });
        }
        const clients = [db, createClient({ url }), createClient({ url })];
        for (const client of clients) await client.execute('PRAGMA busy_timeout = 5000');
        const claimed = [];
        await Promise.all(clients.map(async (client, n) => {
            for (;;) {
                const job = await claimNextDelivery(client, { now: 10, leaseMs: 60_000, workerId: `w${n}` });
                if (!job) break;
                claimed.push(job.submission_id);
            }
        }));
        assert.equal(claimed.length, 6);
        assert.equal(new Set(claimed).size, 6);
    } finally { await cleanup(); }
});

test('queue: future jobs are not claimed; claim increments attempts and sets lease', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 5000 });
        assert.equal(await claimNextDelivery(db, { now: 4999, leaseMs: 100, workerId: 'w' }), null);
        const job = await claimNextDelivery(db, { now: 5000, leaseMs: 100, workerId: 'w' });
        assert.equal(Number(job.attempts), 1);
        assert.equal(job.lease_owner, 'w');
        assert.equal(Number(job.lease_expires_at), 5100);
    } finally { await cleanup(); }
});

test('queue: expired lease (crashed worker / restart) is recovered; live lease is not stolen', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        await claimNextDelivery(db, { now: 0, leaseMs: 1000, workerId: 'crashed' });
        assert.equal(await claimNextDelivery(db, { now: 999, leaseMs: 1000, workerId: 'other' }), null);
        const job = await claimNextDelivery(db, { now: 1000, leaseMs: 1000, workerId: 'other' });
        assert.equal(job.lease_owner, 'other');
        assert.equal(Number(job.attempts), 2);
    } finally { await cleanup(); }
});

test('queue: finalize only works for the current lease owner', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        await claimNextDelivery(db, { now: 0, leaseMs: 10, workerId: 'old' });
        const job = await claimNextDelivery(db, { now: 10, leaseMs: 1000, workerId: 'new' });
        assert.equal(await markDelivered(db, { id: job.id, workerId: 'old', opportunityId: 'x', httpStatus: 201, now: 11 }), false);
        assert.equal(await markDelivered(db, { id: job.id, workerId: 'new', opportunityId: 'opp-9', httpStatus: 201, now: 11 }), true);
        const row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'delivered');
        assert.equal(row.opportunity_id, 'opp-9');
        assert.equal(row.lease_owner, null);
    } finally { await cleanup(); }
});

test('queue: retry schedules next attempt; review parks the job; requeue resets it keeping payload', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        const job = await claimNextDelivery(db, { now: 0, leaseMs: 1000, workerId: 'w' });
        const payloadBefore = job.payload_json;
        await markRetry(db, { id: job.id, workerId: 'w', nextAttemptAt: 9000, errorCode: 'http_503', httpStatus: 503, now: 1 });
        let row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'pending');
        assert.equal(Number(row.next_attempt_at), 9000);
        assert.equal(await claimNextDelivery(db, { now: 8999, leaseMs: 1000, workerId: 'w' }), null);
        const again = await claimNextDelivery(db, { now: 9000, leaseMs: 1000, workerId: 'w' });
        await markNeedsReview(db, { id: again.id, workerId: 'w', errorCode: 'configuration_error', httpStatus: 401, now: 9001 });
        row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'needs_review');
        assert.equal(await claimNextDelivery(db, { now: 1e12, leaseMs: 1000, workerId: 'w' }), null);
        assert.equal(await requeueDelivery(db, { id: row.id, now: 2e12 }), true);
        row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'pending');
        assert.equal(Number(row.attempts), 0);
        assert.equal(row.payload_json, payloadBefore);
        assert.equal(row.submission_id, 'web:one');
    } finally { await cleanup(); }
});

test('queue: requeue refuses delivered jobs', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        const job = await claimNextDelivery(db, { now: 0, leaseMs: 1000, workerId: 'w' });
        await markDelivered(db, { id: job.id, workerId: 'w', opportunityId: 'o', httpStatus: 201, now: 1 });
        assert.equal(await requeueDelivery(db, { id: job.id, now: 2 }), false);
    } finally { await cleanup(); }
});

// ---------- worker ----------
const okOne = { ...ok, submission_id: 'web:one' }; // matches the job these tests enqueue

const cycleOpts = (extra = {}) => ({ workerId: 'w', now: () => 1_000, random: () => 1, ...extra });

test('worker: disabled config does nothing and keeps queue intact', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        let calls = 0;
        const r = await runDeliveryCycle(db, { enabled: false, reason: 'disabled' }, cycleOpts({ fetchImpl: async () => { calls++; return jsonResponse(201, okOne); } }));
        assert.equal(r.skipped, 'disabled');
        assert.equal(calls, 0);
        assert.equal((await db.execute('SELECT status FROM crm_deliveries')).rows[0].status, 'pending');
    } finally { await cleanup(); }
});

test('worker: delivers with the stored payload and stores the opportunity id', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        const bodies = [];
        const r = await runDeliveryCycle(db, CONFIG, cycleOpts({ fetchImpl: async (_u, init) => { bodies.push(init.body); return jsonResponse(201, okOne); } }));
        assert.equal(r.delivered, 1);
        const row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'delivered');
        assert.equal(row.opportunity_id, 'opp-1');
        assert.equal(bodies[0], row.payload_json);
    } finally { await cleanup(); }
});

test('worker: OPS down then up — same submission_id and identical payload on every retry, no duplicates', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        const bodies = [];
        let up = false;
        const fetchImpl = async (_u, init) => { bodies.push(init.body); return up ? jsonResponse(200, okOne) : jsonResponse(503, {}); };
        let t = 0;
        const opts = () => cycleOpts({ fetchImpl, now: () => t });
        await runDeliveryCycle(db, CONFIG, opts());
        let row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'pending');
        assert.equal(Number(row.attempts), 1);
        assert.ok(Number(row.next_attempt_at) > 0);
        const idle = await runDeliveryCycle(db, CONFIG, opts());
        assert.equal(idle.processed, 0, 'not due yet: no hammering');
        up = true;
        t = Number(row.next_attempt_at);
        await runDeliveryCycle(db, CONFIG, opts());
        row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'delivered');
        assert.equal(bodies.length, 2);
        assert.equal(bodies[0], bodies[1]);
        assert.equal(await rowCount(db, 'crm_deliveries'), 1);
    } finally { await cleanup(); }
});

test('worker: 401 parks job for review without retry loop; 429 Retry-After respected', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:a', now: () => 0 });
        await runDeliveryCycle(db, CONFIG, cycleOpts({ fetchImpl: async () => jsonResponse(401, {}) }));
        let row = (await db.execute(`SELECT * FROM crm_deliveries WHERE submission_id = 'web:a'`)).rows[0];
        assert.equal(row.status, 'needs_review');
        assert.equal(row.last_error_code, 'configuration_error');
        assert.equal(Number(row.last_http_status), 401);

        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:b', now: () => 0 });
        await runDeliveryCycle(db, CONFIG, cycleOpts({ fetchImpl: async () => jsonResponse(429, {}, { 'Retry-After': '300' }) }));
        row = (await db.execute(`SELECT * FROM crm_deliveries WHERE submission_id = 'web:b'`)).rows[0];
        assert.equal(row.status, 'pending');
        assert.ok(Number(row.next_attempt_at) >= 1_000 + 300_000);
    } finally { await cleanup(); }
});

test('worker: attempts exhausted moves to needs_review', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        let t = 0;
        for (let i = 0; i < 3; i++) {
            await runDeliveryCycle(db, CONFIG, cycleOpts({ maxAttempts: 3, now: () => t, fetchImpl: async () => jsonResponse(500, {}) }));
            t += 1e10;
        }
        const row = (await db.execute('SELECT * FROM crm_deliveries')).rows[0];
        assert.equal(row.status, 'needs_review');
        assert.equal(row.last_error_code, 'max_attempts_exhausted');
    } finally { await cleanup(); }
});

test('worker: crash mid-send (lease left behind) is retried after lease expiry with same payload', async () => {
    const { db, cleanup } = await freshDb();
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        await claimNextDelivery(db, { now: 0, leaseMs: 60_000, workerId: 'dead' });
        let calls = 0;
        const fetchImpl = async () => { calls++; return jsonResponse(200, okOne); };
        await runDeliveryCycle(db, CONFIG, cycleOpts({ now: () => 30_000, fetchImpl }));
        assert.equal(calls, 0, 'live lease respected');
        await runDeliveryCycle(db, CONFIG, cycleOpts({ now: () => 60_000, fetchImpl }));
        assert.equal(calls, 1);
        assert.equal((await db.execute('SELECT status FROM crm_deliveries')).rows[0].status, 'delivered');
    } finally { await cleanup(); }
});

test('worker: logs contain no token, email, phone or message text', async () => {
    const { db, cleanup } = await freshDb();
    const lines = [];
    const original = { log: console.log, warn: console.warn, error: console.error };
    console.log = console.warn = console.error = (...a) => lines.push(a.map(String).join(' '));
    try {
        await recordContactMessage(db, FIELDS, { crmEnabled: true, submissionId: 'web:one', now: () => 0 });
        await runDeliveryCycle(db, CONFIG, cycleOpts({ fetchImpl: async () => jsonResponse(500, { echo: FIELDS.message }) }));
    } finally { Object.assign(console, original); await cleanup(); }
    const out = lines.join('\n');
    for (const secret of [TOKEN, FIELDS.email, FIELDS.phone, FIELDS.message, FIELDS.name]) assert.ok(!out.includes(secret), `log leaked ${secret}`);
});
