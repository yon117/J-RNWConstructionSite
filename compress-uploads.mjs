#!/usr/bin/env node
/**
 * compress-uploads.mjs
 * One-time batch compression of all images in /public/uploads/
 * Run on VPS: node compress-uploads.mjs
 * Requires: sharp (already in node_modules)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const MAX_DIM = 1600;
const JPEG_QUALITY = 82;
const PNG_COMPRESSION = 8;
const WEBP_QUALITY = 82;

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function compress(filepath) {
    const ext = path.extname(filepath).toLowerCase();
    if (!SUPPORTED.has(ext)) return null;

    const tmp = filepath + '.tmp';
    try {
        let pipeline = sharp(filepath);
        const meta = await pipeline.metadata();
        const origSize = fs.statSync(filepath).size;

        if ((meta.width || 0) > MAX_DIM || (meta.height || 0) > MAX_DIM) {
            pipeline = pipeline.resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true });
        }

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
        } else if (ext === '.png') {
            pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION, palette: true });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: WEBP_QUALITY });
        }

        await pipeline.toFile(tmp);
        const newSize = fs.statSync(tmp).size;

        if (newSize < origSize) {
            fs.renameSync(tmp, filepath);
            const saved = Math.round((origSize - newSize) / 1024);
            return { file: path.basename(filepath), origKB: Math.round(origSize / 1024), newKB: Math.round(newSize / 1024), savedKB: saved };
        } else {
            fs.unlinkSync(tmp);
            return { file: path.basename(filepath), origKB: Math.round(origSize / 1024), newKB: Math.round(origSize / 1024), savedKB: 0 };
        }
    } catch (e) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.error(`  ERROR ${path.basename(filepath)}: ${e.message}`);
        return null;
    }
}

async function main() {
    if (!fs.existsSync(UPLOADS_DIR)) {
        console.error('uploads dir not found:', UPLOADS_DIR);
        process.exit(1);
    }

    const files = fs.readdirSync(UPLOADS_DIR)
        .filter(f => SUPPORTED.has(path.extname(f).toLowerCase()))
        .map(f => path.join(UPLOADS_DIR, f));

    console.log(`Found ${files.length} images to process...\n`);

    let totalSavedKB = 0;
    let processed = 0;
    let skipped = 0;

    for (const file of files) {
        const result = await compress(file);
        if (!result) { skipped++; continue; }
        processed++;
        totalSavedKB += result.savedKB;
        if (result.savedKB > 0) {
            console.log(`✓ ${result.file}: ${result.origKB}KB → ${result.newKB}KB (saved ${result.savedKB}KB)`);
        }
    }

    console.log(`\nDone. Processed: ${processed}, Skipped: ${skipped}`);
    console.log(`Total saved: ${Math.round(totalSavedKB / 1024 * 10) / 10}MB`);
}

main();
