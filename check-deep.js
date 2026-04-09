const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- DEEP VPS DIAGNOSIS ---');
console.log('Time:', new Date().toISOString());
console.log('CWD:', process.cwd());

// 1. Check Filesystem
console.log('\n--- Checking Important Files ---');
const filesToCheck = [
    '.env',
    '.env.production',
    'package.json',
    'next.config.js',
    'next.config.ts',
    'public/assets/placeholder.jpg'
];

filesToCheck.forEach(f => {
    const exists = fs.existsSync(f);
    console.log(`${f}: ${exists ? 'EXISTS' : 'MISSING'}`);
    if (exists && f.startsWith('.env')) {
        const content = fs.readFileSync(f, 'utf8');
        console.log(`  Content preview: ${content.split('\n').filter(l => l.includes('TURSO')).join('\n')}`);
    }
});

// 2. Check Uploads Directory
console.log('\n--- Checking Uploads Directory ---');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    console.log(`Directory exists. Contains ${files.length} files.`);
    console.log('First 5 files:', files.slice(0, 5));
} else {
    console.log('public/uploads directory MISSING!');
}

// 3. Database Connection Test
console.log('\n--- Testing Database Connection (Turso) ---');
try {
    // Try to read env vars
    let dbUrl, dbToken;
    if (fs.existsSync('.env.production')) {
        const env = fs.readFileSync('.env.production', 'utf8');
        const urlMatch = env.match(/TURSO_DATABASE_URL=(.*)/);
        const tokenMatch = env.match(/TURSO_AUTH_TOKEN=(.*)/);
        if (urlMatch) dbUrl = urlMatch[1].trim();
        if (tokenMatch) dbToken = tokenMatch[1].trim();
    }

    // Fallback to process.env
    if (!dbUrl) dbUrl = process.env.TURSO_DATABASE_URL;
    if (!dbToken) dbToken = process.env.TURSO_AUTH_TOKEN;

    console.log('Using URL:', dbUrl);
    console.log('Using Token:', dbToken ? (dbToken.substring(0, 10) + '...') : 'MISSING');

    if (!dbUrl || !dbToken) {
        console.error('CRITICAL: Missing Turso credentials!');
    } else {
        // Attempt connection using pure HTTP if @libsql/client isn't available, but it should be.
        // We'll try to require the client.
        try {
            const { createClient } = require('@libsql/client');
            const client = createClient({ url: dbUrl, authToken: dbToken });

            // Inspect Schema
            console.log('Inspecting SERVICES table schema...');
            client.execute("PRAGMA table_info(services)")
                .then(res => {
                    console.log('Services Columns:', res.rows);
                })
                .catch(err => {
                    console.error('Schema check failed:', err.message);
                });

            client.execute("PRAGMA table_info(projects)")
                .then(res => {
                    console.log('Projects Columns:', res.rows);
                })
                .catch(err => {
                    console.error('Schema check failed:', err.message);
                });


        } catch (e) {
            console.error('Could not load @libsql/client:', e.message);
            console.log('Checking node_modules...');
            console.log(execSync('ls -F node_modules/@libsql/client').toString());
        }
    }

} catch (e) {
    console.error('Database check error:', e.message);
}

// 4. Check PM2 Env
console.log('\n--- Checking PM2 Environment ---');
try {
    const pm2Env = execSync('pm2 env jandr').toString();
    const pm2Url = pm2Env.match(/TURSO_DATABASE_URL: '(.*)'/);
    console.log('PM2 TURSO_DATABASE_URL:', pm2Url ? pm2Url[1] : 'NOT FOUND');
} catch (e) {
    console.log('Could not check PM2 env:', e.message);
}

console.log('\n--- DIAGNOSIS COMPLETE ---');
