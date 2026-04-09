import { getDb } from '../../../../lib/db';

export default async function handler(req, res) {
    const { id } = req.query;
    const db = await getDb();

    if (req.method === 'GET') {
        try {
            const result = await db.execute({
                sql: 'SELECT * FROM service_images WHERE service_id = ? ORDER BY display_order',
                args: [id]
            });
            // Normalize: map image_path -> image_url for frontend
            const rows = result.rows.map(r => ({
                ...r,
                image_url: r.image_path || r.image_url
            }));
            res.status(200).json(rows);
        } catch (error) {
            console.error('GET service images error:', error);
            res.status(500).json({ error: 'Failed to fetch service images' });
        }
    } else if (req.method === 'POST') {
        try {
            const { image_url, image_path, display_order } = req.body;
            const imageVal = image_url || image_path;

            if (!imageVal || imageVal === 'null' || imageVal === 'undefined') {
                res.status(400).json({ error: 'Image URL is required' });
                return;
            }

            await db.execute({
                sql: 'INSERT INTO service_images (service_id, image_path, display_order) VALUES (?, ?, ?)',
                args: [id, imageVal, display_order || 0]
            });
            res.status(201).json({ success: true });
        } catch (error) {
            console.error('POST service image error:', error);
            res.status(500).json({ error: 'Failed to add image', details: error.message });
        }
    } else if (req.method === 'PUT') {
        try {
            const { images } = req.body;
            for (const img of images) {
                await db.execute({
                    sql: 'UPDATE service_images SET display_order = ? WHERE id = ?',
                    args: [img.display_order, img.id]
                });
            }
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('PUT service images error:', error);
            res.status(500).json({ error: 'Failed to update image order' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { imageId } = req.body;
            await db.execute({
                sql: 'DELETE FROM service_images WHERE id = ?',
                args: [imageId]
            });
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('DELETE service image error:', error);
            res.status(500).json({ error: 'Failed to delete image' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

