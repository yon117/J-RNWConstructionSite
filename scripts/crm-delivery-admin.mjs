// Inspect and recover the OPS delivery queue. Never prints visitor data (payload is not selected).
//   node scripts/crm-delivery-admin.mjs list [--status needs_review|pending|delivering|delivered]
//   node scripts/crm-delivery-admin.mjs requeue <id>      # needs_review -> pending, same id and payload
import dotenv from 'dotenv';
import { openDeliveryDb } from '../lib/crm-delivery/connection.mjs';
import { listDeliveries, requeueDelivery } from '../lib/crm-delivery/queue.mjs';

dotenv.config({ path: process.env.JRNW_ENV_FILE || undefined });

const [command, ...rest] = process.argv.slice(2);
const { client } = openDeliveryDb(process.env);

try {
    if (command === 'list') {
        const index = rest.indexOf('--status');
        const status = index >= 0 ? rest[index + 1] : undefined;
        const rows = await listDeliveries(client, { status });
        console.table(rows.map((r) => ({ ...r, next_attempt_at: Number(r.next_attempt_at) })));
    } else if (command === 'requeue') {
        const id = Number(rest[0]);
        if (!Number.isInteger(id)) throw new Error('usage: requeue <numeric id>');
        const done = await requeueDelivery(client, { id, now: Date.now() });
        console.log(done ? `Delivery ${id} requeued.` : `Delivery ${id} not requeued (must exist and be needs_review).`);
    } else {
        console.log('usage: list [--status <status>] | requeue <id>');
        process.exitCode = 1;
    }
} finally {
    client.close();
}
