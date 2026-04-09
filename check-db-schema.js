const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '/root/jandr/.env' });

async function main() {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoToken = process.env.TURSO_AUTH_TOKEN;

    let db;
    if (tursoUrl && tursoToken) {
        db = createClient({ url: tursoUrl, authToken: tursoToken });
    } else {
        db = createClient({ url: 'file:/root/jandr/jandr.sqlite' });
    }

    try {
        const msgs = await db.execute('PRAGMA table_info(messages)');
        console.log('messages columns:', JSON.stringify(msgs.rows.map(r => r.name)));

        const imgs = await db.execute('PRAGMA table_info(service_images)');
        console.log('service_images columns:', JSON.stringify(imgs.rows.map(r => r.name)));

        const sampleImgs = await db.execute('SELECT * FROM service_images LIMIT 3');
        console.log('sample service_images:', JSON.stringify(sampleImgs.rows));

        const sampleMsgs = await db.execute('SELECT id, status, is_read FROM messages LIMIT 3');
        console.log('sample messages:', JSON.stringify(sampleMsgs.rows));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

main();
