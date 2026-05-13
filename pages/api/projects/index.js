import { getDb } from '../../../lib/db';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';

export default async function handler(req, res) {
    try {
        const db = await getDb();

        if (req.method === 'GET') {
            const result = await db.execute('SELECT * FROM projects');
            return res.status(200).json(result.rows);
        }

        // All write methods require auth
        const cookies = parse(req.headers.cookie || '');
        if (!isValidSessionToken(cookies.admin_token)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method === 'POST') {
            const { title, description, image_url, details, category } = req.body;
            await db.execute({
                sql: 'INSERT INTO projects (title, description, details, image, category, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
                args: [title || '', description || '', details || '', image_url || '', category || '']
            });
            return res.status(201).json({ success: true });

        } else if (req.method === 'PUT') {
            const { id, title, description, image_url, details, category } = req.body;
            if (image_url !== undefined) {
                await db.execute({
                    sql: 'UPDATE projects SET title = ?, description = ?, details = ?, image = ?, category = ? WHERE id = ?',
                    args: [title || '', description || '', details || '', image_url, category ?? '', id]
                });
            } else {
                await db.execute({
                    sql: 'UPDATE projects SET title = ?, description = ?, details = ?, category = ? WHERE id = ?',
                    args: [title || '', description || '', details || '', category ?? '', id]
                });
            }
            return res.status(200).json({ success: true });

        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await db.execute({
                sql: 'DELETE FROM projects WHERE id = ?',
                args: [id]
            });
            return res.status(200).json({ success: true });

        } else {
            return res.status(405).end();
        }
    } catch (error) {
        console.error('Projects API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
