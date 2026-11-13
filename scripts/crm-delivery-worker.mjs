// Long-running OPS CRM delivery worker. Run ONE instance (separate from the Next.js cluster):
//   node scripts/crm-delivery-worker.mjs          # loop
//   node scripts/crm-delivery-worker.mjs --once   # single cycle then exit
// With JRNW_OPS_CRM_ENABLED unset/false it idles and leaves the queue untouched.
import { hostname } from 'node:os';
import { randomBytes } from 'node:crypto';
import dotenv from 'dotenv';

import { readCrmDeliveryConfig } from '../lib/crm-delivery/config.mjs';
import { openDeliveryDb } from '../lib/crm-delivery/connection.mjs';
import { runDeliveryCycle } from '../lib/crm-delivery/worker.mjs';

dotenv.config({ path: process.env.JRNW_ENV_FILE || undefined });

const POLL_MS = 15_000;
const once = process.argv.includes('--once');
const workerId = `${hostname()}:${process.pid}:${randomBytes(4).toString('hex')}`;
const config = readCrmDeliveryConfig(process.env);
const { client, kind } = openDeliveryDb(process.env);

console.log('[crm-delivery] worker start', JSON.stringify({ worker: workerId, db: kind, enabled: config.enabled, reason: config.enabled ? null : config.reason }));

let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { stopping = true; });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
    do {
        try {
            await runDeliveryCycle(client, config, { workerId });
        } catch (error) {
            // Error class only: messages from the driver or fetch might embed URLs.
            console.error('[crm-delivery] cycle failed', error?.name || 'Error');
        }
        if (!once && !stopping) await sleep(POLL_MS);
    } while (!once && !stopping);
} finally {
    client.close();
}
