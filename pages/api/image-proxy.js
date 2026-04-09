/**
 * Image proxy — development only.
 * Fetches /uploads/* from the production server so local dev
 * can display images that only exist on the VPS.
 *
 * Usage: <img src="/api/image-proxy?path=/uploads/foo.jpg" />
 * (see imageUrl() helper in utils/imageUrl.js)
 */

const PROD_BASE = 'https://www.jandrnwconstruction.com';

export default async function handler(req, res) {
  // Only allow in development / local
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not available in production' });
  }

  const { path } = req.query;
  if (!path || !path.startsWith('/uploads/')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const remoteUrl = `${PROD_BASE}${path}`;

  try {
    const upstream = await fetch(remoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JandRLocalDev/1.0)',
        'Referer': PROD_BASE,
      },
    });

    if (!upstream.ok) {
      console.warn(`[image-proxy] upstream ${upstream.status} for ${remoteUrl}`);
      return res.status(upstream.status).end();
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = await upstream.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 1 day locally
    return res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    console.error('[image-proxy] error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch image from production' });
  }
}
