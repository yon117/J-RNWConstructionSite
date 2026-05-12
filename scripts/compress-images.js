/**
 * compress-images.js
 * Run on server: node scripts/compress-images.js
 * Requires: npm install sharp   (one-time, dev dependency)
 *
 * What it does:
 *   - Walks public/uploads/
 *   - Skips files already under MIN_BYTES
 *   - Resizes if wider/taller than MAX_DIM
 *   - Compresses JPEG/PNG/WebP in-place
 *   - Prints before/after sizes and total saved
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_DIM     = 1600;   // px — max width or height
const JPEG_Q      = 82;     // JPEG quality (0-100)
const PNG_COMP    = 8;      // PNG compression (0-9)
const WEBP_Q      = 82;     // WebP quality
const MIN_BYTES   = 80 * 1024; // skip files already under 80 KB

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function compressImage(filePath) {
    const ext  = path.extname(filePath).toLowerCase();
    const name = path.basename(filePath);
    const originalSize = fs.statSync(filePath).size;

    if (originalSize < MIN_BYTES) {
        console.log(`SKIP  ${name}  (${kb(originalSize)} KB — already small)`);
        return 0;
    }

    const tmp = filePath + '.tmp';

    try {
        let pipeline = sharp(filePath);
        const meta   = await pipeline.metadata();

        if ((meta.width || 0) > MAX_DIM || (meta.height || 0) > MAX_DIM) {
            pipeline = pipeline.resize(MAX_DIM, MAX_DIM, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: JPEG_Q, progressive: true, mozjpeg: true });
        } else if (ext === '.png') {
            pipeline = pipeline.png({ compressionLevel: PNG_COMP, adaptiveFiltering: true });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: WEBP_Q });
        }

        await pipeline.toFile(tmp);

        const newSize = fs.statSync(tmp).size;

        // Only replace if actually smaller
        if (newSize < originalSize) {
            fs.renameSync(tmp, filePath);
            const saved = originalSize - newSize;
            const pct   = ((saved / originalSize) * 100).toFixed(1);
            console.log(`OK    ${name}  ${kb(originalSize)} KB → ${kb(newSize)} KB  (-${pct}%)`);
            return saved;
        } else {
            fs.unlinkSync(tmp);
            console.log(`SKIP  ${name}  (already optimal)`);
            return 0;
        }
    } catch (err) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.error(`ERR   ${name}  ${err.message}`);
        return 0;
    }
}

function walkDir(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walkDir(full));
        } else if (EXTS.has(path.extname(entry.name).toLowerCase())) {
            results.push(full);
        }
    }
    return results;
}

function kb(bytes) {
    return (bytes / 1024).toFixed(0);
}

async function main() {
    if (!fs.existsSync(UPLOADS_DIR)) {
        console.error(`Directory not found: ${UPLOADS_DIR}`);
        process.exit(1);
    }

    const files = walkDir(UPLOADS_DIR);
    console.log(`\nFound ${files.length} images in ${UPLOADS_DIR}\n`);

    let totalSaved = 0;
    for (const file of files) {
        totalSaved += await compressImage(file);
    }

    const savedMB = (totalSaved / 1024 / 1024).toFixed(2);
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`Done. Total saved: ${savedMB} MB across ${files.length} files.`);
}

main().catch(err => { console.error(err); process.exit(1); });
