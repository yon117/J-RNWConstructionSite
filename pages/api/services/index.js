import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
    console.log(`\n========== ${req.method} /api/services ==========`);

    try {
        const db = await getDb();

        if (req.method === 'GET') {
            console.log('Fetching all services...');
            const result = await db.execute(`
                SELECT
                    id, title, description, header_desc, image, details, name,
                    slug, page_title, subtitle,
                    ksp_title_1, ksp_desc_1,
                    ksp_title_2, ksp_desc_2,
                    ksp_title_3, ksp_desc_3,
                    ksp_title_4, ksp_desc_4,
                    process_desc,
                    faq_q_1, faq_a_1,
                    faq_q_2, faq_a_2,
                    faq_q_3, faq_a_3,
                    faq_q_4, faq_a_4,
                    faq_q_5, faq_a_5
                FROM services
            `);
            console.log(`Found ${result.rows?.length || 0} services`);

            const services = result.rows.map(s => ({
                id:           s.id,
                title:        s.title,
                name:         s.title,
                description:  s.description,
                header_desc:  s.header_desc  || '',
                image_url:    s.image,
                image:        s.image,
                details:      s.details      || '',
                slug:         s.slug         || '',
                page_title:   s.page_title   || '',
                subtitle:     s.subtitle     || '',
                ksp_title_1:  s.ksp_title_1  || '',
                ksp_desc_1:   s.ksp_desc_1   || '',
                ksp_title_2:  s.ksp_title_2  || '',
                ksp_desc_2:   s.ksp_desc_2   || '',
                ksp_title_3:  s.ksp_title_3  || '',
                ksp_desc_3:   s.ksp_desc_3   || '',
                ksp_title_4:  s.ksp_title_4  || '',
                ksp_desc_4:   s.ksp_desc_4   || '',
                process_desc: s.process_desc || '',
                faq_q_1:      s.faq_q_1      || '',
                faq_a_1:      s.faq_a_1      || '',
                faq_q_2:      s.faq_q_2      || '',
                faq_a_2:      s.faq_a_2      || '',
                faq_q_3:      s.faq_q_3      || '',
                faq_a_3:      s.faq_a_3      || '',
                faq_q_4:      s.faq_q_4      || '',
                faq_a_4:      s.faq_a_4      || '',
                faq_q_5:      s.faq_q_5      || '',
                faq_a_5:      s.faq_a_5      || '',
            }));

            console.log('Services:', services.map(s => `ID:${s.id} Title:"${s.title}"`).join(', '));
            return res.status(200).json(services);

        } else if (req.method === 'POST') {
            const {
                name, title, description, header_desc, details, image_url, image,
                slug, page_title, subtitle,
                ksp_title_1, ksp_desc_1,
                ksp_title_2, ksp_desc_2,
                ksp_title_3, ksp_desc_3,
                ksp_title_4, ksp_desc_4,
                process_desc,
                faq_q_1, faq_a_1,
                faq_q_2, faq_a_2,
                faq_q_3, faq_a_3,
                faq_q_4, faq_a_4,
                faq_q_5, faq_a_5,
            } = req.body;

            const serviceName = title || name || '';
            const imageVal    = image_url || image || '';

            console.log('Creating service:', serviceName);

            await db.execute({
                sql: `INSERT INTO services (
                    title, description, header_desc, image, details,
                    slug, page_title, subtitle,
                    ksp_title_1, ksp_desc_1,
                    ksp_title_2, ksp_desc_2,
                    ksp_title_3, ksp_desc_3,
                    ksp_title_4, ksp_desc_4,
                    process_desc,
                    faq_q_1, faq_a_1,
                    faq_q_2, faq_a_2,
                    faq_q_3, faq_a_3,
                    faq_q_4, faq_a_4,
                    faq_q_5, faq_a_5
                ) VALUES (
                    ?, ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?,
                    ?, ?,
                    ?, ?,
                    ?, ?,
                    ?,
                    ?, ?,
                    ?, ?,
                    ?, ?,
                    ?, ?,
                    ?, ?
                )`,
                args: [
                    serviceName, description || '', header_desc || '', imageVal, details || '',
                    slug || '', page_title || '', subtitle || '',
                    ksp_title_1 || '', ksp_desc_1 || '',
                    ksp_title_2 || '', ksp_desc_2 || '',
                    ksp_title_3 || '', ksp_desc_3 || '',
                    ksp_title_4 || '', ksp_desc_4 || '',
                    process_desc || '',
                    faq_q_1 || '', faq_a_1 || '',
                    faq_q_2 || '', faq_a_2 || '',
                    faq_q_3 || '', faq_a_3 || '',
                    faq_q_4 || '', faq_a_4 || '',
                    faq_q_5 || '', faq_a_5 || '',
                ]
            });
            console.log('Service created successfully');
            return res.status(201).json({ success: true });

        } else if (req.method === 'PUT') {
            const {
                id, name, title, description, header_desc, details, image_url, image,
                slug, page_title, subtitle,
                ksp_title_1, ksp_desc_1,
                ksp_title_2, ksp_desc_2,
                ksp_title_3, ksp_desc_3,
                ksp_title_4, ksp_desc_4,
                process_desc,
                faq_q_1, faq_a_1,
                faq_q_2, faq_a_2,
                faq_q_3, faq_a_3,
                faq_q_4, faq_a_4,
                faq_q_5, faq_a_5,
            } = req.body;

            const serviceName = title || name || '';
            const imageVal    = image_url !== undefined ? image_url : (image !== undefined ? image : undefined);

            console.log(`Updating service ${id}: name="${serviceName}"`);

            if (imageVal !== undefined && !serviceName && !description) {
                // Image-only update
                await db.execute({
                    sql: 'UPDATE services SET image = ? WHERE id = ?',
                    args: [imageVal, id]
                });
            } else {
                await db.execute({
                    sql: `UPDATE services SET
                        title = ?, description = ?, header_desc = ?, image = ?, details = ?,
                        slug = ?, page_title = ?, subtitle = ?,
                        ksp_title_1 = ?, ksp_desc_1 = ?,
                        ksp_title_2 = ?, ksp_desc_2 = ?,
                        ksp_title_3 = ?, ksp_desc_3 = ?,
                        ksp_title_4 = ?, ksp_desc_4 = ?,
                        process_desc = ?,
                        faq_q_1 = ?, faq_a_1 = ?,
                        faq_q_2 = ?, faq_a_2 = ?,
                        faq_q_3 = ?, faq_a_3 = ?,
                        faq_q_4 = ?, faq_a_4 = ?,
                        faq_q_5 = ?, faq_a_5 = ?
                    WHERE id = ?`,
                    args: [
                        serviceName, description || '', header_desc || '', imageVal || '', details || '',
                        slug || '', page_title || '', subtitle || '',
                        ksp_title_1 || '', ksp_desc_1 || '',
                        ksp_title_2 || '', ksp_desc_2 || '',
                        ksp_title_3 || '', ksp_desc_3 || '',
                        ksp_title_4 || '', ksp_desc_4 || '',
                        process_desc || '',
                        faq_q_1 || '', faq_a_1 || '',
                        faq_q_2 || '', faq_a_2 || '',
                        faq_q_3 || '', faq_a_3 || '',
                        faq_q_4 || '', faq_a_4 || '',
                        faq_q_5 || '', faq_a_5 || '',
                        id
                    ]
                });
            }

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
