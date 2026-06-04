import { getDb } from '../../../../lib/db';
import fs from 'fs';
import path from 'path';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../../lib/auth';

async function getImageColumn(db) {
    const result = await db.execute('PRAGMA table_info(project_images)');
    const columns = new Set((result.rows || []).map(column => column.name));
    return columns.has('image_path') ? 'image_path' : 'image_url';
}

async function getProjectImageColumn(db) {
    const result = await db.execute('PRAGMA table_info(projects)');
    const columns = new Set((result.rows || []).map(column => column.name));
    if (columns.has('image')) return 'image';
    if (columns.has('image_url')) return 'image_url';
    return null;
}

function slugifyImageName(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/i, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90);
}

function uniqueUploadPath(uploadDir, filename) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    let candidate = filename;
    let counter = 2;

    while (fs.existsSync(path.join(uploadDir, candidate))) {
        candidate = `${base}-${counter}${ext}`;
        counter += 1;
    }

    return candidate;
}

async function revalidateProjectsPage(res) {
    if (typeof res.revalidate !== 'function') return;

    try {
        await res.revalidate('/projects');
    } catch (error) {
        console.warn('Failed to revalidate /projects:', error.message);
    }
}

async function renameProjectImage(db, projectId, imageColumn, imageId, seoName) {
    const slug = slugifyImageName(seoName);
    if (!slug) {
        return { imageId, success: false, error: 'SEO name is required' };
    }

    const imageResult = await db.execute({
        sql: `SELECT id, ${imageColumn} AS image_path FROM project_images WHERE id = ? AND project_id = ?`,
        args: [imageId, projectId]
    });
    const image = imageResult.rows?.[0];

    if (!image) {
        return { imageId, success: false, error: 'Image not found' };
    }

    const currentPath = image.image_path || '';
    if (!currentPath.startsWith('/uploads/')) {
        return { imageId, success: false, error: 'Only uploaded local images can be renamed', currentPath };
    }

    const ext = path.extname(currentPath) || '.jpg';
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const oldAbsolutePath = path.join(process.cwd(), 'public', currentPath.replace(/^\/+/, ''));
    const desiredFilename = `${slug}${ext.toLowerCase()}`;
    const currentFilename = path.basename(currentPath);
    const filename = currentFilename === desiredFilename
        ? currentFilename
        : uniqueUploadPath(uploadsDir, desiredFilename);
    const newAbsolutePath = path.join(uploadsDir, filename);
    const newImagePath = `/uploads/${filename}`;

    if (oldAbsolutePath !== newAbsolutePath) {
        if (!fs.existsSync(oldAbsolutePath)) {
            return { imageId, success: false, error: 'Image file was not found on the server', currentPath };
        }
        fs.renameSync(oldAbsolutePath, newAbsolutePath);
    }

    await db.execute({
        sql: `UPDATE project_images SET ${imageColumn} = ? WHERE id = ? AND project_id = ?`,
        args: [newImagePath, imageId, projectId]
    });

    const projectImageColumn = await getProjectImageColumn(db);
    if (projectImageColumn) {
        await db.execute({
            sql: `UPDATE projects SET ${projectImageColumn} = ? WHERE id = ? AND ${projectImageColumn} = ?`,
            args: [newImagePath, projectId, currentPath]
        });
    }

    return { imageId, success: true, image_path: newImagePath, old_path: currentPath };
}

export default async function handler(req, res) {
    const { id } = req.query;
    const db = await getDb();
    const imageColumn = await getImageColumn(db);

    if (req.method === 'GET') {
        try {
            const result = await db.execute({
                sql: `SELECT *, ${imageColumn} AS image_path FROM project_images WHERE project_id = ? ORDER BY display_order`,
                args: [id]
            });
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('GET project images error:', error);
            res.status(500).json({ error: 'Failed to fetch project images' });
        }
        return;
    }

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (req.method === 'POST') {
        try {
            const { image_url, display_order } = req.body;

            // Ensure we have a valid image_url
            if (!image_url || image_url === 'null' || image_url === 'undefined') {
                res.status(400).json({ error: 'Image URL is required' });
                return;
            }

            await db.execute({
                sql: `INSERT INTO project_images (project_id, ${imageColumn}, display_order) VALUES (?, ?, ?)`,
                args: [id, image_url, display_order || 0]
            });
            await revalidateProjectsPage(res);
            res.status(201).json({ success: true });
        } catch (error) {
            console.error('POST project image error:', error);
            res.status(500).json({ error: 'Failed to add image' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { images, imageId, seoName, renames } = req.body;

            if (Array.isArray(renames)) {
                const results = [];

                for (const rename of renames) {
                    try {
                        results.push(await renameProjectImage(db, id, imageColumn, rename.imageId, rename.seoName));
                    } catch (error) {
                        results.push({
                            imageId: rename.imageId,
                            success: false,
                            error: error.message || 'Failed to rename image'
                        });
                    }
                }

                if (results.some(result => result.success)) {
                    await revalidateProjectsPage(res);
                }

                res.status(200).json({
                    success: results.every(result => result.success),
                    results
                });
                return;
            }

            if (imageId && seoName !== undefined) {
                const result = await renameProjectImage(db, id, imageColumn, imageId, seoName);

                if (!result.success) {
                    res.status(result.error === 'Image not found' ? 404 : 400).json({ error: result.error });
                    return;
                }

                await revalidateProjectsPage(res);
                res.status(200).json({ success: true, image_path: result.image_path });
                return;
            }

            if (!Array.isArray(images)) {
                res.status(400).json({ error: 'Images are required' });
                return;
            }

            // Update each image's display_order
            for (const img of images) {
                await db.execute({
                    sql: 'UPDATE project_images SET display_order = ? WHERE id = ?',
                    args: [img.display_order, img.id]
                });
            }

            await revalidateProjectsPage(res);
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
            await revalidateProjectsPage(res);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('DELETE project image error:', error);
            res.status(500).json({ error: 'Failed to delete image' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
