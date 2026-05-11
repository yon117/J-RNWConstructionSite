import { getDb } from '../../../lib/db';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS click_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
)`;

export default async function handler(req, res) {
    const db = await getDb();
    await db.execute(CREATE_TABLE);

    if (req.method === 'POST') {
        const { event } = req.body;
        if (!event) return res.status(400).json({ error: 'No event' });
        try {
            await db.execute({ sql: 'INSERT INTO click_events (event) VALUES (?)', args: [event] });
            return res.status(200).json({ ok: true });
        } catch (e) {
            return res.status(500).json({ error: 'Failed to log' });
        }
    }

    if (req.method === 'GET') {
        const cookies = parse(req.headers.cookie || '');
        if (!isValidSessionToken(cookies.admin_token)) return res.status(401).json({ error: 'Unauthorized' });
        try {
            const days = req.query.days ? parseInt(req.query.days) : null;
            const where = days ? `WHERE created_at >= strftime('%s', 'now') - ${days * 86400}` : '';
            const result = await db.execute(
                `SELECT event, COUNT(*) as count FROM click_events ${where} GROUP BY event`
            );
            return res.status(200).json({ clicks: result.rows });
        } catch (e) {
            return res.status(500).json({ error: 'Failed to fetch' });
        }
    }

    return res.status(405).end();
}
