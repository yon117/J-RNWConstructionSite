import { getDb } from '../../../lib/db';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = await getDb();

        const result = await db.execute(`
            SELECT
                CASE WHEN category IS NULL OR category = '' THEN 'uncategorized' ELSE category END as category,
                COUNT(*) as count
            FROM projects
            GROUP BY category
            ORDER BY count DESC
        `);

        const categoryData = (result.rows || []).map(r => ({
            name: r.category.charAt(0).toUpperCase() + r.category.slice(1),
            count: Number(r.count),
        }));

        const totalResult = await db.execute('SELECT COUNT(*) as total FROM projects');
        const total = Number(totalResult.rows[0]?.total || 0);

        return res.status(200).json({ categoryData, total });
    } catch (error) {
        console.error('project-stats error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
