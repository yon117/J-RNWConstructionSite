
const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.production' });

async function fixImages() {
    console.log('--- Starting Image Fixer (Schema Verified) ---');

    console.log('Connecting to Turso...');
    const db = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN
    });

    try {
        console.log('Updating SERVICES image column...');
        await db.execute(`
            UPDATE services 
            SET image = '/assets/placeholder.jpg' 
            WHERE image LIKE '/uploads/%' OR image IS NULL OR image = ''
        `);

        console.log('Updating PROJECTS image column...');
        await db.execute(`
            UPDATE projects 
            SET image = '/assets/placeholder.jpg' 
            WHERE image LIKE '/uploads/%' OR image IS NULL OR image = ''
        `);

        // Check if project_images exists before trying to update
        try {
            await db.execute("PRAGMA table_info(project_images)");
            console.log('Updating PROJECT_IMAGES table...');
            await db.execute(`
                UPDATE project_images 
                SET image_path = '/assets/placeholder.jpg' 
                WHERE image_path LIKE '/uploads/%'
            `);
        } catch (e) {
            console.log('Skipping project_images (might not exist)');
        }

        // Check if service_images exists
        try {
            await db.execute("PRAGMA table_info(service_images)");
            console.log('Updating SERVICE_IMAGES table...');
            await db.execute(`
                UPDATE service_images 
                SET image_path = '/assets/placeholder.jpg' 
                WHERE image_path LIKE '/uploads/%'
            `);
        } catch (e) {
            console.log('Skipping service_images (might not exist)');
        }

        console.log('Database updated: specific upload paths replaced with placeholder.jpg to prevent 500 errors.');

    } catch (error) {
        console.error('Error fixing images:', error);
    }
}

fixImages();
