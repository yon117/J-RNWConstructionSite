import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ContactFormSection from '../components/ContactFormSection';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import pageStyles from '../styles/Services.module.css';
import { getDb } from '../lib/db';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { translateArray } from '../utils/translate';
import { imageUrl } from '../utils/imageUrl';

export default function Services({ services }) {
    const [showContactModal, setShowContactModal] = useState(false);
    const { t } = useLang();

    return (
        <Layout title="Our Services | J&R NW Construction" onContactClick={() => setShowContactModal(true)}>
            <div className={pageStyles.servicesPage}>
                <div className={`container ${pageStyles.servicesContent}`} style={{ padding: '40px 20px' }}>
                    <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', lineHeight: '1.2', padding: '0 15px' }}>{t.ourServices}</h1>
                    <div className={styles.modalIntro}>
                        <p>{t.servicesIntro}</p>
                    </div>
                    <div className={styles.servicesGrid}>
                        {services.map(service => {
                            // Use stored slug from DB; fall back to title-generated slug
                            const slug = service.slug
                                || (service.title
                                    ? service.title
                                        .toLowerCase()
                                        .trim()
                                        .replace(/&/g, 'and')
                                        .replace(/[^a-z0-9]+/g, '-')
                                        .replace(/^-+|-+$/g, '')
                                    : 'service');
                            const serviceUrl = `/services/${slug}`;

                            return (
                                <Link href={serviceUrl} key={service.id} style={{ textDecoration: 'none' }}>
                                    <div className={styles.serviceCard}>
                                        <img src={imageUrl(service.image_url)} alt={service.title} />
                                        <div className={styles.cardContent}>
                                            <h3>{service.title}</h3>
                                            <p>{service.description}</p>
                                            <span className={styles.learnMore}>{t.learnMore}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Floating Contact Button */}
            <button
                className={styles.floatingContactBtn}
                onClick={() => setShowContactModal(true)}
                aria-label={t.getEstimate}
            >
                <span className={styles.floatingBtnIcon}>💬</span>
                <span className={styles.floatingBtnText}>{t.getEstimate}</span>
            </button>

            {/* Contact Form Modal */}
            {showContactModal && (
                <Modal title={t.getInTouch} onClose={() => setShowContactModal(false)}>
                    <ContactFormSection />
                </Modal>
            )}
        </Layout>
    );
}

export async function getServerSideProps({ req }) {
    const db = await getDb();
    const result = await db.execute(
        'SELECT id, title, description, image, slug FROM services'
    );

    // Detect local dev by host header
    const host = req.headers.host || '';
    const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');

    function resolveImage(imgPath) {
        if (!imgPath) return '/assets/placeholder.jpg';
        if (imgPath.startsWith('http')) return imgPath;
        if (isLocal && imgPath.startsWith('/uploads/')) {
            return `/api/image-proxy?path=${encodeURIComponent(imgPath)}`;
        }
        return imgPath;
    }

    const rows = result.rows || [];
    const lang = req.cookies?.lang || 'en';
    const titles = await translateArray(rows.map(s => s.title || ''), lang);
    const descs = await translateArray(rows.map(s => s.description || ''), lang);
    const services = rows.map((s, i) => ({
        id:          s.id,
        title:       titles[i],
        description: descs[i],
        image_url:   resolveImage(s.image),
        slug:        s.slug || '',
    }));

    return { props: { services } };
}
