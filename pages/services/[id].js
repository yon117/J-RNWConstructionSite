import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import ContactFormSection from '../../components/ContactFormSection';
import styles from '../../styles/ServiceDetails.module.css';
import { getDb } from '../../lib/db';
import { useLang } from '../../context/LanguageContext';
import { translateText } from '../../utils/translate';

export default function ServiceDetails({ service, images, randomProjects }) {
    const router = useRouter();
    const { t, lang } = useLang();
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [svc, setSvc] = useState(service);
    useEffect(() => {
        if (!lang || lang === 'en') { setSvc(service); return; }
        import('../../utils/translate').then(({ translateText }) => {
            const fields = ['title','subtitle','header_desc','description','details','process_desc',
                'ksp_title_1','ksp_desc_1','ksp_title_2','ksp_desc_2','ksp_title_3','ksp_desc_3','ksp_title_4','ksp_desc_4',
                'faq_q_1','faq_a_1','faq_q_2','faq_a_2','faq_q_3','faq_a_3','faq_q_4','faq_a_4','faq_q_5','faq_a_5'];
            const updated = { ...service };
            Promise.all(fields.map(f => service[f] ? translateText(service[f], lang).then(v => { updated[f] = v; }) : Promise.resolve()))
                .then(() => setSvc(updated));
        });
    }, [lang, service]);
    const autoPlayRef = useRef(null);

    const nextProject = () => setCarouselIndex(i => (i + 1) % randomProjects.length);
    const prevProject = () => setCarouselIndex(i => (i - 1 + randomProjects.length) % randomProjects.length);

    /* Auto-advance carousel every 4 seconds */
    useEffect(() => {
        if (!randomProjects || randomProjects.length <= 1) return;
        autoPlayRef.current = setInterval(nextProject, 4000);
        return () => clearInterval(autoPlayRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [randomProjects?.length]);

    const handleCarouselNav = (direction) => {
        clearInterval(autoPlayRef.current);
        if (direction === 'next') nextProject();
        else prevProject();
        autoPlayRef.current = setInterval(nextProject, 4000);
    };

    if (router.isFallback) {
        return <Layout title="Loading..."><div>{t.loading}</div></Layout>;
    }

    if (!service) {
        return <Layout title="Service Not Found"><div>{t.serviceNotFound}</div></Layout>;
    }

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setSelectedImage(images[index]);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const nextIndex = (currentImageIndex + 1) % images.length;
        setCurrentImageIndex(nextIndex);
        setSelectedImage(images[nextIndex]);
    };

    const prevImage = () => {
        const nextIndex = (currentImageIndex - 1 + images.length) % images.length;
        setCurrentImageIndex(nextIndex);
        setSelectedImage(images[nextIndex]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    };

    /* Collect Key Selling Points that have at least a title */
    const kspList = [1, 2, 3, 4]
        .map(n => ({ title: svc[`ksp_title_${n}`], desc: svc[`ksp_desc_${n}`] }))
        .filter(k => k.title);

    /* Collect FAQs that have at least a question */
    const faqList = [1, 2, 3, 4, 5]
        .map(n => ({ q: svc[`faq_q_${n}`], a: svc[`faq_a_${n}`] }))
        .filter(f => f.q);

    /* Page title: use page_title if set, otherwise fall back to service title */
    const pageTitle = service.page_title || `${svc.title} | J&R NW Construction`;

    return (
        <Layout title={pageTitle} onContactClick={() => setShowContactModal(true)}>
            <div className={styles.serviceDetailsPage}>

                {/* ── Hero Section ──────────────────────────────────────── */}
                <div className={styles.hero} style={{ backgroundImage: `url(${service.image_url || '/assets/placeholder.jpg'})` }}>
                    <div className={styles.heroOverlay}></div>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        {t.backToServices}
                    </button>
                    <div className={styles.heroContent}>
                        {/* Pill / badge label */}
                        <div className={styles.heroLabel}>{svc.title}</div>
                        {/* Sub-name / headline */}
                        <h1>{svc.subtitle || svc.title}</h1>
                        {svc.header_desc && (
                            <p className={styles.shortDescription}>{svc.header_desc}</p>
                        )}
                    </div>
                </div>

                {/* ── Main Content ──────────────────────────────────────── */}
                <div className={`container ${styles.contentWrapper}`}>

                    {/* ── Key Selling Points ─────────────────────────────── */}
                    {kspList.length > 0 && (
                        <div className={styles.kspSection}>
                            <div className={styles.kspGrid}>
                                {kspList.map((k, i) => (
                                    <div key={i} className={styles.kspCard}>
                                        <div className={styles.kspIcon}>◈</div>
                                        <strong className={styles.kspTitle}>{k.title}</strong>
                                        <p className={styles.kspDesc}>{k.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Copy Blocks (description → process_desc → details/Why Choose Us) ── */}
                    {(svc.description || svc.process_desc || svc.details) && (
                        <div className={styles.copyBlocksSection}>

                            {svc.description && (
                                <div className={styles.copyBlock}>
                                    <div className={styles.copyBlockContent}>
                                        <p>{svc.description}</p>
                                    </div>
                                </div>
                            )}

                            {svc.process_desc && (
                                <div className={styles.copyBlock}>
                                    <div className={styles.copyBlockContent}>
                                        {svc.process_desc.split('\n').map((para, idx) =>
                                            para.trim() && <p key={idx}>{para}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {svc.details && (
                                <div className={styles.copyBlock}>
                                    <p className={styles.copyBlockLabel}>Why Choose Us</p>
                                    <div className={styles.copyBlockContent}>
                                        {svc.details.split('\n').map((para, idx) =>
                                            para.trim() && <p key={idx}>{para}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Our Process Section ── */}
                    {/* ── Our Process (fixed steps — same on every service page) ── */}
                    {(() => {
                        const PROCESS_STEPS = [
                            {
                                title: 'Free consultation',
                                desc:  'We assess the space and listen to your goals — no sales pitch, just real conversation about what you want and what it takes to get there.',
                            },
                            {
                                title: 'Detailed estimate',
                                desc:  'Transparent pricing with a full line-item breakdown. No vague totals, no hidden costs. You know exactly what you\'re paying for before anything starts.',
                            },
                            {
                                title: 'Build phase',
                                desc:  'Skilled crew on site daily, clean workspace maintained, and open communication throughout. You always know where the project stands.',
                            },
                            {
                                title: 'Final walkthrough',
                                desc:  'We walk every inch of the finished space with you. We don\'t close out the job until you\'re fully satisfied with the result.',
                            },
                        ];
                        return (
                            <div className={styles.processSection}>
                                <p className={styles.processSectionLabel}>Our Process</p>
                                <div className={styles.processList}>
                                    {PROCESS_STEPS.map((step, i) => (
                                        <div key={i} className={styles.processItem}>
                                            <div className={styles.processNumber}>{i + 1}</div>
                                            <div className={styles.processContent}>
                                                <strong className={styles.processTitle}>{step.title}</strong>
                                                <p className={styles.processDesc}>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    {/* ── FAQ Section ────────────────────────────────────── */}
                    {faqList.length > 0 && (
                        <div className={styles.faqSection}>
                            <div className={styles.faqList}>
                                {faqList.map((item, i) => (
                                    <div key={i} className={styles.faqItem}>
                                        <p className={styles.faqQuestion}>Q: {item.q}</p>
                                        {item.a && <p className={styles.faqAnswer}>{item.a}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* ── Random Projects Carousel ──────────────────────── */}
                    {randomProjects && randomProjects.length > 0 && (
                        <div className={styles.projectsShowcase}>
                            <h2 className={styles.showcaseTitle}>{t.ourWork || 'Our Work'}</h2>
                            <p className={styles.showcaseSubtitle}>
                                {t.projectsSubtitle || 'Explore some of our completed projects'}
                            </p>

                            {/* Carousel */}
                            <div className={styles.carousel}>
                                <button
                                    className={styles.carouselBtn + ' ' + styles.carouselBtnPrev}
                                    onClick={() => handleCarouselNav('prev')}
                                    aria-label="Previous project"
                                >
                                    ‹
                                </button>

                                <div className={styles.carouselTrack}>
                                    {randomProjects.map((project, index) => (
                                        <Link
                                            key={project.id}
                                            href="/projects"
                                            className={
                                                styles.carouselSlide +
                                                (index === carouselIndex ? ' ' + styles.carouselSlideActive : '')
                                            }
                                            aria-hidden={index !== carouselIndex}
                                        >
                                            <div className={styles.carouselImage}>
                                                {project.image ? (
                                                    <img src={project.image} alt={project.title || 'Project'} />
                                                ) : (
                                                    <div className={styles.projectCardPlaceholder}><span>🏗️</span></div>
                                                )}
                                                <div className={styles.carouselOverlay}>
                                                    <span className={styles.projectCardViewBtn}>
                                                        {t.viewProject || 'View Projects →'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.projectCardInfo}>
                                                <h3 className={styles.projectCardTitle}>{project.title}</h3>
                                                {project.description && (
                                                    <p className={styles.projectCardDesc}>
                                                        {project.description.length > 120
                                                            ? project.description.slice(0, 120) + '…'
                                                            : project.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <button
                                    className={styles.carouselBtn + ' ' + styles.carouselBtnNext}
                                    onClick={() => handleCarouselNav('next')}
                                    aria-label="Next project"
                                >
                                    ›
                                </button>
                            </div>

                            {/* Dot indicators */}
                            <div className={styles.carouselDots}>
                                {randomProjects.map((_, i) => (
                                    <button
                                        key={i}
                                        className={styles.carouselDot + (i === carouselIndex ? ' ' + styles.carouselDotActive : '')}
                                        onClick={() => { clearInterval(autoPlayRef.current); setCarouselIndex(i); autoPlayRef.current = setInterval(nextProject, 4000); }}
                                        aria-label={`Go to project ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <div className={styles.projectsCta}>
                                <Link href="/projects" className={styles.viewAllBtn}>
                                    {t.viewAllProjects || 'View All Projects'} →
                                </Link>
                            </div>
                        </div>
                    )}

                </div>{/* end contentWrapper */}

                {/* ── Lightbox Modal ──────────────────────────────────── */}
                {selectedImage && (
                    <div
                        className={styles.lightbox}
                        onClick={closeLightbox}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        <button className={styles.closeButton} onClick={closeLightbox}>✕</button>
                        <button className={styles.prevButton} onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
                        <button className={styles.nextButton} onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
                        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                            <img
                                src={selectedImage.image_path || selectedImage.image_url || selectedImage.image}
                                alt={`${svc.title} - Full Size`}
                            />
                            <div className={styles.imageCounter}>
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Floating Contact Button ──────────────────────────── */}
                <button
                    className={styles.floatingContactBtn}
                    onClick={() => setShowContactModal(true)}
                    aria-label={t.getEstimate}
                >
                    <span className={styles.floatingBtnIcon}>💬</span>
                    <span className={styles.floatingBtnText}>{t.getEstimate}</span>
                </button>

                {/* ── Contact Form Modal ───────────────────────────────── */}
                {showContactModal && (
                    <Modal title={t.getInTouch} onClose={() => setShowContactModal(false)}>
                        <ContactFormSection />
                    </Modal>
                )}
            </div>
        </Layout>
    );
}

export async function getServerSideProps({ params, req }) {
    try {
        const db = await getDb();
        const slug = params.id;

        console.log('=== Service Details Request ===');
        console.log('Requested slug:', slug);

        // Fetch all services including new fields
        const servicesResult = await db.execute(`
            SELECT
                id, title, description, header_desc, image, details, name,
                slug, page_title, subtitle,
                ksp_title_1, ksp_desc_1,
                ksp_title_2, ksp_desc_2,
                ksp_title_3, ksp_desc_3,
                ksp_title_4, ksp_desc_4,
                process_desc,
                faq_q_1, faq_a_1,
                faq_q_2, faq_a_2,
                faq_q_3, faq_a_3,
                faq_q_4, faq_a_4,
                faq_q_5, faq_a_5
            FROM services
        `);

        console.log('Total services in database:', servicesResult.rows?.length || 0);

        if (!servicesResult.rows || servicesResult.rows.length === 0) {
            console.log('ERROR: No services found in database');
            return { notFound: true };
        }

        // Map database rows to service objects
        const services = servicesResult.rows.map(s => ({
            id:           s.id,
            title:        s.title        || '',
            description:  s.description  || '',
            header_desc:  s.header_desc  || '',
            image_url:    s.image        || '',
            details:      s.details      || '',
            slug:         s.slug         || '',
            page_title:   s.page_title   || '',
            subtitle:     s.subtitle     || '',
            ksp_title_1:  s.ksp_title_1  || '',
            ksp_desc_1:   s.ksp_desc_1   || '',
            ksp_title_2:  s.ksp_title_2  || '',
            ksp_desc_2:   s.ksp_desc_2   || '',
            ksp_title_3:  s.ksp_title_3  || '',
            ksp_desc_3:   s.ksp_desc_3   || '',
            ksp_title_4:  s.ksp_title_4  || '',
            ksp_desc_4:   s.ksp_desc_4   || '',
            process_desc: s.process_desc || '',
            faq_q_1:      s.faq_q_1      || '',
            faq_a_1:      s.faq_a_1      || '',
            faq_q_2:      s.faq_q_2      || '',
            faq_a_2:      s.faq_a_2      || '',
            faq_q_3:      s.faq_q_3      || '',
            faq_a_3:      s.faq_a_3      || '',
            faq_q_4:      s.faq_q_4      || '',
            faq_a_4:      s.faq_a_4      || '',
            faq_q_5:      s.faq_q_5      || '',
            faq_a_5:      s.faq_a_5      || '',
        }));

        console.log('Available services:');
        services.forEach(s => {
            const generatedSlug = s.title
                ? s.title.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                : 'no-title';
            console.log(`  - ID: ${s.id}, Title: "${s.title}", DB Slug: "${s.slug}", Generated: "${generatedSlug}"`);
        });

        // Find by: 1) explicit slug column, 2) generated slug from title, 3) ID
        const service = services.find(s => {
            // Match explicit slug saved in DB
            if (s.slug && s.slug === slug) return true;

            // Match generated slug from title (legacy behavior)
            if (s.title) {
                const generatedSlug = s.title
                    .toLowerCase()
                    .trim()
                    .replace(/&/g, 'and')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                if (generatedSlug === slug) return true;
            }

            // Match by ID
            if (s.id.toString() === slug) return true;

            return false;
        });

        if (!service) {
            console.log('ERROR: Service not found for slug:', slug);
            return { notFound: true };
        }

        console.log('Service found:', service.title);

        // Get service images
        const imagesResult = await db.execute({
            sql: 'SELECT * FROM service_images WHERE service_id = ? ORDER BY display_order',
            args: [service.id]
        });

        const images = (imagesResult.rows || []).map(img => ({
            ...img,
            image_url: img.image_path
        }));

        // Get random projects for the "Our Work" showcase
        const projectsResult = await db.execute(
            'SELECT id, title, description, image FROM projects ORDER BY RANDOM() LIMIT 4'
        );
        const randomProjects = (projectsResult.rows || []).map(p => ({
            id:          p.id,
            title:       p.title       || '',
            description: p.description || '',
            image:       p.image       || ''
        }));

        console.log('Images found:', images.length);
        console.log('Random projects found:', randomProjects.length);
        console.log('=== End Service Details Request ===');

        return {
            props: {
                service:        service,
                images:         images,
                randomProjects: randomProjects
            }
        };
    } catch (error) {
        console.error('Error fetching service details:', error);
        return { notFound: true };
    }
}
