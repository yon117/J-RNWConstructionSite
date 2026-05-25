/*
 * PROTOTYPE — Conversion-focused homepage
 * ═══════════════════════════════════════════
 * 3 VISIBLE CHANGES applied here:
 *   1. Warning Signs section → compact widget + modal (3 signs)
 *   2. FAQ trimmed to 3 items + "See all" link
 *   3. Service cards restructured with "Get Free Estimate" CTA
 *
 * 2 DEFERRED CHANGES (need shared component edits):
 *   4. Hero trust signal de-duplication (HeroSection.js)
 *   5. Season bar copy improvements (Layout.js)
 *
 * View at: localhost:3000/prototype
 * Compare with: localhost:3000 (original)
 */

import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Reviews from '../components/Reviews';
import HeroSection from '../components/HeroSection';
import LeftNav from '../components/LeftNav';
import styles from '../styles/Home.module.css';
import proto from '../styles/Prototype.module.css';
import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { getDb } from '../lib/db';
import { imageUrl } from '../utils/imageUrl';

// ─── SVG ICONS ──────────────────────────────────────────
const ShieldIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const StarIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
const CheckIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const ArrowIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);
const PhoneIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a1 1 0 000-1z" />
    </svg>
);
const YelpLogoIcon = () => (
    <Image src="/yelp-logo.png" alt="Yelp" width={100} height={31} style={{ objectFit: 'contain' }} />
);
const GoogleLogoIcon = () => (
    <Image src="/google-logo.png" alt="Google" width={62} height={62} style={{ objectFit: 'contain' }} />
);
const LockIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

// Process step icons
const HowWeWorkPhoneIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} width={26} height={26}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a1 1 0 000-1z" />
    </svg>
);
const HowWeWorkClipboardIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} width={26} height={26}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);
const HowWeWorkHammerIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} width={26} height={26}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);
const HowWeWorkCheckIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} width={26} height={26}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Handle items icons
const PackageIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);
const TrashIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const SweepIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

// ─── CONSTANTS ──────────────────────────────────────────
const PROCESS_STEPS = [
    { Icon: HowWeWorkPhoneIcon,    num: '01', title: 'Free Consultation',  desc: 'Tell us about your project. We listen before we plan.' },
    { Icon: HowWeWorkClipboardIcon, num: '02', title: 'Custom Plan & Quote', desc: 'Transparent pricing with no hidden surprises.'          },
    { Icon: HowWeWorkHammerIcon,   num: '03', title: 'Quality Construction', desc: 'We build with care, on schedule and on budget.'        },
    { Icon: HowWeWorkCheckIcon,    num: '04', title: 'Final Walkthrough',   desc: 'Your satisfaction is the only sign-off that counts.'   },
];

const HOME_SERVICES = [
    { key: 'pt3', category: 'EMERGENCY',   desc: 'Burst pipes, fire, windstorm damage. We dispatch within the hour and stabilize the same day.' },
    { key: 'pt2', category: 'RESTORATION', desc: 'We work with your insurance adjuster. Source repair, structural drying, antimicrobial treatment, finish-grade rebuild.' },
    { key: 'pt1', category: 'REMODEL',     desc: 'Kitchens, bathrooms, additions. Permits pulled, subs coordinated, finish carpentry in-house.' },
    { key: 'pt6', category: 'SIDING',      desc: 'Full replacement, repairs, and paint. Hardie board, LP SmartSide, vinyl — all weather-sealed.' },
    { key: 'pt5', category: 'PAINTING',    desc: 'Interior and exterior. Surface prep, primer coat, finish — clean lines and lasting color.' },
    { key: 'pt7', category: 'DRYWALL',     desc: 'Hanging, taping, mudding, and finishing. Seamless texture matching and full room repairs.' },
];

const HOME_SERVICE_SLUGS = {
    pt1: 'interior-construction-and-remodeling',
    pt2: 'restoration-and-reconstruction',
    pt3: 'mitigation-and-emergency-services',
    pt5: 'paint',
    pt6: 'siding',
    pt7: 'drywall',
};

const PROJECT_TYPES = [
    { key: 'pt1',   en: 'Interior Construction & Remodeling' },
    { key: 'ptBath', en: 'Bathroom Remodel' },
    { key: 'pt2',   en: 'Restoration & Reconstruction' },
    { key: 'pt3',   en: 'Mitigation & Emergency Services' },
    { key: 'pt4',   en: 'General Repairs & Carpentry' },
    { key: 'pt5',   en: 'Paint' },
    { key: 'pt6',   en: 'Siding' },
    { key: 'pt7',   en: 'Drywall' },
    { key: 'pt8',   en: 'Other (describe in message below)' },
];

const HANDLE_ITEMS = [
    { Icon: PackageIcon, title: 'Materials Sourced & Delivered', desc: 'We source all materials at contractor pricing and deliver to site. No hardware store runs for you.' },
    { Icon: TrashIcon, title: 'Debris Removal & Hauling', desc: 'All demo waste and packaging gets hauled away. You never rent a dumpster or lift a bag.' },
    { Icon: SweepIcon, title: 'Full Site Cleanup', desc: 'Every room swept, surfaces wiped, tools removed. We leave your space cleaner than we found it.' },
    { Icon: ShieldIcon, title: 'Left Like New — Guaranteed', desc: "When we're done, your home looks finished — not like a job site. 100% satisfaction or we come back." },
];

const HOME_NAV_SECTIONS = [
    { id: 'section-services', label: 'Services', num: '01' },
    { id: 'section-process', label: 'How We Work', num: '02' },
    { id: 'section-reviews', label: 'What Our Clients Say', num: '03' },
    { id: 'section-portfolio', label: 'Projects', num: '04' },
    { id: 'section-contact', label: 'Contact', num: '05' },
];

const HOME_TRUST_ITEMS = [
    { Icon: ShieldIcon, value: '20+', label: 'Years in Portland', meta: 'Family-run general contractor' },
    { Icon: StarIcon, value: '5.0', label: 'Google Rating', meta: 'Trusted by local homeowners' },
    { Icon: CheckIcon, value: 'CCB', label: '#232708', meta: 'Licensed, bonded, insured' },
    { Icon: PhoneIcon, value: '24/7', label: 'Emergency Response', meta: 'Fast help when damage hits' },
];

// ─── CHANGE 1: Warning signs data for modal ─────────────
const MODAL_WARNINGS = [
    {
        sev: 'crit',
        sevLabel: 'Critical',
        title: 'Water Stains on Ceiling or Walls',
        desc: 'Yellow or brown stains mean active water intrusion. Mold can form within 48 hours.',
    },
    {
        sev: 'crit',
        sevLabel: 'Critical',
        title: 'Soft or Spongy Floor Spots',
        desc: 'Floors that flex or feel spongy signal moisture damage beneath the subfloor.',
    },
    {
        sev: 'high',
        sevLabel: 'High',
        title: 'Mold or Discoloration in Bathroom',
        desc: 'Black or green growth on grout signals ventilation failure and water behind your tile.',
    },
];

// ─── MAIN COMPONENT ─────────────────────────────────────
export default function Prototype({ projects = [] }) {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [openFaqs, setOpenFaqs] = useState(new Set());
    const [mobileOpenSection, setMobileOpenSection] = useState('');
    const [pendingMobileScrollId, setPendingMobileScrollId] = useState('');
    const { t } = useLang();

    const handleEstimateClick = () => {
        setShowContactModal(true);
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'contact_click', { event_category: 'contact', event_label: 'hero_cta' });
        }
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Contact');
        }
    };

    const handleMobileSectionToggle = (key, targetId) => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth > 768) {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        const next = mobileOpenSection === key ? '' : key;
        setMobileOpenSection(next);
        if (next) setPendingMobileScrollId(targetId);
    };

    useEffect(() => {
        if (!pendingMobileScrollId || typeof window === 'undefined') return undefined;
        const timer = window.setTimeout(() => {
            document.getElementById(pendingMobileScrollId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.dispatchEvent(new Event('resize'));
            setPendingMobileScrollId('');
        }, 120);
        return () => window.clearTimeout(timer);
    }, [pendingMobileScrollId]);

    return (
        <Layout
            title="PROTOTYPE — Portland General Contractor | J&R NW Construction"
            description="Prototype page for conversion-focused changes."
            canonical="/prototype"
            onContactClick={() => setShowContactModal(true)}
        >
            {/* Prototype indicator */}
            <div className={proto.protoBanner}>
                Prototype — Conversion Changes Preview
            </div>

            {/* ── HERO (unchanged — de-duplication noted for HeroSection.js) ── */}
            <HeroSection
                t={t}
                onEstimateClick={handleEstimateClick}
                icons={{ ShieldIcon, StarIcon, CheckIcon, ArrowIcon, PhoneIcon, YelpLogoIcon, GoogleLogoIcon }}
            >
                <HomeContactForm t={t} />
            </HeroSection>

            <section className={styles.trustBand} aria-label="J&R NW Construction trust signals">
                <div className={styles.trustBandInner} data-anim="stagger-group">
                    {HOME_TRUST_ITEMS.map((item) => (
                        <div key={item.label} className={styles.trustBandCard} data-anim-child>
                            <div className={styles.trustBandIcon}><item.Icon /></div>
                            <div className={styles.trustBandCopy}>
                                <span className={styles.trustBandValue}>{item.value}</span>
                                <span className={styles.trustBandLabel}>{item.label}</span>
                                <span className={styles.trustBandMeta}>{item.meta}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <LeftNav sections={HOME_NAV_SECTIONS} />

            {/* ══════════════════════════════════════════════════════
                MOBILE TAB: Services
                CHANGE 3: Service cards restructured with estimate CTA
               ══════════════════════════════════════════════════════ */}
            <div id="mobile-services" className={`${styles.mobileSectionBlock} ${mobileOpenSection === 'services' ? styles.mobileSectionBlockOpen : ''}`}>
            <button type="button" className={styles.mobileSectionToggle}
                onClick={() => handleMobileSectionToggle('services', 'mobile-services')}>
                <span>Services</span>
                <span className={styles.mobileSectionToggleIcon}>{mobileOpenSection === 'services' ? '-' : '+'}</span>
            </button>
            <div className={styles.mobileSectionPanel}>
            <div className={styles.horizRow} data-layout="horiz-row">

              {/* ── BENTO: HOW WE WORK + HANDLE EVERYTHING (unchanged) ── */}
              <section id="section-process" className={`${styles.bentoSection} ${styles.mobileProcessOrder}`}>
                  <div className={styles.bentoGrid}>
                      <div className={styles.bentoPrimary} data-anim="fade-up">
                          <div className={styles.sectionLabel}>How We Work</div>
                          <h2 className={styles.sectionTitle}>From First Call to <em>Final Nail</em></h2>
                          <div className={styles.hwwStepsCompact} data-anim="stagger-group">
                              {PROCESS_STEPS.map((step) => (
                                  <div key={step.num} className={styles.hwwStepCompact} data-anim-child>
                                      <div className={styles.hwwNumSmall}>{step.num}</div>
                                      <div>
                                          <div className={styles.hwwIcon}><step.Icon /></div>
                                          <h3 className={styles.hwwStepTitle}>{step.title}</h3>
                                          <p className={styles.hwwStepDesc}>{step.desc}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className={styles.bentoStack}>
                          <div className={styles.bentoTopCard} data-anim="fade-up">
                              <div className={styles.sectionLabel}>One Call. Zero Stress.</div>
                              <h2 className={styles.sectionTitle}>We Handle <em>Everything</em></h2>
                              <p className={styles.handleSubtitle}>Materials, disposal, cleanup — we own the whole job. You come home to a space that looks like new.</p>
                          </div>
                          <div className={styles.bentoHandleGrid} data-anim="stagger-group">
                              {HANDLE_ITEMS.map((item, i) => (
                                  <div key={i} className={styles.bentoCard} data-anim-child>
                                      <div className={styles.handleCardTop}>
                                          <div className={styles.handleIcon}><item.Icon /></div>
                                          <span className={styles.handleStepNum}>0{i + 1}</span>
                                      </div>
                                      <h3 className={styles.handleCardTitle}>{item.title}</h3>
                                      <p className={styles.handleCardDesc}>{item.desc}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </section>

              {/* ── SERVICES PREVIEW — CHANGE 3: Cards restructured ── */}
              <section id="section-services" className={`${styles.servicesSection} ${styles.mobileServicesOrder}`} data-anim="section-reveal">
                  <div className={styles.servicesInner}>
                      <div className={styles.servicesLeft} data-anim="fade-up">
                          <div className={styles.sectionLabel}>{t.ourServicesLabel || 'What We Do'}</div>
                          <h2 className={styles.sectionTitle}>
                              {t.ourServices.split(' ')[0]} <em>{t.ourServices.split(' ').slice(1).join(' ')}</em>
                          </h2>
                          <p className={styles.servicesLeftDesc}>
                              From emergency response to full remodels — we handle every project under one roof.
                          </p>
                          <Link href="/services" className={styles.btnSecondary} style={{ marginTop: 28 }}>
                              {t.ourServices} <ArrowIcon />
                          </Link>
                      </div>
                      <div className={styles.servicesRight}>
                          <div className={styles.servicesGrid} data-anim="stagger-group">
                              {HOME_SERVICES.map((svc, idx) => (
                                  /* ── CHANGE 3: Card is div, not Link. Estimate CTA added. ── */
                                  <div key={svc.key} className={`${styles.serviceCard} ${proto.serviceCardWrap}`} data-anim="service-card">
                                      <Link href={`/services/${HOME_SERVICE_SLUGS[svc.key]}`} className={proto.serviceCardLink}>
                                          <div className={styles.serviceCardGhostNum}>{String(idx + 1).padStart(2, '0')}</div>
                                          <div className={styles.serviceCardNum}>
                                              <span className={styles.serviceCardIndex}>{String(idx + 1).padStart(2, '0')}</span>
                                              <span className={styles.serviceCardTotal}>&nbsp;/ {String(HOME_SERVICES.length).padStart(2, '0')}</span>
                                              <span className={styles.serviceCardCat}>{svc.category}</span>
                                          </div>
                                          <div className={styles.serviceName}>{t[svc.key]}</div>
                                          <p className={styles.serviceDesc}>{svc.desc}</p>
                                          <span className={styles.serviceLink}>{t.learnMore} &rarr;</span>
                                      </Link>
                                      <button type="button" className={proto.serviceEstimateBtn} onClick={handleEstimateClick}>
                                          GET FREE ESTIMATE &rarr;
                                      </button>
                                  </div>
                              ))}
                          </div>
                          <div className={styles.emergencyStrip}>
                              <div className={styles.emergencyStripContent}>
                                  <div>
                                      <h3 className={styles.emergencyStripTitle}>Need Immediate Assistance?</h3>
                                      <p className={styles.emergencyStripDesc}>Our emergency response teams are on standby 24/7 to handle critical property damage and restoration needs.</p>
                                  </div>
                                  <a href="tel:5039982340" className={styles.emergencyStripBtn}>Call (503) 998-2340</a>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

            </div>
            </div>
            </div>

            {/* ── MOBILE TAB: Reviews (unchanged) ── */}
            <div id="mobile-reviews" className={`${styles.mobileSectionBlock} ${mobileOpenSection === 'reviews' ? styles.mobileSectionBlockOpen : ''}`}>
            <button type="button" className={styles.mobileSectionToggle}
                onClick={() => handleMobileSectionToggle('reviews', 'mobile-reviews')}>
                <span>Reviews</span>
                <span className={styles.mobileSectionToggleIcon}>{mobileOpenSection === 'reviews' ? '-' : '+'}</span>
            </button>
            <div className={styles.mobileSectionPanel}>
            <Reviews sectionId="section-reviews" />
            </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                CHANGE 1: Warning Widget (replaces full Warning Signs section)
                No mobile tab — always visible, compact strip
               ══════════════════════════════════════════════════════ */}
            <div className={proto.warningWidget}>
                <div className={proto.warningWidgetInner}>
                    <span className={proto.warningWidgetIcon} aria-hidden="true">⚠️</span>
                    <p className={proto.warningWidgetText}>
                        Not sure if your damage is urgent?
                    </p>
                    <button
                        type="button"
                        className={proto.warningWidgetBtn}
                        onClick={() => setShowWarningModal(true)}
                    >
                        See Warning Signs &rarr;
                    </button>
                </div>
            </div>

            {/* ── MOBILE TAB: Projects (unchanged) ── */}
            <div id="mobile-projects" className={`${styles.mobileSectionBlock} ${mobileOpenSection === 'projects' ? styles.mobileSectionBlockOpen : ''}`}>
            <button type="button" className={styles.mobileSectionToggle}
                onClick={() => handleMobileSectionToggle('projects', 'mobile-projects')}>
                <span>Projects</span>
                <span className={styles.mobileSectionToggleIcon}>{mobileOpenSection === 'projects' ? '-' : '+'}</span>
            </button>
            <div className={styles.mobileSectionPanel}>
            <div id="section-portfolio" className={styles.splitRow}>
            <section className={styles.projectsSection} data-anim="section-reveal">
                <div className={styles.projectsInner}>
                    <div className={styles.projectsHeader}>
                        <div>
                            <div className={styles.sectionLabel}>Recent Work</div>
                            <h2 className={styles.sectionTitle}>Our <em>Projects</em></h2>
                        </div>
                        <Link href="/projects" className={styles.btnSecondary}>
                            View All Work <ArrowIcon />
                        </Link>
                    </div>
                    <div className={styles.projectsGrid}>
                        {projects.slice(0, 5).map((project, idx) => (
                            <div key={project.id}
                                className={`${styles.projectCard} ${idx === 0 ? styles.featured : ''}`}
                                style={{ position: 'relative' }}>
                                <Image
                                    src={imageUrl(project.firstImage || project.image)}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover', filter: 'brightness(0.7)' }}
                                />
                                <div className={styles.projectOverlay}>
                                    <span className={styles.projectCategory}>{project.category || 'Remodel'}</span>
                                    <div className={styles.projectTitle}>{project.title}</div>
                                    {idx === 0 && (project.description || project.details) ? (
                                        <p className={styles.projectMeta}>{project.description || project.details}</p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.aboutSection} data-anim="section-reveal">
                <div className={styles.aboutInner}>
                    <div className={styles.aboutLogoWrap} data-anim="about-logo">
                        <Image src="/logo.png" alt="J&R NW Construction" width={220} height={220} style={{ borderRadius: '50%' }} />
                    </div>
                    <div className={styles.aboutContent} data-anim="fade-up">
                        <div className={styles.sectionLabel}>{t.weWorkForYou}</div>
                        <h2 className={styles.sectionTitle}>J&amp;R NW <em>Construction</em></h2>
                        <p>{t.companyDesc}</p>
                    </div>
                </div>
            </section>
            </div>
            </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                MOBILE TAB: Areas + FAQ
                CHANGE 2: FAQ trimmed to 3 items
               ══════════════════════════════════════════════════════ */}
            <div id="mobile-info" className={`${styles.mobileSectionBlock} ${mobileOpenSection === 'info' ? styles.mobileSectionBlockOpen : ''}`}>
            <button type="button" className={styles.mobileSectionToggle}
                onClick={() => handleMobileSectionToggle('info', 'mobile-info')}>
                <span>Areas + FAQ</span>
                <span className={styles.mobileSectionToggleIcon}>{mobileOpenSection === 'info' ? '-' : '+'}</span>
            </button>
            <div className={styles.mobileSectionPanel}>
            <div className={`${styles.splitRow} ${styles.splitRowAlt}`}>

            {/* ── SERVICE AREAS (unchanged) ── */}
            <section className={styles.areasSection} data-anim="section-reveal">
                <div className={styles.areasInner}>
                    <div className={styles.areasLeft}>
                        <div className={styles.sectionLabel}>Where We Work</div>
                        <h2 className={styles.sectionTitle}>Serving <em>Portland Metro</em></h2>
                        <p className={styles.areasDesc}>
                            Licensed contractor serving 9 cities across the Portland metro area. CCB #232708. Available 24/7 for emergencies.
                        </p>
                        <div className={styles.areasGrid}>
                            {['Portland', 'Tigard', 'Tualatin', 'Gresham', 'Happy Valley', 'Oregon City', 'Milwaukie', 'Hillsboro', 'Beaverton'].map(city => (
                                <div key={city} className={styles.areaChip}><CheckIcon /> {city}</div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.areasMap}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d178918.09!2d-122.6784!3d45.5051!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950b0b7da97427%3A0x1c36b9e6f6d18591!2sPortland%2C%20OR!5e0!3m2!1sen!2sus"
                            width="100%" height="400"
                            style={{ border: 0, borderRadius: 4, filter: 'invert(90%) hue-rotate(180deg)', display: 'block' }}
                            allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            title="J&R NW Construction service area map"
                        />
                    </div>
                </div>
            </section>

            {/* ── CHANGE 2: FAQ trimmed to 3 items ── */}
            <section className={styles.faqSection} data-anim="section-reveal">
                <div className={styles.faqInner}>
                    <div className={styles.sectionHeader} data-anim="fade-up">
                        <div className={styles.sectionLabel}>{t.faqLabel || 'Got Questions?'}</div>
                        <h2 className={styles.sectionTitle}>
                            {(t.faqTitle || 'Common Questions').split(' ')[0]}{' '}
                            <em>{(t.faqTitle || 'Common Questions').split(' ').slice(1).join(' ')}</em>
                        </h2>
                    </div>
                    <div className={styles.faqList}>
                        {[
                            { cat: 'Timeline', q: t.faqQ1, a: t.faqA1 },
                            { cat: 'Claims',   q: t.faqQ4, a: t.faqA4 },
                            { cat: 'Quality',  q: t.faqQ6, a: t.faqA6 },
                        ].map((item, i) => (
                            <div key={i} className={`${styles.faqAccordion} ${openFaqs.has(i) ? styles.faqOpen : ''}`} data-anim="faq-item">
                                <button className={styles.faqTrigger} onClick={() => setOpenFaqs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}>
                                    <div className={styles.faqTriggerLeft}>
                                        <span className={styles.faqChip}>{item.cat}</span>
                                        <h4 className={styles.faqQ}>{item.q}</h4>
                                    </div>
                                    <span className={styles.faqChevron}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <div className={styles.faqAnswer}><p>{item.a}</p></div>
                            </div>
                        ))}
                    </div>
                    {/* CHANGE 2: "See all" link */}
                    <Link href="/faq" className={proto.faqMoreLink}>
                        See all questions &rarr;
                    </Link>
                </div>
            </section>

            </div>
            </div>
            </div>

            {/* ── MOBILE TAB: Estimate (unchanged) ── */}
            <div id="mobile-estimate" className={`${styles.mobileSectionBlock} ${mobileOpenSection === 'estimate' ? styles.mobileSectionBlockOpen : ''}`}>
            <button type="button" className={styles.mobileSectionToggle}
                onClick={() => handleMobileSectionToggle('estimate', 'mobile-estimate')}>
                <span>Estimate</span>
                <span className={styles.mobileSectionToggleIcon}>{mobileOpenSection === 'estimate' ? '-' : '+'}</span>
            </button>
            <div className={styles.mobileSectionPanel}>
            <section id="section-contact" className={styles.bottomCtaSection} data-anim="section-reveal">
                <div className={styles.bottomCtaInner}>
                    <div className={styles.sectionLabel}>Ready to Start?</div>
                    <h2 className={styles.bottomCtaTitle}>{t.getFreeEstimate} <em>Today</em></h2>
                    <p className={styles.bottomCtaDesc}>
                        No obligation. No pressure. Just a straight answer on what your project costs and how fast we can start.
                    </p>
                    <div className={styles.bottomCtaActions}>
                        <button className={styles.btnPrimary} onClick={handleEstimateClick}>
                            Get Free Estimate <ArrowIcon />
                        </button>
                        <a href="tel:5039982340" className={styles.btnSecondary} style={{ whiteSpace: 'nowrap' }}>
                            <PhoneIcon /> (503) 998-2340
                        </a>
                    </div>
                    <div className={styles.bottomCtaTrust}>
                        <span>★★★★★ 5.0 on Google and Yelp</span>
                        <span className={styles.trustSep}>·</span>
                        <span>Licensed &amp; Insured · CCB #232708</span>
                        <span className={styles.trustSep}>·</span>
                        <span>50+ Families Served</span>
                    </div>
                </div>
            </section>
            </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                CHANGE 1: Warning Signs Modal
               ══════════════════════════════════════════════════════ */}
            {showWarningModal && (
                <Modal title="Warning Signs In Your Home" onClose={() => setShowWarningModal(false)}>
                    <div className={proto.warningModalContent}>
                        <p className={proto.warningModalIntro}>
                            Small problems become expensive fast. If you see any of these, call before the damage spreads.
                        </p>
                        <div className={proto.warningCards}>
                            {MODAL_WARNINGS.map((w, i) => (
                                <div key={i} className={proto.warningCard}>
                                    <div className={proto.warningCardHeader}>
                                        <span className={`${proto.warningSev} ${w.sev === 'crit' ? proto.sevCrit : proto.sevHigh}`}>
                                            {w.sevLabel}
                                        </span>
                                    </div>
                                    <h3 className={proto.warningCardTitle}>{w.title}</h3>
                                    <p className={proto.warningCardDesc}>{w.desc}</p>
                                    <button
                                        type="button"
                                        className={proto.warningCardCta}
                                        onClick={() => { setShowWarningModal(false); handleEstimateClick(); }}
                                    >
                                        Book Free Inspection — No Obligation
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Link href="/warning-signs" className={proto.warningAllLink} onClick={() => setShowWarningModal(false)}>
                            See all warning signs &rarr;
                        </Link>
                    </div>
                </Modal>
            )}

            {/* Contact Modal (unchanged) */}
            {showContactModal && (
                <Modal title={t.getInTouch} onClose={() => setShowContactModal(false)}>
                    <HomeContactForm t={t} />
                </Modal>
            )}

        </Layout>
    );
}

// ─── HOME CONTACT FORM (unchanged from index.js) ────────
function HomeContactForm({ t }) {
    const [form, setForm] = useState({ fullName: '', phone: '', email: '', projectType: '', message: '' });
    const [status, setStatus] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => phone.replace(/\D/g, '').length >= 10;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePhone(form.phone)) { setPhoneError('Please enter a valid phone number (10 digits)'); return; }
        if (!validateEmail(form.email)) { setEmailError(t.validEmailError); return; }
        setStatus('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: form.fullName, lastName: '', email: form.email,
                    phone: form.phone, message: form.message, serviceType: form.projectType, budget: ''
                })
            });
            if (res.ok) {
                fetch('https://n8n.jandrnw.com/webhook/formulario-contacto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: form.fullName, email: form.email,
                        phone: form.phone, mensaje: form.message, serviceType: form.projectType
                    })
                }).catch(() => {});
                setStatus('success');
                setForm({ fullName: '', phone: '', email: '', projectType: '', message: '' });
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'conversion', { send_to: 'AW-17362940957/co0XCP6H_pAcEJ3opddA' });
                    window.gtag('event', 'generate_lead', { event_category: 'contact', event_label: 'home_form' });
                }
                if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Lead');
            } else setStatus('error');
        } catch { setStatus('error'); }
    };

    return (
        <div className={styles.contactForm}>
            <div className={styles.formTitle}>{t.requestFreeQuote} {t.freeQuote}</div>
            <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>{t.fullName}</label>
                        <input type="text" placeholder="John Smith" required
                            value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>{t.phoneNumber}</label>
                        <input type="tel" placeholder="(503) 000-0000" required
                            value={form.phone}
                            onChange={e => { setForm({ ...form, phone: e.target.value }); setPhoneError(''); }}
                            onBlur={e => {
                                if (e.target.value && !validatePhone(e.target.value))
                                    setPhoneError('Please enter a valid 10-digit phone number');
                            }} />
                        {phoneError && <p className={styles.validationError}>{phoneError}</p>}
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>{t.emailAddress}</label>
                    <input type="email" placeholder="john@email.com" required
                        value={form.email}
                        onChange={e => {
                            setForm({ ...form, email: e.target.value });
                            setEmailError(e.target.value && !validateEmail(e.target.value) ? t.validEmailError : '');
                        }} />
                    {emailError && <p className={styles.validationError}>{emailError}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label>{t.projectType}</label>
                    <select value={form.projectType} required
                        onChange={e => setForm({ ...form, projectType: e.target.value })}>
                        <option value="" disabled>Select Service Type</option>
                        {PROJECT_TYPES.map(pt => (
                            <option key={pt.key} value={pt.en}>{pt.en}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>{t.message}</label>
                    <textarea placeholder={t.projectDescription} rows={3}
                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className={styles.formSubmit} disabled={status === 'sending'}>
                    {status === 'sending' ? t.sending : t.getFreeEstimateBtn} {status !== 'sending' && <ArrowIcon />}
                </button>
                <div className={styles.formNote}>
                    <LockIcon />
                    {t.fastResponse?.replace('🔒 ', '') || 'Fast Response · No Obligation'}
                </div>
                {status === 'success' && <p className={styles.formSuccess}>Julio will call you within 2 hours. Need faster help? Call <a href="tel:+15039982340" style={{ color: 'inherit', fontWeight: 700 }}>(503) 998-2340</a></p>}
                {status === 'error' && <p className={styles.formError}>{t.errorMsg}</p>}
            </form>
        </div>
    );
}

// ─── DATA FETCHING ──────────────────────────────────────
export async function getStaticProps() {
    try {
        const db = await getDb();
        const result = await db.execute(
            'SELECT id, title, image, category FROM projects ORDER BY created_at DESC LIMIT 5'
        );
        const rows = result.rows || [];
        const firstImagesResult = await db.execute(`
            SELECT pi.project_id, pi.image_path
            FROM project_images pi
            INNER JOIN (
                SELECT project_id, MIN(display_order) AS min_order
                FROM project_images GROUP BY project_id
            ) first ON pi.project_id = first.project_id AND pi.display_order = first.min_order
        `);
        const firstImageMap = {};
        for (const row of (firstImagesResult.rows || [])) {
            firstImageMap[row.project_id] = row.image_path;
        }
        const projects = rows.map(p => ({
            id: p.id, title: p.title || '', image: p.image || null,
            category: p.category || '',
            firstImage: firstImageMap[p.id] || p.image || null,
        }));
        return { props: { projects }, revalidate: 60 };
    } catch (e) {
        return { props: { projects: [] }, revalidate: 30 };
    }
}
