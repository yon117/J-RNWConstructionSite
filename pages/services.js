import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ContactFormSection from '../components/ContactFormSection';
import { useLang } from '../context/LanguageContext';
import { getDb } from '../lib/db';
import pageStyles from '../styles/Services.module.css';
import { imageUrl } from '../utils/imageUrl';
import { sanitizeServiceText } from '../utils/sanitizeServiceText';

const ArrowIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const SERVICE_TAGS = [
    'Interior - Residential',
    'Exterior - Protection',
    'Restoration - Reconstruction',
    'Emergency - 24/7',
    'Exterior - Painting',
    'Interior - Drywall',
    'General - Repairs',
    'Commercial - Residential',
];

function MobileContainerScrollCard({ children, className, ...props }) {
    const cardRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const syncViewport = (event) => {
            setIsMobile(event?.matches ?? mediaQuery.matches);
        };

        syncViewport();

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', syncViewport);
            return () => mediaQuery.removeEventListener('change', syncViewport);
        }

        mediaQuery.addListener(syncViewport);
        return () => mediaQuery.removeListener(syncViewport);
    }, []);

    const { scrollYProgress } = useScroll(
        mounted ? { target: cardRef, offset: ['start end', 'end start'] } : {}
    );

    const rotate = useTransform(scrollYProgress, [0, 1], [16, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

    return (
        <motion.div
            ref={cardRef}
            className={className}
            style={
                isMobile && !prefersReducedMotion
                    ? {
                        rotateX: rotate,
                        scale,
                        width: '100%',
                        transformPerspective: 1000,
                        transformOrigin: 'center top',
                        willChange: 'transform',
                        boxShadow:
                            '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
                    }
                    : undefined
            }
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default function Services({ services }) {
    const [showContactModal, setShowContactModal] = useState(false);
    const { t, lang } = useLang();
    const [displayServices, setDisplayServices] = useState(services);

    useEffect(() => {
        if (!lang || lang === 'en') {
            setDisplayServices(services);
            return;
        }

        let cancelled = false;

        async function translate() {
            const { translateArray } = await import('../utils/translate');
            const titles = await translateArray(services.map((service) => service.title), lang);
            const descriptions = await translateArray(services.map((service) => service.description), lang);

            if (!cancelled) {
                setDisplayServices(
                    services.map((service, index) => ({
                        ...service,
                        title: titles[index],
                        description: descriptions[index],
                    }))
                );
            }
        }

        translate();

        return () => {
            cancelled = true;
        };
    }, [lang, services]);

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

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'J&R NW Construction Services',
        description: 'Full-service contractor in Portland OR - remodeling, siding, restoration, painting, drywall and emergency services.',
        url: 'https://jandrnw.com/services',
        itemListElement: displayServices.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Service',
                name: service.title,
                description: service.description || '',
                provider: {
                    '@type': 'LocalBusiness',
                    name: 'J&R NW Construction LLC',
                    telephone: '+15039982340',
                    url: 'https://jandrnw.com',
                },
                areaServed: 'Portland Metro, OR',
                url: `https://jandrnw.com/services/${service.id}`,
            },
        })),
    };

    const getServiceSlug = (service) => (
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

    const getServiceTag = (index) => (
        t[SERVICE_TAG_KEYS[index]]
        || SERVICE_TAGS[index]
        || t.constructionOregon
        || 'Construction - Oregon'
    );

    return (
        <Layout
            title="Construction Services Portland OR | Remodeling, Siding & Restoration | J&R NW Construction"
            description="Portland OR construction services - remodeling, siding, water damage restoration, painting and drywall. Free estimates. Licensed contractor CCB #232708. Call (503) 998-2340."
            canonical="/services"
            onContactClick={() => setShowContactModal(true)}
        >
            <Head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
            </Head>

            <div className={pageStyles.servicesPage}>
                <div className={pageStyles.servicesContent}>
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

                    <div className={pageStyles.serviceList}>
                        {displayServices.map((service, index) => {
                            const serviceUrl = `/services/${getServiceSlug(service)}`;
                            const tag = getServiceTag(index);
                            const serviceTitle = sanitizeServiceText(service.title) || service.title;
                            const serviceDescription = sanitizeServiceText(service.description) || '';

                            return (
                                <MobileContainerScrollCard
                                    className={pageStyles.serviceItem}
                                    key={service.id}
                                    data-anim="service-item"
                                >
                                    <div className={pageStyles.serviceImgWrap}>
                                        <Image
                                            src={imageUrl(service.image_url)}
                                            alt={serviceTitle}
                                            fill
                                            sizes="(max-width: 900px) 100vw, 50vw"
                                            className={pageStyles.serviceImg}
                                            priority={index === 0}
                                        />
                                    </div>

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
                                </MobileContainerScrollCard>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showContactModal && (
                <Modal title={t.getInTouch} onClose={() => setShowContactModal(false)}>
                    <ContactFormSection />
                </Modal>
            )}
        </Layout>
    );
}

let _servicesCache = null;
let _servicesCacheTime = 0;
const CACHE_TTL = 55_000;

export async function getStaticProps() {
    const now = Date.now();
    if (_servicesCache && (now - _servicesCacheTime) < CACHE_TTL) {
        return { props: { services: _servicesCache }, revalidate: 60 };
    }

    const db = await getDb();
    const result = await db.execute('SELECT id, title, description, image, slug FROM services');
    const rows = result.rows || [];
    const services = rows.map((service) => ({
        id: service.id,
        title: service.title || '',
        description: service.description || '',
        image_url: service.image || '/assets/placeholder.jpg',
        slug: service.slug || '',
    }));

    _servicesCache = services;
    _servicesCacheTime = Date.now();

    return { props: { services }, revalidate: 60 };
}
