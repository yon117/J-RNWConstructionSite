import { getDb } from '../../../lib/db';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';
import { ensureProjectDisplayOrder, projectImageSelect } from '../../../lib/projectOrdering';

async function revalidateProjectsPage(res) {
    if (typeof res.revalidate !== 'function') return;

    try {
        await res.revalidate('/projects');
    } catch (error) {
        console.warn('Failed to revalidate /projects:', error.message);
    }
}

export default async function handler(req, res) {
    try {
        const db = await getDb();
        const columns = await ensureProjectDisplayOrder(db);

        if (req.method === 'GET') {
            res.setHeader('Cache-Control', 'no-store');
            const result = await db.execute(`SELECT *, ${projectImageSelect(columns)} FROM projects ORDER BY display_order ASC, id DESC`);
            return res.status(200).json(result.rows);
        }

        // All write methods require auth
        const cookies = parse(req.headers.cookie || '');
        if (!isValidSessionToken(cookies.admin_token)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method === 'POST') {
            const { title, description, image_url, details, category } = req.body;
            const maxOrderResult = await db.execute('SELECT COALESCE(MAX(display_order), 0) AS max_order FROM projects');
            const displayOrder = (maxOrderResult.rows?.[0]?.max_order || 0) + 1;
            const hasImage = columns.has('image');
            const imageColumn = hasImage ? 'image' : 'image_url';

            await db.execute({
                sql: `INSERT INTO projects (title, description, details, ${imageColumn}, category, display_order) VALUES (?, ?, ?, ?, ?, ?)`,
                args: [title || '', description || '', details || '', image_url || '', category || '', displayOrder]
            });
            const newProject = await db.execute({
                sql: `
                    SELECT id, title, description, details, category, display_order, ${projectImageSelect(columns)}
                    FROM projects
                    WHERE display_order = ?
                    ORDER BY id DESC
                    LIMIT 1
                `,
                args: [displayOrder]
            });
            await revalidateProjectsPage(res);
            return res.status(201).json({ success: true, project: newProject.rows?.[0] || null });

        } else if (req.method === 'PUT') {
            const { id, title, description, image_url, details, category, projects } = req.body;

            if (Array.isArray(projects)) {
                for (const project of projects) {
                    await db.execute({
                        sql: 'UPDATE projects SET display_order = ? WHERE id = ?',
                        args: [project.display_order, project.id]
                    });
                }
                await revalidateProjectsPage(res);
                return res.status(200).json({ success: true });
            }

            if (image_url !== undefined) {
                const imageColumn = columns.has('image') ? 'image' : 'image_url';
                await db.execute({
                    sql: `UPDATE projects SET title = ?, description = ?, details = ?, ${imageColumn} = ?, category = ? WHERE id = ?`,
                    args: [title || '', description || '', details || '', image_url, category ?? '', id]
                });
            } else {
                await db.execute({
                    sql: 'UPDATE projects SET title = ?, description = ?, details = ?, category = ? WHERE id = ?',
                    args: [title || '', description || '', details || '', category ?? '', id]
                });
            }
            await revalidateProjectsPage(res);
            return res.status(200).json({ success: true });

        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await db.execute({
                sql: 'DELETE FROM projects WHERE id = ?',
                args: [id]
            });
            await revalidateProjectsPage(res);
            return res.status(200).json({ success: true });

        } else {
            return res.status(405).end();
        }
    } catch (error) {
        console.error('Projects API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
