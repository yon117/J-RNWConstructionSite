const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

async function compressFile(filepath) {
    const sharp = require('sharp');
    const ext = path.extname(filepath).toLowerCase();
    if (!EXTS.includes(ext)) return;

    const tmp = filepath + '.tmp';
    try {
        let pipeline = sharp(filepath);
        const meta = await pipeline.metadata();
        if ((meta.width || 0) > 1600 || (meta.height || 0) > 1600) {
            pipeline = pipeline.resize(1600, 1600, { fit: 'inside', withoutEnlargement: true });
        }
        if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });
        else if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 8 });
        else if (ext === '.webp') pipeline = pipeline.webp({ quality: 82 });

        await pipeline.toFile(tmp);
        const orig = fs.statSync(filepath).size;
        const compressed = fs.statSync(tmp).size;
        const saved = orig - compressed;
        if (compressed < orig) {
            fs.renameSync(tmp, filepath);
            console.log(`✓ ${path.basename(filepath)}: ${kb(orig)}KB → ${kb(compressed)}KB (saved ${kb(saved)}KB)`);
        } else {
            fs.unlinkSync(tmp);
            console.log(`- ${path.basename(filepath)}: already optimal (${kb(orig)}KB)`);
        }
    } catch (e) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.error(`✗ ${path.basename(filepath)}: ${e.message}`);
    }
}

function kb(bytes) { return Math.round(bytes / 1024); }

async function main() {
    const files = fs.readdirSync(UPLOADS_DIR).filter(f => EXTS.includes(path.extname(f).toLowerCase()));
    console.log(`Found ${files.length} images in ${UPLOADS_DIR}\n`);
    let totalOrig = 0, totalSaved = 0;
    for (const f of files) {
        const fp = path.join(UPLOADS_DIR, f);
        const before = fs.statSync(fp).size;
        await compressFile(fp);
        const after = fs.statSync(fp).size;
        totalOrig += before;
        totalSaved += (before - after);
    }
    console.log(`\nDone. Total saved: ${kb(totalSaved)}KB of ${kb(totalOrig)}KB`);
}

main();
