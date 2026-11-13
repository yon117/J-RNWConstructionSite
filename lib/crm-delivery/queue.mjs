// Persistent queue operations. Every state change is a single SQL statement, so claims are atomic
// across processes (PM2 cluster, separate worker, restarts) in SQLite and Turso alike.
// A job is "claimed" with a time-limited lease; an expired lease means the worker died and the job
// is eligible again. Payload and submission_id are never modified (enforced by a trigger).

const COLUMNS = `id, submission_id, message_id, payload_json, status, attempts, next_attempt_at,
    lease_owner, lease_expires_at, last_http_status, last_error_code, opportunity_id`;

export async function claimNextDelivery(db, { now, leaseMs, workerId }) {
    const result = await db.execute({
        sql: `UPDATE crm_deliveries
            SET status = 'delivering', lease_owner = ?, lease_expires_at = ?, attempts = attempts + 1, updated_at = ?
            WHERE id = (
                SELECT id FROM crm_deliveries
                WHERE (status = 'pending' AND next_attempt_at <= ?)
                   OR (status = 'delivering' AND lease_expires_at <= ?)
                ORDER BY next_attempt_at, id LIMIT 1
            )
            RETURNING ${COLUMNS}`,
        args: [workerId, now + leaseMs, now, now, now]
    });
    return result.rows[0] ?? null;
}

async function finalize(db, sql, args) {
    const result = await db.execute({ sql, args });
    return result.rowsAffected === 1;
}

const OWNED = `WHERE id = ? AND lease_owner = ? AND status = 'delivering'`;

export function markDelivered(db, { id, workerId, opportunityId, httpStatus, now }) {
    return finalize(db,
        `UPDATE crm_deliveries SET status = 'delivered', opportunity_id = ?, last_http_status = ?, last_error_code = NULL,
            delivered_at = ?, lease_owner = NULL, lease_expires_at = NULL, updated_at = ? ${OWNED}`,
        [opportunityId, httpStatus ?? null, now, now, id, workerId]);
}

export function markRetry(db, { id, workerId, nextAttemptAt, errorCode, httpStatus, now }) {
    return finalize(db,
        `UPDATE crm_deliveries SET status = 'pending', next_attempt_at = ?, last_error_code = ?, last_http_status = ?,
            lease_owner = NULL, lease_expires_at = NULL, updated_at = ? ${OWNED}`,
        [nextAttemptAt, errorCode, httpStatus ?? null, now, id, workerId]);
}

export function markNeedsReview(db, { id, workerId, errorCode, httpStatus, now }) {
    return finalize(db,
        `UPDATE crm_deliveries SET status = 'needs_review', last_error_code = ?, last_http_status = ?,
            lease_owner = NULL, lease_expires_at = NULL, updated_at = ? ${OWNED}`,
        [errorCode, httpStatus ?? null, now, id, workerId]);
}

// Manual recovery after a person fixed the cause (config, OPS contract). Same id + payload are kept.
export function requeueDelivery(db, { id, now }) {
    return finalize(db,
        `UPDATE crm_deliveries SET status = 'pending', attempts = 0, next_attempt_at = ?, last_error_code = NULL,
            last_http_status = NULL, lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
         WHERE id = ? AND status = 'needs_review'`,
        [now, now, id]);
}

// Metadata only — never selects payload_json (it holds the visitor's contact data and message).
export async function listDeliveries(db, { status, limit = 50 } = {}) {
    const result = await db.execute({
        sql: `SELECT id, submission_id, message_id, status, attempts, next_attempt_at, last_http_status,
                last_error_code, opportunity_id, created_at, updated_at
              FROM crm_deliveries ${status ? 'WHERE status = ?' : ''} ORDER BY id DESC LIMIT ?`,
        args: status ? [status, limit] : [limit]
    });
    return result.rows;
}
