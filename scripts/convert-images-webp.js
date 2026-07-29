const sharp = require('sharp');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');

const INTERACTIVE_HOUSE_IMAGES = [
  'images/exterior-main.png',
  'images/exterior-siding-before-after.png',
  'images/exterior-emergency.png',
  'images/exterior-remodeling-before-after.png',
  'images/interior-main.png',
  'images/interior-remodeling.png',
  'images/interior-additions.png',
  'images/interior-drywall.png',
  'images/interior-restoration.png',
  'images/interior-mitigation.png',
  'images/interior-emergency.png',
];

async function convert(relPath, targetSize) {
  const src = path.join(ROOT, relPath);
  const dest = src.replace(/\.png$/i, '.webp');
  await sharp(src)
    .resize(targetSize, targetSize, { fit: 'cover' })
    .webp({ quality: 82 })
    .toFile(dest);
  console.log(`${relPath} -> ${path.relative(ROOT, dest)}`);
}

async function run() {
  for (const img of INTERACTIVE_HOUSE_IMAGES) {
    await convert(img, 722);
  }
  await convert('warranty-badge.png', 242);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
