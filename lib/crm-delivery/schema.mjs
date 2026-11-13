// Additive schema for the CRM delivery queue. Does NOT alter `messages`.
// Apply with scripts/migrate-crm-deliveries.mjs (dry-run by default).
// Timestamps are epoch milliseconds (INTEGER).

export const CRM_DELIVERIES_SCHEMA_STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS crm_deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submission_id TEXT NOT NULL UNIQUE,
        message_id INTEGER,
        payload_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
            CHECK (status IN ('pending', 'delivering', 'delivered', 'needs_review')),
        attempts INTEGER NOT NULL DEFAULT 0,
        next_attempt_at INTEGER NOT NULL,
        lease_owner TEXT,
        lease_expires_at INTEGER,
        last_http_status INTEGER,
        last_error_code TEXT,
        opportunity_id TEXT,
        delivered_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_crm_deliveries_due ON crm_deliveries (status, next_attempt_at)`,
    `CREATE TRIGGER IF NOT EXISTS crm_deliveries_payload_immutable
        BEFORE UPDATE OF submission_id, payload_json ON crm_deliveries
        WHEN NEW.submission_id IS NOT OLD.submission_id OR NEW.payload_json IS NOT OLD.payload_json
        BEGIN SELECT RAISE(ABORT, 'crm_deliveries payload is immutable'); END`
];
