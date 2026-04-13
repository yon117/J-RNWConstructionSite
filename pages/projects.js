import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ContactFormSection from '../components/ContactFormSection';
import { getDb } from '../lib/db';
import { useLang } from '../context/LanguageContext';
import { imageUrl } from '../utils/imageUrl';
import { translateArray } from '../utils/translate';
import pageStyles from '../styles/Projects.module.css';

// Filter categories — adjust to match your actual project types
const FILTERS = [
    { id: 'all', labelKey: 'filterAll', terms: [] },
    { id: 'remodeling', labelKey: 'filterRemodeling', terms: ['remodeling', 'remodelación', 'remodelaciones'] },
    { id: 'siding', labelKey: 'filterSiding', terms: ['siding', 'revestimiento'] },
    { id: 'restoration', labelKey: 'filterRestoration', terms: ['restoration', 'restauración'] },
    { id: 'drywall', labelKey: 'filterDrywall', terms: ['drywall', 'tablaroca'] },
    { id: 'emergency', labelKey: 'filterEmergency', terms: ['emergency', 'emergencia'] },
];

// Assign grid layout classes in a repeating pattern
// wide = spans 2 cols, tall = spans 2 rows, default = 1x1
const CARD_PATTERNS = ['wide', '', 'tall', '', '', 'wide', '', ''];

export default function Projects({ projects }) {
    const { t } = useLang();
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectImages, setProjectImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    // Fetch images when a project is selected
    useEffect(() => {
        if (selectedProject) {
            fetch(`/api/projects/${selectedProject.id}/images`)
                .then(res => res.json())
                .then(data => {
                    setProjectImages(data);
                    setCurrentImageIndex(0);
                })
                .catch(err => console.error('Failed to fetch project images:', err));
        }
    }, [selectedProject]);

    const handleProjectClick = (project) => setSelectedProject(project);

    const handleCloseModal = () => {
        setSelectedProject(null);
        setProjectImages([]);
        setCurrentImageIndex(0);
    };

    const handleNextImage = () =>
        setCurrentImageIndex(prev => (prev + 1) % projectImages.length);

    const handlePrevImage = () =>
        setCurrentImageIndex(prev => (prev - 1 + projectImages.length) % projectImages.length);

    // Filter projects — simple term match in title, description, or category
    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(p => {
            const active = FILTERS.find(f => f.id === activeFilter);
            const terms = active?.terms || [activeFilter];
            const haystack = `${p.title || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
            return terms.some(term => term && haystack.includes(term));
        });

    return (
        <Layout
            title={`${t.ourProjects} | J&R NW Construction`}
            onContactClick={() => setShowContactModal(true)}
        >
            <div className={pageStyles.projectsPage}>
                <div className={pageStyles.projectsContent}>

                    {/* ── PAGE HERO ── */}
                    <div className={pageStyles.pageHero}>
                        <div className={pageStyles.pageHeroInner}>
                            <div>
                                <div className={pageStyles.sectionLabel}>{t.portfolioLabel}</div>
                                <h1 className={pageStyles.pageTitle}>
                                    {t.ourProjects.split(' ')[0]}{' '}
                                    <em>{t.ourProjects.split(' ').slice(1).join(' ')}</em>
                                </h1>
                                <p style={{ fontSize: '15px', color: 'var(--text)', maxWidth: '480px', lineHeight: '1.7', marginTop: '10px' }}>
                                    {t.projectsIntro}
                                </p>
                            </div>
                            <div className={pageStyles.heroStat}>
                                <div className={pageStyles.heroStatNum}>{projects.length}+</div>
                                <div className={pageStyles.heroStatLabel}>{t.completedProjects || 'Completed Projects'}</div>
                            </div>
                        </div>
                    </div>

                    {/* ── FILTERS ── */}
                    <div className={pageStyles.filterBar}>
                        {FILTERS.map(filter => (
                            <button
                                key={filter.id}
                                className={`${pageStyles.filterBtn} ${activeFilter === filter.id ? pageStyles.filterBtnActive : ''}`}
                                onClick={() => setActiveFilter(filter.id)}
                            >
                                {t[filter.labelKey] || filter.labelKey}
                            </button>
                        ))}
                    </div>

                    {/* ── PROJECTS GRID ── */}
                    <div className={pageStyles.projectsGrid}>
                        {filteredProjects.map((project, index) => {
                            const pattern = CARD_PATTERNS[index % CARD_PATTERNS.length];
                            return (
                                <div
                                    key={project.id}
                                    className={`${pageStyles.projectCard} ${pattern ? pageStyles[pattern] : ''}`}
                                    onClick={() => handleProjectClick(project)}
                                >
                                    <img
                                        src={imageUrl(project.image)}
                                        alt={project.title}
                                        className={pageStyles.projectPhoto}
                                    />
                                    <div className={pageStyles.projectOverlay}>
                                        <div className={pageStyles.projectCategory}>
                                            {project.category || t.constructionOregon || 'Construction · Oregon'}
                                        </div>
                                        <div className={pageStyles.projectTitle}>{project.title}</div>
                                    </div>
                                    {project.imageCount > 1 && (
                                        <div className={pageStyles.photoBadge}>
                                            {project.imageCount} {t.photos || 'Photos'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* ── PROJECT MODAL — keep all existing logic untouched ── */}
         {selectedProject && (
    <Modal onClose={handleCloseModal} title="">
        <div>
            {/* Header */}
            <div className={pageStyles.modalHeader}>
                <div className={pageStyles.modalCat}>
                    {selectedProject.category || 'Construction · Oregon'}
                </div>
                <div className={pageStyles.modalTitle}>{selectedProject.title}</div>
            </div>

            {/* Main image */}
            {projectImages.length > 0 && (
                <div className={pageStyles.galleryMain}>
                    <img
                        src={imageUrl(projectImages[currentImageIndex]?.image_path)}
                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                        className={pageStyles.galleryImage}
                    />
                    {projectImages.length > 1 && (
                        <div className={pageStyles.galleryControls}>
                            <button onClick={handlePrevImage} className={pageStyles.galleryBtn}>‹</button>
                            <span className={pageStyles.galleryCounter}>
                                {currentImageIndex + 1} / {projectImages.length}
                            </span>
                            <button onClick={handleNextImage} className={pageStyles.galleryBtn}>›</button>
                        </div>
                    )}
                </div>
            )}

            {/* Thumbnails */}
            {projectImages.length > 1 && (
                <div className={pageStyles.galleryThumbnails}>
                    {projectImages.map((img, idx) => (
                        <img
                            key={img.id}
                            src={imageUrl(img.image_path)}
                            alt={`Thumbnail ${idx + 1}`}
                            className={`${pageStyles.thumbnail} ${idx === currentImageIndex ? pageStyles.thumbnailActive : ''}`}
                            onClick={() => setCurrentImageIndex(idx)}
                        />
                    ))}
                </div>
            )}

           {/* Details grid */}
<div style={{ padding: '0 0 4px' }}>
    <div className={pageStyles.modalDetailsGrid}>
        <div className={pageStyles.modalDetailItem}>
            <div className={pageStyles.modalDetailLabel}>Location</div>
            <div className={pageStyles.modalDetailValue}>{selectedProject.location || 'Oregon'}</div>
        </div>
        <div className={pageStyles.modalDetailItem}>
            <div className={pageStyles.modalDetailLabel}>Service Type</div>
            <div className={pageStyles.modalDetailValue}>{selectedProject.serviceType || t.pt2}</div>
        </div>
    </div>

                {/* Project details */}
                <div className={pageStyles.projectDetails}>
                    <h3>{t.projectDetails}</h3>
                    <p>{selectedProject.details}</p>
                </div>

                {/* Footer row */}
                <div className={pageStyles.modalFooterRow}>
                    <span className={pageStyles.modalCounter}>
                        {currentImageIndex + 1} / {projectImages.length} photos
                    </span>
                    <button
                        className={pageStyles.modalEstimateBtn}
                        onClick={() => { handleCloseModal(); setShowContactModal(true); }}
                    >
                        {t.getEstimate} →
                    </button>
                </div>
            </div>
        </div>
    </Modal>
)}

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

    const host = req.headers.host || '';
    const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');

    function resolveImage(imgPath) {
        if (!imgPath) return '';
        if (imgPath.startsWith('http')) return imgPath;
        if (isLocal && imgPath.startsWith('/uploads/')) {
            return `/api/image-proxy?path=${encodeURIComponent(imgPath)}`;
        }
        return imgPath;
    }

    const projectsResult = await db.execute(
        'SELECT id, title, description, details, image FROM projects ORDER BY created_at DESC'
    );

    const lang = req.cookies?.lang || 'en';
    const rows = projectsResult.rows || [];
    const titles = await translateArray(rows.map(p => p.title || ''), lang);
    const descs = await translateArray(rows.map(p => p.description || ''), lang);

    const projects = rows.map((p, i) => ({
        id:          p.id,
        title:       titles[i],
        description: descs[i],
        details:     p.details || '',
        image:       resolveImage(p.image),
        imageCount:  1, // updated below
    }));

    // Get first image and image count per project
    for (let project of projects) {
        try {
            const imageResult = await db.execute({
                sql: 'SELECT image_path FROM project_images WHERE project_id = ? ORDER BY display_order ASC LIMIT 1',
                args: [project.id]
            });
            if (imageResult.rows.length > 0 && imageResult.rows[0].image_path) {
                project.image = resolveImage(imageResult.rows[0].image_path);
            }

            // Get total image count for badge
            const countResult = await db.execute({
                sql: 'SELECT COUNT(*) as count FROM project_images WHERE project_id = ?',
                args: [project.id]
            });
            project.imageCount = countResult.rows[0]?.count || 1;
        } catch (err) {
            console.warn('Could not fetch project_images for project', project.id, err.message);
        }
    }

    return { props: { projects } };
}
