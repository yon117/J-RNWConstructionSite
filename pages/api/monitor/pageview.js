import { getDb } from '../../../lib/db';

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    referrer TEXT DEFAULT '',
    device_type TEXT DEFAULT 'desktop',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
)`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { path, referrer, device_type } = req.body;
    if (!path || path.startsWith('/adminside') || path.startsWith('/admin')) {
        return res.status(200).json({ ok: true });
    }

    const cleanPath = path.split('?')[0];

    try {
        const db = await getDb();
        await db.execute(CREATE_TABLE);
        await db.execute({
            sql: 'INSERT INTO page_views (path, referrer, device_type) VALUES (?, ?, ?)',
            args: [cleanPath, referrer || '', device_type || 'desktop'],
        });
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Pageview log error:', error);
        res.status(500).json({ error: 'Failed to log' });
    }
}
