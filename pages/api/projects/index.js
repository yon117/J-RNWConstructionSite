import { getDb } from '../../../lib/db';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';
import { ensureProjectDisplayOrder, projectImageSelect } from '../../../lib/projectOrdering';
import { firstImageByProject } from '../../../lib/projectImageOrdering.mjs';

async function revalidateProjectsPage(res) {
    if (typeof res.revalidate !== 'function') return;

    try {
        await res.revalidate('/projects');
    } catch (error) {
        console.warn('Failed to revalidate /projects:', error.message);
    }
}

async function getProjectImageColumn(db) {
    const result = await db.execute('PRAGMA table_info(project_images)');
    const columns = new Set((result.rows || []).map(column => column.name));
    return columns.has('image_path') ? 'image_path' : 'image_url';
}

export default async function handler(req, res) {
    try {
        const db = await getDb();
        const columns = await ensureProjectDisplayOrder(db);

        if (req.method === 'GET') {
            res.setHeader('Cache-Control', 'no-store');
            const result = await db.execute(`SELECT *, ${projectImageSelect(columns)} FROM projects ORDER BY display_order ASC, id DESC`);
            const rows = result.rows || [];
            const imageColumn = await getProjectImageColumn(db);
            const imagesResult = await db.execute(`SELECT id, project_id, ${imageColumn} AS image_path, display_order FROM project_images ORDER BY project_id ASC, display_order ASC, id ASC`);
            const firstImageMap = firstImageByProject(imagesResult.rows || []);
            const projects = rows.map(project => ({
                ...project,
                image: firstImageMap[project.id] || project.image || project.image_url || ''
            }));
            return res.status(200).json(projects);
        }

        // All write methods require auth
        const cookies = parse(req.headers.cookie || '');
        if (!isValidSessionToken(cookies.admin_token)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method === 'POST') {
            const { title, description, image_url, details, category } = req.body;
            const displayOrder = 1;
            const hasImage = columns.has('image');
            const imageColumn = hasImage ? 'image' : 'image_url';

            await db.execute('UPDATE projects SET display_order = display_order + 1');
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
            const { id, title, description, image_url, image, details, category, projects } = req.body;

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

            const existingResult = await db.execute({
                sql: `SELECT id, title, description, details, category, ${projectImageSelect(columns)} FROM projects WHERE id = ? LIMIT 1`,
                args: [id]
            });
            const existing = existingResult.rows?.[0];

            if (!existing) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const imageColumn = columns.has('image') ? 'image' : 'image_url';
            const nextImage = image_url !== undefined
                ? image_url
                : image !== undefined
                    ? image
                    : existing.image || '';

            await db.execute({
                sql: `UPDATE projects SET title = ?, description = ?, details = ?, ${imageColumn} = ?, category = ? WHERE id = ?`,
                args: [
                    title !== undefined ? title : existing.title || '',
                    description !== undefined ? description : existing.description || '',
                    details !== undefined ? details : existing.details || '',
                    nextImage,
                    category !== undefined ? category : existing.category || '',
                    id
                ]
            });
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
