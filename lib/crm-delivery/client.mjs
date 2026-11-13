import { parseRetryAfterMs } from './backoff.mjs';

const DEFAULT_TIMEOUT_MS = 10_000;
const RETRYABLE_STATUSES = new Set([408, 425, 429]);
const CONFIG_STATUSES = new Set([401, 403, 404, 405]);
const PAYLOAD_STATUSES = new Set([400, 409, 413, 415, 422]);

// Sends one stored payload to OPS and classifies the outcome.
// Result shapes (never contains the token or the response body):
//   { outcome: 'delivered', opportunityId, httpStatus }
//   { outcome: 'retry', errorCode, httpStatus?, retryAfterMs? }
//   { outcome: 'review', errorCode, httpStatus }
export async function sendLeadToOps({
    config, payloadJson, submissionId, fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS, now = Date.now
}) {
    let response;
    try {
        response = await fetchImpl(config.url, {
            method: 'POST',
            // Never follow redirects: they could forward the bearer token to another host.
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.token}`
            },
            body: payloadJson,
            signal: AbortSignal.timeout(timeoutMs)
        });
    } catch (error) {
        const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
        return { outcome: 'retry', errorCode: timedOut ? 'timeout' : 'network_error' };
    }

    const httpStatus = response.status;

    if (httpStatus === 200 || httpStatus === 201) {
        let body = null;
        try { body = await response.json(); } catch { /* handled below */ }
        const valid = body && body.accepted === true && body.submission_id === submissionId
            && typeof body.opportunity_id === 'string' && body.opportunity_id.length > 0;
        if (valid) return { outcome: 'delivered', opportunityId: body.opportunity_id, httpStatus };
        // 2xx that is not a genuine OPS acceptance (proxy page, wrong id): safe to retry, ids are idempotent.
        return { outcome: 'retry', errorCode: 'invalid_ops_response', httpStatus };
    }

    await response.body?.cancel?.().catch(() => {});

    if (httpStatus >= 300 && httpStatus < 400) {
        return { outcome: 'review', errorCode: 'redirect_not_followed', httpStatus };
    }
    if (RETRYABLE_STATUSES.has(httpStatus) || httpStatus >= 500) {
        const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'), now());
        return { outcome: 'retry', errorCode: `http_${httpStatus}`, httpStatus, ...(retryAfterMs !== null && { retryAfterMs }) };
    }
    if (CONFIG_STATUSES.has(httpStatus)) return { outcome: 'review', errorCode: 'configuration_error', httpStatus };
    if (PAYLOAD_STATUSES.has(httpStatus)) return { outcome: 'review', errorCode: 'payload_rejected', httpStatus };
    return { outcome: 'review', errorCode: 'unexpected_status', httpStatus };
}
