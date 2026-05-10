import { getDb } from '../../../lib/db';

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS js_errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    source TEXT DEFAULT '',
    lineno INTEGER DEFAULT 0,
    path TEXT DEFAULT '',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
)`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { message, source, lineno, path } = req.body;
    if (!message) return res.status(400).end();

    try {
        const db = await getDb();
        await db.execute(CREATE_TABLE);
        await db.execute({
            sql: 'INSERT INTO js_errors (message, source, lineno, path) VALUES (?, ?, ?, ?)',
            args: [message, source || '', lineno || 0, path || ''],
        });
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error log error:', error);
        res.status(500).json({ error: 'Failed to log' });
    }
}
