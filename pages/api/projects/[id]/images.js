import { getDb } from '../../../../lib/db';

export default async function handler(req, res) {
    const { id } = req.query;
    const db = await getDb();

    if (req.method === 'GET') {
        try {
            const result = await db.execute({
                sql: 'SELECT * FROM project_images WHERE project_id = ? ORDER BY display_order',
                args: [id]
            });
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('GET project images error:', error);
            res.status(500).json({ error: 'Failed to fetch project images' });
        }
    } else if (req.method === 'POST') {
        try {
            const { image_url, display_order } = req.body;

            // Ensure we have a valid image_url
            if (!image_url || image_url === 'null' || image_url === 'undefined') {
                res.status(400).json({ error: 'Image URL is required' });
                return;
            }

            await db.execute({
                sql: 'INSERT INTO project_images (project_id, image_path, display_order) VALUES (?, ?, ?)',
                args: [id, image_url, display_order || 0]
            });
            res.status(201).json({ success: true });
        } catch (error) {
            console.error('POST project image error:', error);
            res.status(500).json({ error: 'Failed to add image' });
        }
    } else if (req.method === 'PUT') {
        // Update display order for multiple images
        try {
            const { images } = req.body;

            // Update each image's display_order
            for (const img of images) {
                await db.execute({
                    sql: 'UPDATE project_images SET display_order = ? WHERE id = ?',
                    args: [img.display_order, img.id]
                });
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('PUT project images error:', error);
            res.status(500).json({ error: 'Failed to update image order' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { imageId } = req.body;
            await db.execute({
                sql: 'DELETE FROM project_images WHERE id = ?',
                args: [imageId]
            });
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('DELETE project image error:', error);
            res.status(500).json({ error: 'Failed to delete image' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
