#!/usr/bin/env node
/**
 * compress-assets.mjs
 * Converts large PNG photo assets to JPEG for massive size reduction.
 * Run on VPS: node compress-assets.mjs
 * Requires: sharp (already in node_modules)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, 'public', 'assets');
const MAX_DIM = 1200;
const JPEG_QUALITY = 80;

// Photos incorrectly stored as PNG — convert to JPEG
const TO_CONVERT = [
  'ws-siding-rot.png',
  'ws-flooding.png',
  'ws-floor-rot.png',
  'ws-bathroom-mold.png',
  'ws-ceiling-stains.png',
  'service-mold-remediation.png',
  'service-structural-support-repair.png',
  'siding-project-1.png',
  'siding-project-2.png',
  'bathroom-reno-1.png',
  'bathroom-reno-2.png',
  'kitchen-remodel-1.png',
  'kitchen-remodel-2.png',
  'fire-damage.png',
  'finishing.png',
  'drywall.png',
];

async function convertToJpeg(srcFile) {
  const srcPath = path.join(ASSETS_DIR, srcFile);
  if (!fs.existsSync(srcPath)) {
    console.log(`  SKIP (not found): ${srcFile}`);
    return null;
  }

  const baseName = path.basename(srcFile, '.png');
  const destPath = path.join(ASSETS_DIR, baseName + '.jpg');
  const tmp = destPath + '.tmp';

  try {
    const origSize = fs.statSync(srcPath).size;
    let pipeline = sharp(srcPath);
    const meta = await pipeline.metadata();

    if ((meta.width || 0) > MAX_DIM || (meta.height || 0) > MAX_DIM) {
      pipeline = pipeline.resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true });
    }

    await pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true }).toFile(tmp);
    const newSize = fs.statSync(tmp).size;
    fs.renameSync(tmp, destPath);

    const savedMB = ((origSize - newSize) / (1024 * 1024)).toFixed(1);
    console.log(`✓ ${srcFile} → ${baseName}.jpg  ${Math.round(origSize / 1024)}KB → ${Math.round(newSize / 1024)}KB  (saved ${savedMB}MB)`);
    return origSize - newSize;
  } catch (e) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.error(`  ERROR ${srcFile}: ${e.message}`);
    return 0;
  }
}

async function main() {
  console.log('Converting PNG photos → JPEG in /public/assets/...\n');
  let totalSaved = 0;

  for (const file of TO_CONVERT) {
    const saved = await convertToJpeg(file);
    if (saved) totalSaved += saved;
  }

  console.log(`\nTotal saved: ${(totalSaved / (1024 * 1024)).toFixed(1)}MB`);
}

main();
