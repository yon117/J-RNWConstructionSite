const BASE_MS = 30_000; // first retry ~30s
const CAP_MS = 6 * 60 * 60 * 1000; // never wait more than 6h between attempts
const RETRY_AFTER_CAP_MS = 60 * 60 * 1000; // honour server hint up to 1h

// Exponential backoff with jitter in [50%, 100%] of the nominal delay.
// `random` is injectable for tests; returns a value in [0, 1].
export function computeBackoffMs(attempt, random = Math.random) {
    const exponent = Math.max(0, Math.min(attempt - 1, 30));
    const nominal = Math.min(BASE_MS * 2 ** exponent, CAP_MS);
    return Math.round(nominal * (0.5 + 0.5 * random()));
}

// Retry-After: delta-seconds or HTTP-date. Returns ms (capped) or null when absent/invalid.
export function parseRetryAfterMs(header, nowMs = Date.now()) {
    if (header === null || header === undefined) return null;
    const value = String(header).trim();
    if (!value) return null;
    let ms;
    if (/^\d+$/.test(value)) {
        ms = Number(value) * 1000;
    } else {
        const date = Date.parse(value);
        if (Number.isNaN(date)) return null;
        ms = date - nowMs;
    }
    return Math.max(0, Math.min(ms, RETRY_AFTER_CAP_MS));
}
