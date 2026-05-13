const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const db = process.env.TURSO_DATABASE_URL
  ? createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  : createClient({ url: 'file:jandr.sqlite' });

db.execute('ALTER TABLE projects ADD COLUMN category TEXT DEFAULT ""')
  .then(() => { console.log('done'); process.exit(0); })
  .catch(e => { console.log(e.message); process.exit(0); });
