import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
    console.log(`\n========== ${req.method} /api/services ==========`);

    try {
        const db = await getDb();

        if (req.method === 'GET') {
            console.log('Fetching all services...');
            const result = await db.execute('SELECT * FROM services');
            console.log(`Found ${result.rows?.length || 0} services`);

            // Production database has: id, title, description, details, image
            // Frontend expects: id, title, description, details, image_url
            const services = (result.rows || []).map(s => ({
                id: s.id,
                title: s.title || '',
                description: s.description || '',
                details: s.details || '',
                image_url: s.image || '',  // Map 'image' to 'image_url'
                created_at: s.created_at
            }));

            console.log('Services:', services.map(s => `ID:${s.id} Title:"${s.title}"`).join(', '));
            return res.status(200).json(services);

        } else if (req.method === 'POST') {
            const { name, title, description, details, image_url } = req.body;
            const serviceTitle = title || name || '';

            console.log('Creating service:', serviceTitle);

            // Production columns: title, description, details, image
            await db.execute({
                sql: 'INSERT INTO services (title, description, details, image) VALUES (?, ?, ?, ?)',
                args: [serviceTitle, description || '', details || '', image_url || '']
            });

            console.log('Service created successfully');
            return res.status(201).json({ success: true });

        } else if (req.method === 'PUT') {
            const { id, name, title, description, details, image_url } = req.body;
            const serviceTitle = title || name || '';

            console.log(`Updating service ${id}: title="${serviceTitle}"`);

            // Production columns: title, description, details, image
            await db.execute({
                sql: 'UPDATE services SET title = ?, description = ?, details = ?, image = ? WHERE id = ?',
                args: [serviceTitle, description || '', details || '', image_url || '', id]
            });

            console.log('Service updated successfully');
            return res.status(200).json({ success: true });

        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            console.log('Deleting service:', id);

            await db.execute({
                sql: 'DELETE FROM services WHERE id = ?',
                args: [id]
            });

            console.log('Service deleted successfully');
            return res.status(200).json({ success: true });

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('API ERROR:', error.message);
        console.error('Stack:', error.stack);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    } finally {
        console.log('========== END ==========\n');
    }
}
