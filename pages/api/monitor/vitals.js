import { getDb } from '../../../lib/db';

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS web_vitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value REAL NOT NULL,
    rating TEXT DEFAULT 'unknown',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
)`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { name, value, rating } = req.body;
    if (!name || value === undefined) return res.status(400).end();

    try {
        const db = await getDb();
        await db.execute(CREATE_TABLE);
        await db.execute({
            sql: 'INSERT INTO web_vitals (name, value, rating) VALUES (?, ?, ?)',
            args: [name, value, rating || 'unknown'],
        });
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Vitals log error:', error);
        res.status(500).json({ error: 'Failed to log' });
    }
}
