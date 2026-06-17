import { getDb } from '../lib/db';

const BASE_URL = 'https://jandrnw.com';

const STATIC_URLS = [
    { loc: BASE_URL, priority: '1.0', changefreq: 'weekly' },
    { loc: `${BASE_URL}/services`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${BASE_URL}/projects`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/portland-general-contractor`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/water-damage-restoration-portland`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/siding-contractor-beaverton`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/bathroom-remodel-gresham`, priority: '0.8', changefreq: 'monthly' },
];

function toSlug(title) {
    return String(title || '')
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function generateXml(services) {
    const today = new Date().toISOString().slice(0, 10);

    const serviceUrls = services.map((s) => ({
        loc: `${BASE_URL}/services/${s.slug}`,
        priority: '0.85',
        changefreq: 'monthly',
    }));

    const allUrls = [...STATIC_URLS, ...serviceUrls];

    const urlEntries = allUrls
        .map(
            (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
}

export default function SitemapXml() {
    return null;
}

export async function getServerSideProps({ res }) {
    try {
        const db = await getDb();
        const result = await db.execute('SELECT id, title, slug FROM services ORDER BY id');
        const services = (result.rows || [])
            .map((row) => ({
                id: row.id,
                slug: row.slug || toSlug(row.title),
            }))
            .filter((s) => s.slug);

        const xml = generateXml(services);
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        res.write(xml);
        res.end();
    } catch {
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
        res.end();
    }

    return { props: {} };
}
