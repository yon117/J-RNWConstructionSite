import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getDb } from '../../lib/db';
import { useLang } from '../../context/LanguageContext';
import { imageUrl } from '../../utils/imageUrl';
import { sanitizeServiceText } from '../../utils/sanitizeServiceText';
import styles from '../../styles/ServicePreview.module.css';

function getServiceSlug(service) {
    return (
        service.slug
        || (service.title
            ? service.title
                .toLowerCase()
                .trim()
                .replace(/&/g, 'and')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            : 'service')
    );
}

export default function ServicePreviewIndex({ services }) {
    const { t } = useLang();

    return (
        <Layout
            title="Service Preview | J&R NW Construction"
            description="Isolated service detail prototype preview."
            canonical="/service-preview"
        >
            <Head>
                <meta name="robots" content="noindex,nofollow" />
            </Head>

            <div className={styles.previewIndexPage}>
                <div className={styles.previewIndexShell}>
                    <div className={styles.previewIndexIntro}>
                        <p className={styles.previewEyebrow}>Isolated preview route</p>
                        <h1 className={styles.previewIndexTitle}>Service detail prototype</h1>
                        <p className={styles.previewIndexText}>
                            Same service data. Separate route. Live page untouched.
                        </p>
                    </div>

                    <div className={styles.previewIndexGrid}>
                        {services.map((service, index) => {
                            const slug = getServiceSlug(service);
                            const title = sanitizeServiceText(service.title) || service.title;
                            const description = sanitizeServiceText(service.description || service.header_desc || '');

                            return (
                                <Link
                                    key={service.id}
                                    href={`/service-preview/${slug}`}
                                    className={styles.previewServiceCard}
                                >
                                    <div
                                        className={styles.previewServiceImage}
                                        style={{ backgroundImage: `url(${imageUrl(service.image_url)})` }}
                                    />
                                    <div className={styles.previewServiceOverlay} />
                                    <div className={styles.previewServiceContent}>
                                        <span className={styles.previewServiceNumber}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h2>{title}</h2>
                                        <p>
                                            {description.length > 120
                                                ? `${description.slice(0, 120)}...`
                                                : description || (t.learnMore || 'Open preview')}
                                        </p>
                                        <span className={styles.previewServiceLink}>Open prototype</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

let servicesCache = null;
let servicesCacheTime = 0;
const CACHE_TTL = 55_000;

export async function getStaticProps() {
    const now = Date.now();
    if (servicesCache && (now - servicesCacheTime) < CACHE_TTL) {
        return { props: { services: servicesCache }, revalidate: 60 };
    }

    const db = await getDb();
    const result = await db.execute(`
        SELECT id, title, description, header_desc, image, slug
        FROM services
        ORDER BY id ASC
    `);

    const services = (result.rows || []).map((service) => ({
        id: service.id,
        title: service.title || '',
        description: service.description || '',
        header_desc: service.header_desc || '',
        image_url: service.image || '/assets/placeholder.jpg',
        slug: service.slug || '',
    }));

    servicesCache = services;
    servicesCacheTime = now;

    return {
        props: { services },
        revalidate: 60,
    };
}
