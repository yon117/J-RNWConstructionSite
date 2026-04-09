import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
    const db = await getDb();

    if (req.method === 'GET') {
        try {
            const result = await db.execute('SELECT * FROM messages ORDER BY created_at DESC');
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Messages GET error:', error);
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id, status } = req.body;
            if (status) {
                const isRead = status !== 'new' ? 1 : 0;
                await db.execute({
                    sql: 'UPDATE messages SET status = ?, is_read = ? WHERE id = ?',
                    args: [status, isRead, id]
                });
            } else {
                await db.execute({
                    sql: 'UPDATE messages SET is_read = 1 WHERE id = ?',
                    args: [id]
                });
            }
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Messages PUT error:', error);
            res.status(500).json({ error: 'Failed to update message' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id } = req.body;
            await db.execute({
                sql: 'DELETE FROM messages WHERE id = ?',
                args: [id]
            });
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Messages DELETE error:', error);
            res.status(500).json({ error: 'Failed to delete message' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
