import { getDb } from '../../../lib/db';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';

const TABLES = [
    `CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        referrer TEXT DEFAULT '',
        device_type TEXT DEFAULT 'desktop',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )`,
    `CREATE TABLE IF NOT EXISTS web_vitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value REAL NOT NULL,
        rating TEXT DEFAULT 'unknown',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )`,
    `CREATE TABLE IF NOT EXISTS js_errors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        source TEXT DEFAULT '',
        lineno INTEGER DEFAULT 0,
        path TEXT DEFAULT '',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )`,
];

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const days = parseInt(req.query.days) || null;
    const cutoff = days ? Math.floor(Date.now() / 1000) - days * 86400 : 0;

    try {
        const db = await getDb();
        for (const sql of TABLES) await db.execute(sql);

        const [
            totalResult,
            uniqueResult,
            byDayResult,
            topPagesResult,
            deviceResult,
            referrersResult,
            vitalsResult,
            errorsResult,
        ] = await Promise.all([
            db.execute({ sql: 'SELECT COUNT(*) as total FROM page_views WHERE created_at >= ?', args: [cutoff] }),
            db.execute({ sql: 'SELECT COUNT(DISTINCT path) as unique_pages FROM page_views WHERE created_at >= ?', args: [cutoff] }),
            db.execute({ sql: `SELECT date(created_at, 'unixepoch') as day, COUNT(*) as views FROM page_views WHERE created_at >= ? GROUP BY day ORDER BY day`, args: [cutoff] }),
            db.execute({ sql: 'SELECT path, COUNT(*) as views FROM page_views WHERE created_at >= ? GROUP BY path ORDER BY views DESC LIMIT 10', args: [cutoff] }),
            db.execute({ sql: 'SELECT device_type, COUNT(*) as count FROM page_views WHERE created_at >= ? GROUP BY device_type', args: [cutoff] }),
            db.execute({ sql: `SELECT referrer, COUNT(*) as count FROM page_views WHERE created_at >= ? AND referrer != '' GROUP BY referrer ORDER BY count DESC LIMIT 10`, args: [cutoff] }),
            db.execute({ sql: `SELECT name, ROUND(AVG(value), 3) as avg_value, COUNT(*) as samples, SUM(CASE WHEN rating = 'good' THEN 1 ELSE 0 END) as good_count FROM web_vitals WHERE created_at >= ? GROUP BY name`, args: [cutoff] }),
            db.execute({ sql: `SELECT message, source, path, COUNT(*) as occurrences, MAX(created_at) as last_seen FROM js_errors WHERE created_at >= ? GROUP BY message ORDER BY occurrences DESC LIMIT 20`, args: [cutoff] }),
        ]);

        const errorCount = errorsResult.rows.reduce((sum, r) => sum + (Number(r.occurrences) || 0), 0);

        res.status(200).json({
            totalViews: totalResult.rows[0]?.total || 0,
            uniquePages: uniqueResult.rows[0]?.unique_pages || 0,
            byDay: byDayResult.rows,
            topPages: topPagesResult.rows,
            deviceSplit: deviceResult.rows,
            referrers: referrersResult.rows,
            vitals: vitalsResult.rows,
            errors: errorsResult.rows,
            errorCount,
        });
    } catch (error) {
        console.error('Monitor stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
}
