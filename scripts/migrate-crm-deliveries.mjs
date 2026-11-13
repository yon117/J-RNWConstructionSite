// Creates the crm_deliveries table (additive; `messages` untouched).
//   node scripts/migrate-crm-deliveries.mjs           # DRY RUN: prints SQL and target kind, changes nothing
//   node scripts/migrate-crm-deliveries.mjs --apply   # applies to the DB selected by TURSO_* env / local file
// Take a DB backup first. Idempotent (IF NOT EXISTS).
import dotenv from 'dotenv';
import { CRM_DELIVERIES_SCHEMA_STATEMENTS } from '../lib/crm-delivery/schema.mjs';
import { openDeliveryDb } from '../lib/crm-delivery/connection.mjs';

dotenv.config({ path: process.env.JRNW_ENV_FILE || undefined });

const apply = process.argv.includes('--apply');
const { client, kind } = openDeliveryDb(process.env);

try {
    console.log(`Target database: ${kind}`);
    if (!apply) {
        console.log('DRY RUN (add --apply to execute):\n');
        console.log(CRM_DELIVERIES_SCHEMA_STATEMENTS.join(';\n\n') + ';');
    } else {
        await client.batch(CRM_DELIVERIES_SCHEMA_STATEMENTS, 'write');
        const cols = await client.execute('PRAGMA table_info(crm_deliveries)');
        console.log(`Applied. crm_deliveries columns: ${cols.rows.map((r) => r.name).join(', ')}`);
    }
} finally {
    client.close();
}
