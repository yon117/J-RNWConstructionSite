/**
 * imageUrl(path, options)
 *
 * Routes /uploads/ images through the Next.js image optimizer (/_next/image)
 * for automatic WebP/AVIF conversion, resizing, and caching.
 * Absolute URLs (Cloudinary, etc.) are returned as-is.
 *
 * Usage: <img src={imageUrl(service.image_url)} />
 *        <img src={imageUrl(service.image_url, { w: 400 })} />  // thumbnail
 */
export function imageUrl(path, { w = 1200, q = 78 } = {}) {
  if (!path) return '/assets/placeholder.jpg';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/uploads/')) {
    return `/_next/image?url=${encodeURIComponent(path)}&w=${w}&q=${q}`;
  }

  return path;
}

