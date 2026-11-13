import { createClient } from '@libsql/client';

// Same database selection as lib/db.js (Turso when both vars exist, else local file), for standalone
// scripts that cannot import the Next-bundled lib/db.js. Never logs the URL or token.
export function openDeliveryDb(env = process.env) {
    const url = env.TURSO_DATABASE_URL;
    const authToken = env.TURSO_AUTH_TOKEN;
    const client = url && authToken ? createClient({ url, authToken }) : createClient({ url: 'file:jandr.sqlite' });
    return { client, kind: url && authToken ? 'turso' : 'local-file' };
}
