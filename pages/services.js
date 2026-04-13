import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ContactFormSection from '../components/ContactFormSection';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '../lib/db';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { translateArray } from '../utils/translate';
import { imageUrl } from '../utils/imageUrl';
import { sanitizeServiceText } from '../utils/sanitizeServiceText';
import pageStyles from '../styles/Services.module.css';

// SVG arrow icon
const ArrowIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

// Service tag map — assign a tag label per index
const SERVICE_TAGS = [
    'Interior · Residential',
    'Exterior · Protection',
    'Restoration · Reconstruction',
    'Emergency · 24/7',
    'Exterior · Painting',
    'Interior · Drywall',
    'General · Repairs',
    'Commercial · Residential',
];

export default function Services({ services }) {
    const [showContactModal, setShowContactModal] = useState(false);
    const { t } = useLang();
    const SERVICE_TAG_KEYS = [
        'serviceTag1',
        'serviceTag2',
        'serviceTag3',
        'serviceTag4',
        'serviceTag5',
        'serviceTag6',
        'serviceTag7',
        'serviceTag8',
    ];

    return (
        <Layout
            title={`${t.ourServices} | J&R NW Construction`}
            onContactClick={() => setShowContactModal(true)}
        >
            <div className={pageStyles.servicesPage}>
                <div className={pageStyles.servicesContent}>

                    {/* ── PAGE HERO ── */}
                    <div className={pageStyles.pageHero}>
                        <div className={pageStyles.pageHeroInner}>
                            <div className={pageStyles.sectionLabel}>{t.ourServicesLabel || 'What We Offer'}</div>
                            <h1 className={pageStyles.pageTitle}>
                                {t.ourServices.split(' ')[0]}{' '}
                                <em>{t.ourServices.split(' ').slice(1).join(' ')}</em>
                            </h1>
                            <p className={pageStyles.pageSubtitle}>{t.servicesIntro}</p>
                        </div>
                    </div>

                    {/* ── SERVICE ITEMS ── */}
                    <div className={pageStyles.serviceList}>
                        {services.map((service, index) => {
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
                            const tag = t[SERVICE_TAG_KEYS[index]] || SERVICE_TAGS[index] || t.constructionOregon || 'Construction · Oregon';
                            const serviceTitle = sanitizeServiceText(service.title) || service.title;
                            const serviceDescription = sanitizeServiceText(service.description) || '';

                            return (
                                <div className={pageStyles.serviceItem} key={service.id}>
                                    {/* Image */}
                                    <div className={pageStyles.serviceImgWrap}>
                                        <img
                                            src={imageUrl(service.image_url)}
                                            alt={serviceTitle}
                                            className={pageStyles.serviceImg}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className={pageStyles.serviceContent}>
                                        <div className={pageStyles.serviceNum}>
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <div className={pageStyles.serviceTag}>{tag}</div>
                                        <div className={pageStyles.serviceName}>{serviceTitle}</div>
                                        <p className={pageStyles.serviceDesc}>{serviceDescription}</p>
                                        <Link href={serviceUrl} className={pageStyles.serviceCta}>
                                            {t.learnMore} <ArrowIcon />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Floating Contact Button */}
            <button
                className={pageStyles.floatingContactBtn}
                onClick={() => setShowContactModal(true)}
                aria-label={t.getEstimate}
            >
                <span className={pageStyles.floatingBtnIcon}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </span>
                <span className={pageStyles.floatingBtnText}>{t.getEstimate}</span>
            </button>

            {/* Contact Modal */}
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
