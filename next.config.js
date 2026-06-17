/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimización de imágenes — agregar WebP/AVIF
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  async redirects() {
    return [
      { source: '/services/paiting', destination: '/services/painting', permanent: true },
      { source: '/services/paint', destination: '/services/painting', permanent: true },
      { source: '/services/interior-construction-and-remodeling', destination: '/services/remodeling', permanent: true },
      { source: '/services/restoration-and-reconstruction', destination: '/services/reconstruction', permanent: true },
      { source: '/services/mitigation-and-emergency-services', destination: '/services/mitigation', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff|woff2|ttf|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Only apply immutable caching in production — dev needs revalidation
      ...(process.env.NODE_ENV === 'production' ? [{
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      }] : []),
    ];
  },
};

module.exports = nextConfig;