import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ContactFormSection from '../components/ContactFormSection';
import styles from '../styles/Home.module.css';
import pageStyles from '../styles/Projects.module.css';
import { getDb } from '../lib/db';
import { useLang } from '../context/LanguageContext';
import { imageUrl } from '../utils/imageUrl';
import { translateArray } from '../utils/translate';

export default function Projects({ projects }) {
    const { t } = useLang();
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectImages, setProjectImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);

    useEffect(() => {
        if (selectedProject) {
            // Fetch images for the selected project
            fetch(`/api/projects/${selectedProject.id}/images`)
                .then(res => res.json())
                .then(data => {
                    setProjectImages(data);
                    setCurrentImageIndex(0);
                })
                .catch(err => console.error('Failed to fetch project images:', err));
        }
    }, [selectedProject]);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleCloseModal = () => {
        setSelectedProject(null);
        setProjectImages([]);
        setCurrentImageIndex(0);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
    };

    return (
        <Layout title="Our Projects | J&R NW Construction" onContactClick={() => setShowContactModal(true)}>
            <div className={pageStyles.projectsPage}>
                <div className={`container ${pageStyles.projectsContent}`} style={{ padding: '40px 20px' }}>
                    <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', lineHeight: '1.2', padding: '0 15px' }}>{t.ourProjects}</h1>
                    <div className={styles.modalIntro}>
                        <p>{t.projectsIntro}</p>
                    </div>
                    <div className={styles.projectsGrid}>
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className={styles.projectCard}
                                onClick={() => handleProjectClick(project)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={imageUrl(project.image)} alt={project.title} />
                                <div className={styles.cardContent}>
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedProject && (
                <Modal onClose={handleCloseModal} title={selectedProject.title}>
                    <div className={styles.projectDetailContainer}>
                        <div className={styles.projectGallery}>
                            {projectImages.length > 0 && (
                                <div className={styles.galleryMain}>
                                    <img
                                        src={imageUrl(projectImages[currentImageIndex]?.image_path)}
                                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                                        className={styles.galleryImage}
                                    />
                                    {projectImages.length > 1 && (
                                        <div className={styles.galleryControls}>
                                            <button onClick={handlePrevImage} className={styles.galleryBtn}>‹</button>
                                            <span className={styles.galleryCounter}>
                                                {currentImageIndex + 1} / {projectImages.length}
                                            </span>
                                            <button onClick={handleNextImage} className={styles.galleryBtn}>›</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {projectImages.length > 1 && (
                                <div className={styles.galleryThumbnails}>
                                    {projectImages.map((img, idx) => (
                                        <img
                                            key={img.id}
                                            src={imageUrl(img.image_path)}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className={`${styles.thumbnail} ${idx === currentImageIndex ? styles.thumbnailActive : ''}`}
                                            onClick={() => setCurrentImageIndex(idx)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={styles.projectDetails}>
                            <h3>{t.projectDetails}</h3>
                            <p>{selectedProject.details}</p>
                        </div>
                    </div>
                </Modal>
            )}

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

    // Detect local dev by host header
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

    // projects table columns: id, title, description, details, image, created_at
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
    }));

    // For each project, get the first image from project_images (column: image_path)
    for (let project of projects) {
        try {
            const imageResult = await db.execute({
                // project_images table columns: id, project_id, image_path, display_order, created_at
                sql: 'SELECT image_path FROM project_images WHERE project_id = ? ORDER BY display_order ASC LIMIT 1',
                args: [project.id]
            });
            if (imageResult.rows.length > 0 && imageResult.rows[0].image_path) {
                project.image = resolveImage(imageResult.rows[0].image_path);
            }
            // else keep project.image from the projects.image column
        } catch (err) {
            console.warn('Could not fetch project_images for project', project.id, err.message);
        }
    }

    return { props: { projects } };
}
