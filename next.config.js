/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimización de imágenes — agregar WebP/AVIF
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        // Cache largo para assets estáticos
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff|woff2|ttf|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache para JS/CSS de Next.js
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;