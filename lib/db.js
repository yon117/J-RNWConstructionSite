import { createClient } from '@libsql/client';

let db = null;

export async function getDb() {
  if (db) {
    return db;
  }

  // Check if we're using Turso (production/cloud) or local SQLite
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // Debug logging
  console.log('Environment check:', {
    isVercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
    hasTursoUrl: !!tursoUrl,
    hasTursoToken: !!tursoToken
  });

  // In production (Vercel), always require Turso
  if (process.env.VERCEL) {
    if (!tursoUrl || !tursoToken) {
      throw new Error('Turso credentials not found. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.');
    }

    console.log('Using Turso database in Vercel production');
    db = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
  } else if (tursoUrl && tursoToken) {
    // Production/Dev with Turso credentials
    console.log('Using Turso database');
    db = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
  } else {
    // Local SQLite fallback (for VPS or local dev without Turso)
    console.log('Using local SQLite database (Fallback)');
    db = createClient({
      url: 'file:jandr.sqlite'
    });
  }

  return db;
}
