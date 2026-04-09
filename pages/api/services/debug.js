import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
    try {
        const db = await getDb();
        const allTables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");

        // Get schema for each table
        const schemas = {};
        for (const row of allTables.rows) {
            try {
                const s = await db.execute({ sql: "PRAGMA table_info(?)", args: [row.name] });
                schemas[row.name] = s.rows;
            } catch (e) {
                // Try direct string interpolation for PRAGMA
                const s2 = await db.execute(`PRAGMA table_info(${row.name})`);
                schemas[row.name] = s2.rows;
            }
        }

        // Also try direct services query
        let servicesSchema;
        try {
            servicesSchema = await db.execute("PRAGMA table_info(services)");
        } catch (e) {
            servicesSchema = { error: e.message };
        }

        res.status(200).json({
            tables: allTables.rows,
            schemas,
            servicesSchema: servicesSchema.rows || servicesSchema,
            cwd: process.cwd(),
            dbUrl: process.env.TURSO_DATABASE_URL || 'local'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
