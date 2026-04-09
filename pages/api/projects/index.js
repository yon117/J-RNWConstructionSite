import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
    try {
        const db = await getDb();

        if (req.method === 'GET') {
            const result = await db.execute('SELECT * FROM projects');
            res.status(200).json(result.rows);
        } else if (req.method === 'POST') {
            const { title, description, image_url, details } = req.body;
            await db.execute({
                sql: 'INSERT INTO projects (title, description, details, image, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
                args: [title || '', description || '', details || '', image_url || '']
            });
            res.status(201).json({ success: true });
        } else if (req.method === 'PUT') {
            const { id, title, description, image_url, details } = req.body;

            // Only update image if explicitly provided
            if (image_url !== undefined) {
                await db.execute({
                    sql: 'UPDATE projects SET title = ?, description = ?, details = ?, image = ? WHERE id = ?',
                    args: [title || '', description || '', details || '', image_url, id]
                });
            } else {
                // Don't update image field if not provided
                await db.execute({
                    sql: 'UPDATE projects SET title = ?, description = ?, details = ? WHERE id = ?',
                    args: [title || '', description || '', details || '', id]
                });
            }
            res.status(200).json({ success: true });
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await db.execute({
                sql: 'DELETE FROM projects WHERE id = ?',
                args: [id]
            });
            res.status(200).json({ success: true });
        } else {
            res.status(405).end();
        }
    } catch (error) {
        console.error('Projects API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
