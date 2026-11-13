import { randomUUID } from 'node:crypto';
import { buildOpsPayload } from './payload.mjs';

// Browser-supplied id: 16-64 chars of [A-Za-z0-9-] (a UUID fits). Anything else gets a server id,
// which still gives delivery idempotency but no protection against a browser replaying the same submit.
const BROWSER_ID_PATTERN = /^[A-Za-z0-9-]{16,64}$/;

export function resolveSubmissionId(candidate) {
    if (typeof candidate === 'string' && BROWSER_ID_PATTERN.test(candidate)) return `web:${candidate}`;
    return `web:${randomUUID()}`;
}

function isSubmissionConflict(error) {
    const text = `${error?.code ?? ''} ${error?.message ?? ''}`;
    return /UNIQUE constraint failed: crm_deliveries\.submission_id/i.test(text);
}

// Saves the contact message and, when CRM delivery is enabled, a delivery row in ONE transaction.
// Same INSERT as the previous handler for `messages`; the schema of `messages` is not touched.
// Returns { duplicate } — duplicate=true means this submission_id was already recorded (browser retry).
export async function recordContactMessage(db, fields, { crmEnabled, submissionId, now = Date.now }) {
    const insertMessage = {
        sql: 'INSERT INTO messages (name, full_name, email, phone, message, service_type) VALUES (?, ?, ?, ?, ?, ?)',
        args: [fields.name, fields.name, fields.email, fields.phone, fields.message, fields.serviceType]
    };

    if (!crmEnabled) {
        await db.execute(insertMessage);
        return { duplicate: false };
    }

    const built = buildOpsPayload({ submissionId, ...fields });
    const timestamp = now();
    const insertDelivery = {
        // last_insert_rowid() refers to the message inserted just before, inside the same batch transaction.
        sql: `INSERT INTO crm_deliveries
            (submission_id, message_id, payload_json, status, last_error_code, next_attempt_at, created_at, updated_at)
            VALUES (?, last_insert_rowid(), ?, ?, ?, ?, ?, ?)`,
        args: [
            submissionId, built.json, built.ok ? 'pending' : 'needs_review',
            built.ok ? null : built.reason, timestamp, timestamp, timestamp
        ]
    };

    try {
        await db.batch([insertMessage, insertDelivery], 'write');
    } catch (error) {
        if (isSubmissionConflict(error)) return { duplicate: true };
        throw error;
    }
    return { duplicate: false };
}
