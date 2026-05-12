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
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
    <Image src="/yelp-logo.png" alt="Yelp" width={130} height={40} style={{ objectFit: 'contain' }} />
);

const GoogleLogoIcon = () => (
    <Image src="/google-logo.png" alt="Google" width={130} height={130} style={{ objectFit: 'contain' }} />
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

// Static service cards for the home preview
const HOME_SERVICES = [
    { key: 'pt1', category: 'REMODEL',     desc: 'Kitchens, bathrooms, additions. Permits pulled, subs coordinated, finish carpentry in-house.' },
    { key: 'pt3', category: 'EMERGENCY',   desc: 'Burst pipes, fire, windstorm damage. We dispatch within the hour and stabilize the same day.' },
    { key: 'pt2', category: 'RESTORATION', desc: 'Source repair, structural drying, antimicrobial treatment, then finish-grade rebuild.' },
    { key: 'pt6', category: 'SIDING',      desc: 'Full replacement, repairs, and paint. Hardie board, LP SmartSide, vinyl — all weather-sealed.' },
    { key: 'pt5', category: 'PAINTING',    desc: 'Interior and exterior. Surface prep, primer coat, finish — clean lines and lasting color.' },
    { key: 'pt7', category: 'DRYWALL',     desc: 'Hanging, taping, mudding, and finishing. Seamless texture matching and full room repairs.' },
];

const PROJECT_TYPES = [
    { key: 'pt1',   en: 'Interior Construction & Remodeling' },
    { key: 'ptBath', en: 'Bathroom Remodel' },
    { key: 'ptKit',  en: 'Kitchen Remodel' },
    { key: 'pt2',   en: 'Restoration & Reconstruction' },
    { key: 'pt3',   en: 'Mitigation & Emergency Services' },
    { key: 'pt4',   en: 'General Repairs & Carpentry' },
    { key: 'pt5',   en: 'Paint' },
    { key: 'pt6',   en: 'Siding' },
    { key: 'pt7',   en: 'Drywall' },
    { key: 'pt8',   en: 'Other (describe in message below)' },
];

// WARNING SIGNS moved to components/WarningSigns.js
const _REMOVED = [
    {
        icon: '💧', shortTitle: 'Water Stains', severity: 'critical', service: 'Restoration & Mitigation',
        title: 'Water Stains on Ceiling or Walls',
        desc: 'Yellow or brown stains signal active water intrusion from a pipe, failed caulk, or window seal. Every day it sits, the damage gets deeper.',
        risk: 'Drywall saturates and loses structural integrity. Mold colonies form within 24-48 hours and spread behind walls.',
        solution: 'We stop the source, remove damaged drywall, treat for mold, and restore the wall — painted and finished.',
        chain: ['Water enters wall', 'Drywall softens & stains', 'Mold grows within 48 hrs', 'Framing begins to rot', 'Full wall reconstruction required'],
    },
    {
        icon: '🤢', shortTitle: 'Musty Odor', severity: 'high', service: 'Restoration & Mitigation',
        title: 'Musty or Mold Smell Inside the Home',
        desc: 'A persistent musty smell means mold is already active somewhere in your walls, floors, or crawl space — you just cannot see it yet.',
        risk: 'Mold spreads through wall cavities and into adjacent rooms. Health risk grows the longer it goes untreated.',
        solution: 'We locate the moisture source, remove all affected drywall and insulation, treat for mold, and rebuild properly.',
        chain: ['Hidden moisture accumulates', 'Mold starts growing behind surfaces', 'Spreads to adjacent walls', 'HVAC circulates spores', 'Full remediation & drywall replacement'],
    },
    {
        icon: '🎨', shortTitle: 'Paint Failure', severity: 'high', service: 'Painting & Siding',
        title: 'Cracked or Peeling Exterior Paint',
        desc: 'Paint that peels, cracks, or bubbles is no longer sealing your home. Water is already getting behind it and saturating the surface below.',
        risk: 'Moisture reaches siding and sheathing. Wood rot starts — and once it spreads, paint alone cannot fix it.',
        solution: 'We remove failed paint, replace rotted sections, prime properly, and apply a durable exterior finish that holds.',
        chain: ['Paint seal fails', 'Water reaches siding surface', 'Siding begins to rot', 'Rot spreads to wall sheathing', 'Siding replacement + repaint required'],
    },
    {
        icon: '🪵', shortTitle: 'Siding Damage', severity: 'high', service: 'Siding',
        title: 'Gaps, Cracks, or Damaged Siding Panels',
        desc: 'Missing caulk, cracked panels, or separated siding boards are open invitations for water and pests to get inside your wall system.',
        risk: 'Water infiltrates insulation and sheathing. Interior drywall begins to absorb moisture from the outside in.',
        solution: 'We remove damaged panels, treat any underlying rot, install new siding properly sealed against Oregon weather.',
        chain: ['Siding gap or crack forms', 'Water enters wall cavity', 'Insulation gets saturated', 'Drywall absorbs moisture', 'Mold + full siding replacement'],
    },
    {
        icon: '👣', shortTitle: 'Soft Floors', severity: 'critical', service: 'Remodeling & Restoration',
        title: 'Soft, Spongy, or Bouncy Floor Spots',
        desc: 'Soft areas under your feet — especially near bathrooms or kitchen — mean the subfloor is water-damaged and actively failing underneath.',
        risk: 'Subfloor panels break down. Joists below start to rot. In severe cases, floors can partially collapse.',
        solution: 'We remove flooring, replace rotted subfloor and joists, treat for mold, and install new flooring with proper moisture barrier.',
        chain: ['Water reaches subfloor', 'OSB/plywood softens', 'Joists begin to rot', 'Structural failure risk increases', 'Full subfloor + joist replacement'],
    },
    {
        icon: '🚿', shortTitle: 'Bathroom Mold', severity: 'high', service: 'Bathroom Remodeling',
        title: 'Mold or Discoloration in Bathroom Walls',
        desc: 'Black or green growth on grout lines, caulk, or wall surfaces means water is already behind your tile and into the drywall.',
        risk: 'Mold eats through drywall and reaches the subfloor. Full tile removal and wall replacement becomes unavoidable.',
        solution: 'We remove all affected tile and drywall, treat for mold, install moisture-resistant board, retile, and refinish properly.',
        chain: ['Grout or caulk fails', 'Water reaches drywall behind tile', 'Mold grows on wall cavity', 'Subfloor gets wet', 'Full bathroom gut & rebuild'],
    },
    {
        icon: '🧱', shortTitle: 'Drywall Damage', severity: 'medium', service: 'Drywall',
        title: 'Cracks, Holes, or Bulging Drywall',
        desc: 'Drywall that cracks, bulges, or has visible damage is not just cosmetic — it often signals moisture, settling, or impact damage that needs addressing.',
        risk: 'Cracks let moisture in. Bulging drywall means water is already trapped behind it. Ignored, it leads to mold and structural issues.',
        solution: 'We assess the cause, repair or replace affected sections, tape, mud, sand, and repaint to a seamless finish.',
        chain: ['Crack or damage forms', 'Moisture enters through gap', 'Paper face deteriorates', 'Mold grows behind wall', 'Section replacement + mold treatment'],
    },
    {
        icon: '🖌️', shortTitle: 'Interior Paint', severity: 'medium', service: 'Interior Painting',
        title: 'Bubbling or Peeling Interior Paint',
        desc: 'Interior paint that bubbles, peels, or flakes off walls is almost always caused by moisture behind the surface — not just poor application.',
        risk: 'The wall behind is already holding moisture. Mold grows on the paper backing of drywall before the paint even falls off.',
        solution: 'We identify the moisture source, remove and treat affected drywall if needed, and repaint with appropriate primer and finish.',
        chain: ['Moisture gets behind wall', 'Paint adhesion fails', 'Bubbles & peeling appear', 'Drywall paper gets moldy', 'Wall repair + repaint'],
    },
    {
        icon: '💨', shortTitle: 'Air Leaks', severity: 'medium', service: 'Remodeling & Siding',
        title: 'Drafts Around Windows, Doors, or Walls',
        desc: 'Feeling air movement around window frames or exterior walls means your home envelope is compromised — and water follows wherever air goes.',
        risk: 'Water infiltrates wall cavities. Drywall absorbs moisture. Insulation loses effectiveness. Mold follows.',
        solution: 'We seal penetrations, replace failed caulk and flashing, repair damaged siding or trim, and restore the water barrier.',
        chain: ['Seal fails around frame', 'Air & water enter wall cavity', 'Insulation gets wet', 'Drywall absorbs moisture', 'Mold + wall repair required'],
    },
    {
        icon: '🌊', shortTitle: 'Emergency Flooding', severity: 'critical', service: 'Mitigation & Emergency Services',
        title: 'Flooding or Burst Pipe Water Damage',
        desc: 'Standing water from a burst pipe, appliance failure, or storm flooding requires immediate response. Every hour the water sits multiplies the damage.',
        risk: 'Flooring, subfloor, drywall, and framing all absorb water rapidly. Mold begins within 24-48 hours of saturation.',
        solution: 'We respond same day — extract water, dry structure, remove all saturated materials, treat for mold, and fully reconstruct.',
        chain: ['Water event occurs', 'Flooring & subfloor saturate', 'Drywall wicks moisture up', 'Mold starts at 24-48 hrs', 'Full mitigation + reconstruction'],
    },
    {
        icon: '🔨', shortTitle: 'Outdated Bathroom', severity: 'medium', service: 'Bathroom Remodeling',
        title: 'Old or Failing Bathroom Fixtures & Tile',
        desc: 'Worn grout, cracked tile, old caulk, or outdated fixtures are more than cosmetic — they allow water to seep behind walls over time.',
        risk: 'What looks like old tile is often hiding years of slow water damage to the backer board and subfloor beneath.',
        solution: 'Complete bathroom remodel — new tile, waterproof backer, modern fixtures, proper ventilation, and durable finishes.',
        chain: ['Tile or grout cracks', 'Slow water leak behind wall', 'Backer board deteriorates', 'Subfloor begins to rot', 'Full bath gut & remodel'],
    },
    {
        icon: '🏚️', shortTitle: 'Wood Rot', severity: 'high', service: 'Siding & Restoration',
        title: 'Wood Rot on Siding, Trim, or Eaves',
        desc: 'Soft, dark, or crumbling wood on exterior trim or siding means the rot is already spreading into adjacent healthy material.',
        risk: 'Rot spreads to wall sheathing and framing. Pests are attracted to rotted wood and accelerate the damage further.',
        solution: 'We remove all rotted material, treat surrounding wood, and replace with rot-resistant materials sealed against future moisture.',
        chain: ['Paint or seal fails', 'Wood absorbs moisture', 'Rot fungus activates', 'Spreads to adjacent framing', 'Siding + framing replacement'],
    },
    {
        icon: '🧱', shortTitle: 'Warped Floors', severity: 'high', service: 'Remodeling & Restoration',
        title: 'Warping, Buckling, or Lifting Flooring',
        desc: 'Hardwood, laminate, or vinyl that warps or lifts at the edges means moisture is coming up from below — a sign of subfloor or plumbing issues.',
        risk: 'Subfloor damage. Mold grows underneath the flooring where you cannot see it. Joists deteriorate if not caught.',
        solution: 'We identify and stop the moisture source, replace the subfloor, treat for mold, and install new flooring with proper vapor barrier.',
        chain: ['Moisture reaches subfloor', 'Flooring absorbs & expands', 'Buckling becomes visible', 'Mold grows underneath', 'Subfloor + flooring replacement'],
    },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Home() {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showFloatingBtn, setShowFloatingBtn] = useState(false);
    const [projectCount, setProjectCount] = useState(null);
    const { t } = useLang();

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingBtn(window.scrollY > window.innerHeight * 0.85);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const loadProjectCount = async () => {
            try {
                const res = await fetch('/api/projects');
                if (!res.ok) return;
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProjectCount(data.length);
                }
            } catch (error) {
                console.warn('Unable to fetch project count', error);
            }
        };
        loadProjectCount();
    }, []);

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
            <section className={styles.hero}>
                {/* ✅ Después */}
<div className={styles.heroBg} />
                <div className={styles.heroAccentLine} />
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
    {t.heroItem3}.
</p>
                    <div className={styles.heroActions}>
                        <button className={styles.btnPrimary} onClick={handleEstimateClick}>
                            {t.getFreeEstimate} <ArrowIcon />
                        </button>
                        <Link href="/projects" className={styles.btnSecondary}>
                            {t.viewOurWork}
                        </Link>
                    </div>
                    <div className={styles.heroReviewBlock}>
                        <div className={styles.heroReviewRow}>
                            <span className={styles.heroReviewLabel}>{t.lookUsUp}</span>
                            <div className={styles.heroReviewItems}>
                                <span className={styles.heroReviewIcon}><YelpLogoIcon /></span>
                                <span className={styles.heroReviewIcon}><GoogleLogoIcon /></span>
                                <span className={styles.heroReviewStars}>★★★★★</span>
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
                    </div>
                </div>
                <div className={styles.heroFormPanel}>
                    <HomeContactForm t={t} />
                </div>
            </div>

                {/* Stats */}
                <div className={styles.heroStats}>
                    <div className={styles.statBox}>
                        <div className={styles.statNum}>20+</div>
                        <div className={styles.statLabel}>{t.yearsExp || 'Years Exp.'}</div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statNum}>
                            {projectCount !== null ? `${projectCount}+` : '...'}
                        </div>
                        <div className={styles.statLabel}>{t.projectsDone || 'Projects'}</div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statNum}>★ 5.0</div>
                        <div className={styles.statLabel}>{t.rating || 'Rating'}</div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES PREVIEW ── */}
            <section className={styles.servicesSection}>
                <div className={styles.servicesInner}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionLabel}>{t.ourServicesLabel || 'What We Do'}</div>
                        <h2 className={styles.sectionTitle}>
                            {t.ourServices.split(' ')[0]} <em>{t.ourServices.split(' ').slice(1).join(' ')}</em>
                        </h2>
                    </div>
                    <div className={styles.servicesGrid}>
                        {HOME_SERVICES.map((svc, idx) => (
                            <Link href="/services" key={svc.key} className={styles.serviceCard}>
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
                    <div className={styles.servicesViewAll}>
                        <Link href="/services" className={styles.btnSecondary}>
                            {t.ourServices} <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── REVIEWS ── */}
            <Reviews />

            {/* ── ABOUT ── */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutInner}>
                    <div className={styles.aboutLogoWrap}>
                        <Image src="/logo.png" alt="J&R NW Construction" width={340} height={340} style={{ borderRadius: '50%' }} />
                    </div>
                    <div className={styles.aboutContent}>
                        <div className={styles.sectionLabel}>{t.weWorkForYou}</div>
                        <h2 className={styles.sectionTitle}>
                            J&amp;R NW <em>Construction</em>
                        </h2>
                        <p>{t.companyDesc}</p>
                    </div>
                </div>
            </section>

            {/* ── WARNING SIGNS ── */}
            <WarningSigns onCta={handleEstimateClick} />

            {/* ── FAQ / OBJECTION HANDLING ── */}
            <section className={styles.faqSection}>
                <div className={styles.faqInner}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionLabel}>Got Questions?</div>
                        <h2 className={styles.sectionTitle}>Common <em>Questions</em></h2>
                    </div>
                    <div className={styles.faqGrid}>
                        <div className={styles.faqItem}>
                            <h4>How fast can you start?</h4>
                            <p>We typically respond within 2 hours and can schedule a free estimate the same or next day. Many emergency jobs start same day.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>How much does it cost?</h4>
                            <p>Every project is different. We offer free, no-obligation estimates with detailed written quotes. No hidden fees, no surprises.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Are you licensed and insured?</h4>
                            <p>Yes. Oregon CCB #232708. Fully licensed, bonded, and insured. We carry full liability and workers' compensation coverage on every job.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Do you work with insurance claims?</h4>
                            <p>Yes. We regularly work alongside insurance adjusters for water damage, fire, and structural repairs. We document everything for your claim.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>What areas do you serve?</h4>
                            <p>Serving Portland, Tigard, Tualatin, Gresham, Happy Valley, Oregon City, Milwaukie, Hillsboro &amp; Beaverton.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Do you guarantee your work?</h4>
                            <p>We do it right the first time — every time. Our crew takes full ownership of every project. 5-star ratings on Yelp and Google reflect the standard we hold ourselves to on every single job.</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button className={styles.btnPrimary} onClick={handleEstimateClick}>
                            Get Your Free Estimate <ArrowIcon />
                        </button>
                    </div>
                </div>
            </section>

            {/* Floating button */}
            {showFloatingBtn && (
                <button className={styles.floatingContactBtn} onClick={handleEstimateClick} aria-label={t.getEstimate}>
                    <span className={styles.floatingBtnIcon}><ChatIcon /></span>
                    <span className={styles.floatingBtnText}>{t.getEstimate}</span>
                </button>
            )}

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
    const validatePhone = (phone) => phone === '' || /^[0-9\s\-\(\)]+$/.test(phone);

const handleSubmit = async (e) => {
    e.preventDefault();
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
                        <input type="tel" placeholder="(503) 000-0000"
                            value={form.phone}
                            onChange={e => {
                                if (validatePhone(e.target.value)) {
                                    setForm({ ...form, phone: e.target.value });
                                    setPhoneError('');
                                } else setPhoneError(t.onlyNumbersError);
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
