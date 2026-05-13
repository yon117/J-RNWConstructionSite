import { createClient } from '@libsql/client';

let db = null;
let dbPromise = null;

function createDb() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoToken) {
    return createClient({ url: tursoUrl, authToken: tursoToken });
  }
  return createClient({ url: 'file:jandr.sqlite' });
}

// Warm up connection at module load — not on first request
if (typeof process !== 'undefined' && process.env.TURSO_DATABASE_URL) {
  dbPromise = (async () => {
    db = createDb();
    await db.execute('SELECT 1');
    console.log('[db] connection warmed');
    return db;
  })().catch(e => {
    console.warn('[db] warm-up failed:', e.message);
    dbPromise = null;
    db = null;
  });
}

export async function getDb() {
  if (db) return db;
  if (dbPromise) { await dbPromise; if (db) return db; }
  db = createDb();
  return db;
}
