import { computeBackoffMs } from './backoff.mjs';
import { sendLeadToOps } from './client.mjs';
import { claimNextDelivery, markDelivered, markNeedsReview, markRetry } from './queue.mjs';

const DEFAULTS = { limit: 20, leaseMs: 60_000, maxAttempts: 12 };

// Log only technical identifiers: never token, payload, name, email, phone or message text.
function logEvent(event) {
    console.log('[crm-delivery]', JSON.stringify(event));
}

// Processes due jobs until none are left (or `limit` reached). Safe to run in several processes.
export async function runDeliveryCycle(db, config, options = {}) {
    const {
        fetchImpl, workerId, now = Date.now, random = Math.random,
        limit = DEFAULTS.limit, leaseMs = DEFAULTS.leaseMs, maxAttempts = DEFAULTS.maxAttempts
    } = options;
    const stats = { processed: 0, delivered: 0, retried: 0, review: 0 };

    if (!config.enabled) return { ...stats, skipped: config.reason };

    for (let i = 0; i < limit; i++) {
        const job = await claimNextDelivery(db, { now: now(), leaseMs, workerId });
        if (!job) break;
        stats.processed++;
        const attempts = Number(job.attempts);
        const base = { id: Number(job.id), submission_id: job.submission_id, attempts };

        if (attempts > maxAttempts) {
            // Lease recovered after repeated crashes: stop without sending again.
            await markNeedsReview(db, { id: job.id, workerId, errorCode: 'max_attempts_exhausted', now: now() });
            stats.review++;
            logEvent({ ...base, outcome: 'review', code: 'max_attempts_exhausted' });
            continue;
        }

        const result = await sendLeadToOps({
            config, payloadJson: job.payload_json, submissionId: job.submission_id, fetchImpl, now
        });

        if (result.outcome === 'delivered') {
            await markDelivered(db, { id: job.id, workerId, opportunityId: result.opportunityId, httpStatus: result.httpStatus, now: now() });
            stats.delivered++;
            logEvent({ ...base, outcome: 'delivered', http: result.httpStatus });
        } else if (result.outcome === 'retry' && attempts < maxAttempts) {
            const wait = Math.max(computeBackoffMs(attempts, random), result.retryAfterMs ?? 0);
            await markRetry(db, { id: job.id, workerId, nextAttemptAt: now() + wait, errorCode: result.errorCode, httpStatus: result.httpStatus, now: now() });
            stats.retried++;
            logEvent({ ...base, outcome: 'retry', code: result.errorCode, http: result.httpStatus ?? null, wait_ms: wait });
        } else {
            const code = result.outcome === 'retry' ? 'max_attempts_exhausted' : result.errorCode;
            await markNeedsReview(db, { id: job.id, workerId, errorCode: code, httpStatus: result.httpStatus, now: now() });
            stats.review++;
            logEvent({ ...base, outcome: 'review', code, http: result.httpStatus ?? null });
        }
    }
    return stats;
}
