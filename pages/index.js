import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Reviews from '../components/Reviews';
import WarningSigns from '../components/WarningSigns';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
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

const MailIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const MapIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

const ChatIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

// Service icons
const HomeIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const BuildingIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const RefreshIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const BoltIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const PaintIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);

const GridIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

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

// ─── HOW WE WORK ─────────────────────────────────────────────────────────────
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

const PROCESS_STEPS = [
    { Icon: HowWeWorkPhoneIcon,    num: '01', title: 'Free Consultation',  desc: 'Tell us about your project. We listen before we plan.' },
    { Icon: HowWeWorkClipboardIcon, num: '02', title: 'Custom Plan & Quote', desc: 'Transparent pricing with no hidden surprises.'          },
    { Icon: HowWeWorkHammerIcon,   num: '03', title: 'Quality Construction', desc: 'We build with care, on schedule and on budget.'        },
    { Icon: HowWeWorkCheckIcon,    num: '04', title: 'Final Walkthrough',   desc: 'Your satisfaction is the only sign-off that counts.'   },
];

// Static service cards for the home preview
const HOME_SERVICES = [
    { key: 'pt3', category: 'EMERGENCY',   desc: 'Burst pipes, fire, windstorm damage. We dispatch within the hour and stabilize the same day.' },
    { key: 'pt2', category: 'RESTORATION', desc: 'We work with your insurance adjuster. Source repair, structural drying, antimicrobial treatment, finish-grade rebuild.' },
    { key: 'pt1', category: 'REMODEL',     desc: 'Kitchens, bathrooms, additions. Permits pulled, subs coordinated, finish carpentry in-house.' },
    { key: 'pt6', category: 'SIDING',      desc: 'Full replacement, repairs, and paint. Hardie board, LP SmartSide, vinyl — all weather-sealed.' },
    { key: 'pt5', category: 'PAINTING',    desc: 'Interior and exterior. Surface prep, primer coat, finish — clean lines and lasting color.' },
    { key: 'pt7', category: 'DRYWALL',     desc: 'Hanging, taping, mudding, and finishing. Seamless texture matching and full room repairs.' },
];

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

// WARNING SIGNS moved to components/WarningSigns.js

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Home() {
    const [showContactModal, setShowContactModal] = useState(false);
    const [openFaqs, setOpenFaqs] = useState(new Set());
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

    return (
        <Layout
            title="Portland General Contractor | Home Remodeling & Restoration | J&R NW Construction"
            description="J&R NW Construction — Portland's trusted general contractor. Expert home remodeling, siding installation, water damage restoration & repairs. Licensed, bonded & insured. CCB #232708. Call (503) 998-2340."
            canonical="/"
            onContactClick={() => setShowContactModal(true)}
        >

            {/* ── HERO ── */}
            <section className={styles.hero} data-anim="hero-section">
                {/* ✅ Después */}
<div className={styles.heroBg} data-anim="hero-bg" />
                <div className={styles.heroInner}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <div className={styles.heroBadgeDot} />
                        {t.navSubtitle}
                    </div>
                    <h1 className={styles.heroH1}>
                        {t.yourTrusted}
                        <em>{t.generalContractor}</em>
                    </h1>
                    <p className={styles.heroDesc}>
    {t.heroItem1}.<br />
    {t.heroItem2}.<br />
    {t.heroItem3}.<br />
    <span style={{ fontSize: '13px', opacity: 0.7 }}>Portland · Tigard · Tualatin · Gresham · Happy Valley · Oregon City</span>
</p>
                    <div className={styles.heroActions}>
                        <button className={styles.btnPrimary} onClick={() => {
                            const el = document.getElementById('hero-form');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            else handleEstimateClick();
                        }}>
                            {t.getFreeEstimate} <ArrowIcon />
                        </button>
                        <Link href="/projects" className={styles.btnSecondary}>
                            {t.viewOurWork}
                        </Link>
                    </div>
                    <a href="tel:5039982340" className={styles.heroCallLink}
                        onClick={() => { if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'phone_click', { event_category: 'contact', event_label: 'hero_call' }); }}>
                        <PhoneIcon /> (503) 998-2340 — Tap to Call
                    </a>
                    <div className={styles.heroReviewBlock}>
                        <div className={styles.heroReviewRow}>
                            <span className={styles.heroReviewLabel}>{t.lookUsUp}</span>
                            <div className={styles.heroReviewItems}>
                                <span className={styles.heroReviewIcon}><YelpLogoIcon /></span>
                                <span className={styles.heroReviewIcon}><GoogleLogoIcon /></span>
                                <span className={styles.heroReviewStars}>★★★★★</span>
                                <span className={styles.heroReviewCount}>50+ reviews</span>
                            </div>
                        </div>
                        <div className={styles.heroReviewGuarantee}>100% Satisfaction Guarantee</div>
                        <div className={styles.heroReviewCcb}>CCB: 232708</div>
                    </div>
                    <div className={styles.heroTrust}>
                        <div className={styles.trustItem}>
                            <ShieldIcon />
                            {t.licensed}, {t.insured} &amp; {t.bonded}
                        </div>
                        <span className={styles.trustSep}>·</span>
                        <div className={styles.trustItem}>
                            <StarIcon />
                            BBB {t.accredited || 'Accredited'}
                        </div>
                        <span className={styles.trustSep}>·</span>
                        <div className={styles.trustItem}>
                            <CheckIcon />
                            100% Satisfaction Guarantee
                        </div>
                    </div>
                </div>
                <div className={styles.heroFormPanel} id="hero-form">
                    <HomeContactForm t={t} />
                </div>
            </div>

                {/* Stats */}
                <div className={styles.heroStats}>
                    <div className={styles.statBox} data-anim="stat">
                        <div className={styles.statNum} data-anim="stat-num">20+</div>
                        <div className={styles.statLabel}>{t.yearsExp || 'Years Exp.'}</div>
                    </div>
                    <div className={styles.statBox} data-anim="stat">
                        <div className={styles.statNum} data-anim="stat-num">50+</div>
                        <div className={styles.statLabel}>Families Served</div>
                    </div>
                    <div className={styles.statBox} data-anim="stat">
                        <div className={styles.statNum} data-anim="stat-num">★ 5.0</div>
                        <div className={styles.statLabel}>{t.rating || 'Rating'}</div>
                    </div>
                </div>
                {/* Credential strip */}
                <div className={styles.heroCredentials}>
                    <span><ShieldIcon /> {t.licensed}, {t.insured} &amp; {t.bonded}</span>
                    <span>CCB #232708</span>
                    <span>BBB {t.accredited || 'Accredited'}</span>
                    <span>100% Satisfaction Guarantee</span>
                </div>
            </section>

            {/* ── REVIEWS ── */}
            <Reviews />

            {/* ── HOW WE WORK ── */}
            <section className={styles.hwwSection}>
                <div className={styles.hwwInner}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionLabel}>How We Work</div>
                        <h2 className={styles.sectionTitle}>
                            From First Call to <em>Final Nail</em>
                        </h2>
                    </div>
                    <div className={styles.hwwSteps}>
                        {PROCESS_STEPS.map((step, i) => (
                            <div key={step.num} className={styles.hwwStep} data-anim="fade-up">
                                <div className={styles.hwwNum}>{step.num}</div>
                                <div className={styles.hwwIcon}><step.Icon /></div>
                                <h3 className={styles.hwwStepTitle}>{step.title}</h3>
                                <p className={styles.hwwStepDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WE HANDLE EVERYTHING ── */}
            <section className={styles.handleSection}>
                <div className={styles.handleInner}>
                    <div className={styles.sectionHeader} data-anim="fade-up">
                        <div className={styles.sectionLabel}>One Call. Zero Stress.</div>
                        <h2 className={styles.sectionTitle}>
                            We Handle <em>Everything</em>
                        </h2>
                        <p className={styles.handleSubtitle}>
                            Materials, disposal, cleanup — we own the whole job start to finish. You come home to a space that looks like new.
                        </p>
                    </div>
                    <div className={styles.handleGrid}>
                        {HANDLE_ITEMS.map((item, i) => (
                            <div key={i} className={styles.handleCard}>
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
            </section>

            {/* ── SERVICES PREVIEW ── */}
            <section className={styles.servicesSection}>
                <div className={styles.servicesInner}>
                    <div className={styles.sectionHeader} data-anim="fade-up">
                        <div className={styles.sectionLabel}>{t.ourServicesLabel || 'What We Do'}</div>
                        <h2 className={styles.sectionTitle}>
                            {t.ourServices.split(' ')[0]} <em>{t.ourServices.split(' ').slice(1).join(' ')}</em>
                        </h2>
                    </div>
                    <div className={styles.servicesGrid}>
                        {HOME_SERVICES.map((svc, idx) => (
                            <Link href="/services" key={svc.key} className={styles.serviceCard} data-anim="service-card">
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
                        ))}
                    </div>
                    <div className={styles.emergencyStrip}>
                        <div className={styles.emergencyStripContent}>
                            <div>
                                <h3 className={styles.emergencyStripTitle}>Need Immediate Assistance?</h3>
                                <p className={styles.emergencyStripDesc}>Our emergency response teams are on standby 24/7 to handle critical property damage and restoration needs.</p>
                            </div>
                            <a href="tel:5039982340" className={styles.emergencyStripBtn} onClick={() => { if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'phone_click', { event_category: 'contact', event_label: 'emergency_strip' }); }}>
                                Call (503) 998-2340
                            </a>
                        </div>
                    </div>
                    <div className={styles.servicesViewAll}>
                        <Link href="/services" className={styles.btnSecondary}>
                            {t.ourServices} <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── WARNING SIGNS ── */}
            <WarningSigns onCta={handleEstimateClick} />

            {/* ── ABOUT ── */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutInner}>
                    <div className={styles.aboutLogoWrap} data-anim="about-logo">
                        <Image src="/logo.png" alt="J&R NW Construction" width={340} height={340} style={{ borderRadius: '50%' }} />
                    </div>
                    <div className={styles.aboutContent} data-anim="fade-up">
                        <div className={styles.sectionLabel}>{t.weWorkForYou}</div>
                        <h2 className={styles.sectionTitle}>
                            J&amp;R NW <em>Construction</em>
                        </h2>
                        <p>{t.companyDesc}</p>
                    </div>
                </div>
            </section>

            {/* ── PORTFOLIO PREVIEW ── */}
            <section className={styles.projectsSection}>
                <div className={styles.projectsInner}>
                    <div className={styles.projectsHeader}>
                        <div>
                            <div className={styles.sectionLabel}>Recent Work</div>
                            <h2 className={styles.sectionTitle}>
                                Our <em>Projects</em>
                            </h2>
                        </div>
                        <Link href="/projects" className={styles.btnSecondary}>
                            View All Work <ArrowIcon />
                        </Link>
                    </div>
                    <div className={styles.projectsGrid}>
                        <div className={`${styles.projectCard} ${styles.featured}`} style={{ position: 'relative' }}>
                            <Image src="/assets/bathroom-reno-2.png" alt="Bathroom Renovation" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
                            <div className={styles.projectOverlay}>
                                <span className={styles.projectCategory}>Remodel</span>
                                <div className={styles.projectTitle}>Bathroom Renovation</div>
                                <div className={styles.projectMeta}>Tigard</div>
                            </div>
                        </div>
                        <div className={styles.projectCard} style={{ position: 'relative' }}>
                            <Image src="/assets/kitchen-remodel-1.png" alt="Kitchen Remodel" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
                            <div className={styles.projectOverlay}>
                                <span className={styles.projectCategory}>Remodel</span>
                                <div className={styles.projectTitle}>Kitchen Remodel</div>
                                <div className={styles.projectMeta}>Portland</div>
                            </div>
                        </div>
                        <div className={styles.projectCard} style={{ position: 'relative' }}>
                            <Image src="/assets/siding-project-1.png" alt="Siding Project" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
                            <div className={styles.projectOverlay}>
                                <span className={styles.projectCategory}>Siding</span>
                                <div className={styles.projectTitle}>Exterior Siding</div>
                                <div className={styles.projectMeta}>Beaverton</div>
                            </div>
                        </div>
                        <div className={styles.projectCard} style={{ position: 'relative' }}>
                            <Image src="/assets/fire-damage.png" alt="Fire Damage Restoration" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
                            <div className={styles.projectOverlay}>
                                <span className={styles.projectCategory}>Restoration</span>
                                <div className={styles.projectTitle}>Fire Damage Restoration</div>
                                <div className={styles.projectMeta}>Gresham · Insurance claim</div>
                            </div>
                        </div>
                        <div className={styles.projectCard} style={{ position: 'relative' }}>
                            <Image src="/assets/drywall.png" alt="Drywall & Finishing" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} />
                            <div className={styles.projectOverlay}>
                                <span className={styles.projectCategory}>Drywall</span>
                                <div className={styles.projectTitle}>Drywall & Finishing</div>
                                <div className={styles.projectMeta}>Happy Valley</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICE AREAS ── */}
            <section className={styles.areasSection}>
                <div className={styles.areasInner}>
                    <div className={styles.areasLeft}>
                        <div className={styles.sectionLabel}>Where We Work</div>
                        <h2 className={styles.sectionTitle}>
                            Serving <em>Portland Metro</em>
                        </h2>
                        <p className={styles.areasDesc}>
                            Licensed contractor serving 9 cities across the Portland metro area. CCB #232708. Available 24/7 for emergencies.
                        </p>
                        <div className={styles.areasGrid}>
                            {['Portland', 'Tigard', 'Tualatin', 'Gresham', 'Happy Valley', 'Oregon City', 'Milwaukie', 'Hillsboro', 'Beaverton'].map(city => (
                                <div key={city} className={styles.areaChip}>
                                    <CheckIcon /> {city}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.areasMap}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d178918.09!2d-122.6784!3d45.5051!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950b0b7da97427%3A0x1c36b9e6f6d18591!2sPortland%2C%20OR!5e0!3m2!1sen!2sus"
                            width="100%"
                            height="400"
                            style={{ border: 0, borderRadius: 4, filter: 'invert(90%) hue-rotate(180deg)', display: 'block' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="J&R NW Construction service area map"
                        />
                    </div>
                </div>
            </section>

            {/* ── FAQ / OBJECTION HANDLING ── */}
            <section className={styles.faqSection}>
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
                            { cat: 'Timeline',   q: t.faqQ1, a: t.faqA1 },
                            { cat: 'Pricing',    q: t.faqQ2, a: t.faqA2 },
                            { cat: 'Compliance', q: t.faqQ3, a: t.faqA3 },
                            { cat: 'Claims',     q: t.faqQ4, a: t.faqA4 },
                            { cat: 'Logistics',  q: t.faqQ5, a: t.faqA5 },
                            { cat: 'Quality',    q: t.faqQ6, a: t.faqA6 },
                        ].map((item, i) => (
                            <div key={i} className={`${styles.faqAccordion} ${openFaqs.has(i) ? styles.faqOpen : ''}`}>
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
                                <div className={styles.faqAnswer}>
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ── */}
            <section className={styles.bottomCtaSection}>
                <div className={styles.bottomCtaInner}>
                    <div className={styles.sectionLabel}>Ready to Start?</div>
                    <h2 className={styles.bottomCtaTitle}>
                        {t.getFreeEstimate} <em>Today</em>
                    </h2>
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
                        <span>★★★★★ 5.0 on Google</span>
                        <span className={styles.trustSep}>·</span>
                        <span>Licensed &amp; Insured · CCB #232708</span>
                        <span className={styles.trustSep}>·</span>
                        <span>50+ Families Served</span>
                    </div>
                </div>
            </section>

            {/* Contact Modal */}
            {showContactModal && (
                <Modal title={t.getInTouch} onClose={() => setShowContactModal(false)}>
                    <HomeContactForm t={t} />
                </Modal>
            )}

        </Layout>
    );
}

// ─── HOME CONTACT FORM ────────────────────────────────────────────────────────
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
            // Enviar a n8n
            fetch('https://n8n.jandrnw.com/webhook/formulario-contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    mensaje: form.message,
                    serviceType: form.projectType
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
                            onChange={e => {
                                setForm({ ...form, phone: e.target.value });
                                setPhoneError('');
                            }}
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
                <div className={styles.formPromise}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    We'll be in touch within 2 hours
                </div>
                <button type="submit" className={styles.formSubmit} disabled={status === 'sending'}
                    onClick={() => {
                        if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'form_submit_click', { event_category: 'contact', event_label: 'free_estimate_form' });
                        fetch('/api/monitor/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'form_submit_click' }), keepalive: true }).catch(() => {});
                    }}>
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
