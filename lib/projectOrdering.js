export async function getProjectColumns(db) {
    const result = await db.execute('PRAGMA table_info(projects)');
    return new Set((result.rows || []).map(column => column.name));
}

export function projectImageSelect(columns) {
    if (columns.has('image')) return 'image';
    if (columns.has('image_url')) return 'image_url AS image';
    return "'' AS image";
}

export async function ensureProjectDisplayOrder(db) {
    const columns = await getProjectColumns(db);
    if (!columns.has('display_order')) {
        await db.execute('ALTER TABLE projects ADD COLUMN display_order INTEGER');
        columns.add('display_order');
    }

    const existing = await db.execute('SELECT id, display_order FROM projects ORDER BY id DESC');
    const rows = existing.rows || [];

    for (let index = 0; index < rows.length; index += 1) {
        if (rows[index].display_order === null || rows[index].display_order === undefined) {
            await db.execute({
                sql: 'UPDATE projects SET display_order = ? WHERE id = ?',
                args: [index + 1, rows[index].id]
            });
        }
    }

    return columns;
}
