import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const db = await getDb();

            // Get all project images
            const projectImages = await db.execute('SELECT * FROM project_images ORDER BY project_id, display_order');

            // Get all projects
            const projects = await db.execute('SELECT id, title, image FROM projects');

            res.status(200).json({
                projectImages: projectImages.rows,
                projects: projects.rows
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const db = await getDb();

            // Available images in /assets/
            const availableImages = [
                '/assets/bathroom-reno-1.png',
                '/assets/bathroom-reno-2.png',
                '/assets/kitchen-remodel-1.png',
                '/assets/kitchen-remodel-2.png',
                '/assets/siding-project-1.png',
                '/assets/siding-project-2.png'
            ];

            // Get all project images
            const projectImages = await db.execute('SELECT * FROM project_images ORDER BY id');

            let updated = 0;
            for (let i = 0; i < projectImages.rows.length; i++) {
                const img = projectImages.rows[i];
                const newPath = availableImages[i % availableImages.length];

                await db.execute({
                    sql: 'UPDATE project_images SET image_path = ? WHERE id = ?',
                    args: [newPath, img.id]
                });
                updated++;
            }

            res.status(200).json({
                message: `Updated ${updated} image paths`,
                updated
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
