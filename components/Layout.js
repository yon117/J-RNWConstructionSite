import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import CurtainToggle from './CurtainToggle';
import styles from './Layout.module.css';

// SVG icons inline (no emoji, no extra packages)
const PhoneIcon = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.51z" clipRule="evenodd"/>
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
    </svg>
);

const BannerAlertIcon = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{width:'13px',height:'13px',flexShrink:0}}>
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const YelpIcon = () => (
    <Image
        src="/yelp-logo.png"
        alt="Yelp"
        width={18}
        height={18}
        style={{ objectFit: 'cover', objectPosition: 'center right' }}
    />
);

const GoogleIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const ArrowIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const SITE_URL = 'https://jandrnw.com';
const DEFAULT_DESCRIPTION = 'J&R NW Construction — Portland\'s trusted general contractor. Home remodeling, siding installation, water damage restoration & repairs. Licensed, bonded & insured. CCB #232708. Call (503) 998-2340.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/home-hero-bg.jpg`;
const SERVICE_LINKS = [
    { href: '/services/remodeling', labelKey: 'pt1' },
    { href: '/services/reconstruction', labelKey: 'pt2' },
    { href: '/services/mitigation', labelKey: 'pt3' },
    { href: '/services/siding', labelKey: 'pt6' },
    { href: '/services/painting', labelKey: 'pt5' },
    { href: '/services/drywall', labelKey: 'pt7' },
];

const SEASONAL_MESSAGES = {
    winter: [
        { text: 'Frozen or burst pipes? Structural ice damage? We respond same day.' },
        { text: 'Ice dams on your roof cause hidden water damage. Free inspection available now.' },
        { text: 'Atmospheric rivers hitting Oregon hard — flooding in your basement? We fix it fast.' },
        { text: 'Wind storm knocked something loose? Emergency structural repairs — call us today.' },
    ],
    spring: [
        { text: 'Spring flooding & landslide season — Free water damage assessment. Don\'t let mold set in.' },
        { text: 'Snowmelt + spring rain = foundation flooding risk. Get a free inspection before it worsens.' },
        { text: 'Mold from winter moisture trapped inside? We find it and fix it. Free assessment.' },
        { text: 'Roof damage from winter storms showing up now? Don\'t wait — free estimate available.' },
    ],
    summer: [
        { text: 'Wildfire season in Oregon — protect your home\'s exterior before smoke & heat cause damage.' },
        { text: 'Heat cracking your exterior paint or siding? Free estimate before it gets worse.' },
        { text: 'Dry rot on decks and siding peaks in summer. Catch it early — free inspection.' },
        { text: 'Summer is the best time for exterior projects — book now before slots fill up.' },
    ],
    fall: [
        { text: 'Fall windstorm season approaching — schedule exterior repairs before winter arrives.' },
        { text: 'Clogged gutters cause ice dams and roof damage. Clean & repair before first freeze.' },
        { text: 'Gaps in caulking and siding let Oregon rains in — waterproofing estimates available now.' },
        { text: 'Pre-winter inspection season — catch problems now before cold locks them in. Free estimate.' },
    ],
};

function getSeasonMessages() {
    const m = new Date().getMonth();
    if (m === 11 || m <= 1) return SEASONAL_MESSAGES.winter;
    if (m >= 2 && m <= 4)   return SEASONAL_MESSAGES.spring;
    if (m >= 5 && m <= 8)   return SEASONAL_MESSAGES.summer;
    return SEASONAL_MESSAGES.fall;
}

function getSeasonName() {
    const m = new Date().getMonth();
    if (m === 11 || m <= 1) return 'WINTER';
    if (m >= 2 && m <= 4)   return 'SPRING';
    if (m >= 5 && m <= 8)   return 'SUMMER';
    return 'FALL';
}

export default function Layout({ children, title = 'J&R NW Construction | Portland General Contractor', description = DEFAULT_DESCRIPTION, canonical, onContactClick }) {
    const router = useRouter();
    const { t, lang, chooseLang } = useLang();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const [bannerIdx, setBannerIdx] = useState(0);
    const seasonMsgs = getSeasonMessages();
    const banner = seasonMsgs[bannerIdx];
    const seasonName = getSeasonName();

    useEffect(() => {
        const dismissed = sessionStorage.getItem('bannerDismissed');
        if (!dismissed) setShowBanner(true);
    }, []);

    useEffect(() => {
        if (!showBanner) return;
        const id = setInterval(() => {
            setBannerIdx(i => (i + 1) % seasonMsgs.length);
        }, 7000);
        return () => clearInterval(id);
    }, [showBanner, seasonMsgs.length]);

    const dismissBanner = () => {
        setShowBanner(false);
        sessionStorage.setItem('bannerDismissed', '1');
    };

    useEffect(() => {
        if (!menuOpen) return;
        const scrollY = window.scrollY;
        const prevBody = document.body.style.overflow;
        const prevBodyPosition = document.body.style.position;
        const prevBodyTop = document.body.style.top;
        const prevBodyWidth = document.body.style.width;
        const prevBodyLeft = document.body.style.left;
        const prevBodyRight = document.body.style.right;
        const prevHtml = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prevBody;
            document.body.style.position = prevBodyPosition;
            document.body.style.top = prevBodyTop;
            document.body.style.width = prevBodyWidth;
            document.body.style.left = prevBodyLeft;
            document.body.style.right = prevBodyRight;
            document.documentElement.style.overflow = prevHtml;
            window.scrollTo(0, scrollY);
        };
    }, [menuOpen]);

    useEffect(() => {
        router.prefetch('/services');
        router.prefetch('/projects');
    }, [router]);

    useEffect(() => {
        if (!menuOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen]);

    const handleEmergency = () => {
        fetch('/api/monitor/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'emergency_click' }), keepalive: true }).catch(() => {});
    };
    const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

    return (
        <ThemeProvider>
        <div className={styles.container}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph */}
                <meta property="og:type"        content="website" />
                <meta property="og:url"         content={canonicalUrl} />
                <meta property="og:title"       content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image"       content={DEFAULT_OG_IMAGE} />
                <meta property="og:site_name"   content="J&R NW Construction" />
                <meta property="og:locale"      content="en_US" />

                {/* Twitter Card */}
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image"       content={DEFAULT_OG_IMAGE} />

                <meta name="robots" content="index, follow" />
                <link rel="icon" href="/favicon.ico" />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "J&R NW Construction LLC",
                        "description": "Portland's trusted general contractor. Home remodeling, siding, water damage restoration & emergency repairs. Licensed, bonded & insured.",
                        "url": "https://jandrnw.com",
                        "telephone": "+15039982340",
                        "email": "jandrnwconstruction@gmail.com",
                        "image": "https://jandrnw.com/assets/home-hero-bg.jpg",
                        "priceRange": "$$",
                        "openingHours": "Mo-Su 00:00-24:00",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "17942 SE Division St",
                            "addressLocality": "Portland",
                            "addressRegion": "OR",
                            "postalCode": "97236",
                            "addressCountry": "US"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 45.5051,
                            "longitude": -122.6750
                        },
                        "areaServed": [
                            "Portland","Tigard","Tualatin","Gresham",
                            "Happy Valley","Oregon City","Milwaukie","Hillsboro","Beaverton"
                        ],
                        "sameAs": ["https://www.facebook.com/JRNWConstruction/"],
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "5.0",
                            "reviewCount": "50",
                            "bestRating": "5"
                        },
                        "hasCredential": "Oregon CCB #232708"
                    })}}
                />
            </Head>

            <header id="site-header" className={styles.stickyHeader}>
            {/* ── TOPBAR ── */}
            <div className={styles.topbar}>
                <div className={styles.topbarMobile}>
                    <div className={styles.topbarRow}>
                        <PhoneIcon />
                        <a href="tel:+15039982340"
                            onClick={() => {
                                if (typeof gtag_report_conversion !== 'undefined') gtag_report_conversion('tel:+15039982340');
                                if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'phone_click', { event_category: 'contact', event_label: 'topbar' });
                                fetch('/api/monitor/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'phone_click' }), keepalive: true }).catch(() => {});
                            }}>
                            (503) 998-2340
                        </a>
                    </div>
                    <div className={styles.topbarRow}>
                        <MailIcon />
                        <a href="mailto:jandrnwconstruction@gmail.com"
                            onClick={() => {
                                if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'email_click', { event_category: 'contact', event_label: 'topbar' });
                                fetch('/api/monitor/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'email_click' }), keepalive: true }).catch(() => {});
                            }}>
                            jandrnwconstruction@gmail.com
                        </a>
                    </div>
                    <div className={styles.topbarRow}>{t.navAvailability}</div>
                </div>
                <div className={styles.topbarDesktop}>
                <div className={styles.topbarItem}>
                    <PhoneIcon />
                    <a href="tel:+15039982340"
                        onClick={() => {
                            if (typeof gtag_report_conversion !== 'undefined') gtag_report_conversion('tel:+15039982340');
                            if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'phone_click', { event_category: 'contact', event_label: 'topbar' });
                            fetch('/api/monitor/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'phone_click' }), keepalive: true }).catch(() => {});
                        }}>
                        (503) 998-2340
                    </a>
                </div>
                <div className={styles.topbarDivider} />
                <div className={styles.topbarItem}>
                    <MailIcon />
                    <a href="mailto:jandrnwconstruction@gmail.com"
                        onClick={() => {
                            if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'email_click', { event_category: 'contact', event_label: 'topbar' });
                            fetch('/api/monitor/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'email_click' }), keepalive: true }).catch(() => {});
                        }}>
                        jandrnwconstruction@gmail.com
                    </a>
                </div>
                <div className={styles.topbarDivider} />
                <div className={styles.topbarItem}>{t.navAvailability}</div>
                </div>
            </div>

            {/* ── SEASONAL BANNER ── */}
            {showBanner && (
                <div className={styles.seasonalBanner}>
                    <div className={styles.seasonalContent}>
                        <span className={styles.seasonalBadge}>{seasonName}</span>
                        <BannerAlertIcon />
                        <span className={styles.seasonalText}>{banner.text}</span>
                    </div>
                    <button className={styles.bannerClose} onClick={dismissBanner} aria-label="Dismiss">✕</button>
                </div>
            )}

            {/* ── NAVBAR ── */}
            <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
                {/* Brand */}
                <Link href="/" className={styles.navBrand}>
                    <div className={styles.navLogoCircle}>
                        <Image src="/logo.png" alt="J&R NW Construction" width={34} height={34} />
                    </div>
                    <div className={styles.navBrandText}>
                        J&amp;R NW Construction
                        <span>{t.navSubtitle}</span>
                    </div>
                </Link>

                {/* Desktop right side */}
                <div className={styles.navRight}>
                    {/* Nav links */}
                    <ul className={styles.navLinks}>
                        <li><Link href="/">{t.home}</Link></li>
                        <li><Link href="/services">{t.services}</Link></li>
                        <li><Link href="/projects">{t.projects}</Link></li>
                    </ul>

                    {/* Social icons */}
                    <div className={styles.navSocials}>
                        <a href="https://www.facebook.com/JRNWConstruction/" target="_blank" rel="noreferrer"
                            className={styles.navSocialIcon} title="Facebook">
                            <FacebookIcon />
                        </a>
                        <a href="https://www.instagram.com/jandrnwconstruction/" target="_blank" rel="noreferrer"
                            className={styles.navSocialIcon} title="Instagram">
                            <InstagramIcon />
                        </a>
                        <a href="https://m.yelp.com/biz/j-and-r-nw-construction-portland-5" target="_blank" rel="noreferrer"
                            className={styles.navSocialIcon} title="Yelp">
                            <img src="/icons8-yelp-48.png" alt="Yelp" width={16} height={16} style={{ objectFit: 'contain' }} />
                        </a>
                        <a href="https://www.google.com/maps/place/J%26R+NW+Construction/" target="_blank" rel="noreferrer"
                            className={styles.navSocialIcon} title="Google">
                            <GoogleIcon />
                        </a>
                    </div>

                    {/* Language switcher */}
                    <div className={styles.langSwitcher}>
                        <button
                            className={`${styles.langBtn} ${lang === 'en' || !lang ? styles.langBtnActive : ''}`}
                            onClick={() => chooseLang('en')}>EN</button>
                        <button
                            className={`${styles.langBtn} ${lang === 'es' ? styles.langBtnActive : ''}`}
                            onClick={() => chooseLang('es')}>ES</button>
                    </div>

                    {/* CTA */}
                    {onContactClick ? (
                        <button type="button" onClick={onContactClick} className={styles.navCta}>
                            {t.navEstimate}
                        </button>
                    ) : (
                        <Link href="/" className={styles.navCta}>{t.navEstimate}</Link>
                    )}

                    {/* Day/Night toggle */}
                    <CurtainToggle />
                </div>

               {/* Hamburger (mobile) — toggles to X when open */}
<button
    className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
    onClick={() => setMenuOpen(v => !v)}
    aria-label={menuOpen ? 'Close menu' : (t.menuLabel || 'Open menu')}
    aria-expanded={menuOpen}
    aria-controls="mobile-menu">
    <span className={styles.hamburgerLabel}>{menuOpen ? 'CLOSE' : 'MENU'}</span>
    <div className={styles.hamburgerLines}>
        <span />
        <span />
        <span />
    </div>
</button>
            </nav>

            {/* ── MOBILE MENU ── */}
            <div
                id="mobile-menu"
                className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
                onClick={() => setMenuOpen(false)}
            >
                <div className={styles.mobileMenuPanel} onClick={(event) => event.stopPropagation()}>
                <div className={styles.mobileMenuHeader}>
                    <Link href="/" className={styles.navBrand} onClick={() => setMenuOpen(false)}>
                        <div className={styles.navLogoCircle}>
                            <Image src="/logo.png" alt="J&R NW Construction" width={34} height={34} />
                        </div>
                        <div className={styles.navBrandText}>
                            J&amp;R NW Construction
                            <span>{t.navSubtitle}</span>
                        </div>
                    </Link>
                    <button
                        className={`${styles.hamburger} ${styles.mobileMenuClose} ${menuOpen ? styles.hamburgerOpen : ''}`}
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                        aria-expanded={menuOpen}
                    >
                        <span className={styles.hamburgerLabel}>CLOSE</span>
                        <div className={styles.hamburgerLines}>
                            <span />
                            <span />
                            <span />
                        </div>
                    </button>
                </div>
                <ul className={styles.mobileMenuList}>
                    <li><Link href="/" onClick={() => setMenuOpen(false)}>{t.home} <ArrowIcon /></Link></li>
                    <li><Link href="/services" onClick={() => setMenuOpen(false)}>{t.services} <ArrowIcon /></Link></li>
                    <li><Link href="/projects" onClick={() => setMenuOpen(false)}>{t.projects} <ArrowIcon /></Link></li>
                    <li>
                        {onContactClick ? (
                            <button type="button" className={styles.mobileCta}
                                onClick={() => { setMenuOpen(false); onContactClick(); }}>
                                {t.navEstimate} <ArrowIcon />
                            </button>
                        ) : (
                            <Link href="/" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
                                {t.navEstimate} <ArrowIcon />
                            </Link>
                        )}
                    </li>
                </ul>
                <div className={styles.mobileBottom}>
                    <div className={styles.mobileSocials}>
                        <a href="https://www.facebook.com/JRNWConstruction/" target="_blank" rel="noreferrer" title="Facebook">
                            <FacebookIcon />
                        </a>
                        <a href="https://www.instagram.com/jandrnwconstruction/" target="_blank" rel="noreferrer" title="Instagram">
                            <InstagramIcon />
                        </a>
                        <a href="https://m.yelp.com/biz/j-and-r-nw-construction-portland-5" target="_blank" rel="noreferrer" title="Yelp">
                            <img src="/icons8-yelp-48.png" alt="Yelp" width={16} height={16} style={{ objectFit: 'contain' }} />
                        </a>
                        <a href="https://www.google.com/maps/place/J%26R+NW+Construction/" target="_blank" rel="noreferrer" title="Google">
                            <GoogleIcon />
                        </a>
                    </div>
                    <div className={styles.mobileLang}>
                        <button
                            className={`${styles.langBtn} ${lang === 'en' || !lang ? styles.langBtnActive : ''}`}
                            onClick={() => chooseLang('en')}>EN</button>
                        <button
                            className={`${styles.langBtn} ${lang === 'es' ? styles.langBtnActive : ''}`}
                            onClick={() => chooseLang('es')}>ES</button>
                    </div>
                    <div className={styles.mobileThemeToggle}>
                        <CurtainToggle />
                    </div>
                </div>
                </div>
            </div>
            </header>

            {/* ── MAIN ── */}
            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className={styles.navLogoCircle}>
                                <Image src="/logo.png" alt="J&R NW Construction" width={40} height={40} />
                            </div>
                            <div className={styles.navBrandText}>
                                J&amp;R NW Construction
                                <span>{t.navSubtitle}</span>
                            </div>
                        </div>
                        <p>{t.companyDescShort || 'Family-owned and operated. Serving Oregon with integrity, craftsmanship, and 20+ years of experience.'}</p>
                        <div id="bbb-seal" style={{ marginTop: '10px' }} />
                        <div style={{ marginTop: '8px', fontSize: '11px' }}>
                            <a href="/warranty" style={{ color: '#C5A028', textDecoration: 'none', fontWeight: 600 }}>
                                ✓ Up to 5-Year Workmanship Warranty
                            </a>
                        </div>
                        <div className={styles.footerSocials}>
                            <a href="https://www.facebook.com/JRNWConstruction/" target="_blank" rel="noreferrer"
                                className={styles.footerSocialIcon} title="Facebook"><FacebookIcon /></a>
                            <a href="https://www.instagram.com/jandrnwconstruction/" target="_blank" rel="noreferrer"
                                className={styles.footerSocialIcon} title="Instagram"><InstagramIcon /></a>
                            <a href="https://m.yelp.com/biz/j-and-r-nw-construction-portland-5" target="_blank" rel="noreferrer"
    className={styles.navSocialIcon} title="Yelp">
    <img src="/icons8-yelp-48.png" alt="Yelp" width={16} height={16} style={{ objectFit: 'contain' }} />
</a>
                            <a href="https://www.google.com/maps/place/J%26R+NW+Construction/" target="_blank" rel="noreferrer"
                                className={styles.footerSocialIcon} title="Google"><GoogleIcon /></a>
                        </div>
                    </div>

                    <div className={styles.footerCol}>
                        <h4>{t.services}</h4>
                        <ul>
                            {SERVICE_LINKS.map((serviceLink) => (
                                <li key={serviceLink.href}>
                                    <Link href={serviceLink.href}>{t[serviceLink.labelKey]}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerCol}>
                        <h4>{t.home}</h4>
                        <ul>
                            <li><a href="/">{t.home}</a></li>
                            <li><a href="/services">{t.services}</a></li>
                            <li><a href="/projects">{t.projects}</a></li>
                            <li><Link href="/" style={{ color: 'inherit' }}>{t.navEstimate}</Link></li>
                            <li style={{ marginTop: '8px', fontSize: '11px', color: 'var(--gray)' }}>CCB: 232708</li>
                            <li style={{ marginTop: '16px', fontSize: '11px', color: 'var(--gray)', lineHeight: 1.6 }}>
                                J&amp;R NW Construction LLC<br />
                                17942 SE Division St<br />
                                Portland, OR 97236<br />
                                <a href="tel:+15039982340" style={{ color: 'var(--gray)' }}>(503) 998-2340</a>
                            </li>
                            <li style={{ marginTop: '12px', fontSize: '11px' }}><a href="/warranty" style={{ color: 'var(--gray)' }}>Warranty</a></li>
                            <li style={{ fontSize: '11px' }}><a href="/our-process" style={{ color: 'var(--gray)' }}>Our Process</a></li>
                            <li style={{ marginTop: '8px', fontSize: '11px' }}><a href="/terms-of-use" style={{ color: 'var(--gray)' }}>Terms of Use</a></li>
                            <li style={{ fontSize: '11px' }}><a href="/privacy-policy" style={{ color: 'var(--gray)' }}>Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <span className={styles.footerCopyright}>{t.copyright}</span>
                    <div className={styles.footerBadges}>
                        <div className={styles.footerBadge}><div className={styles.footerBadgeDot} /> {t.licensed}</div>
                        <div className={styles.footerBadge}><div className={styles.footerBadgeDot} /> {t.bonded}</div>
                        <div className={styles.footerBadge}><div className={styles.footerBadgeDot} /> {t.insured}</div>
                        <div className={styles.footerBadge}><div className={styles.footerBadgeDot} /> BBB</div>
                    </div>
                </div>
            </footer>

            {/* ── EMERGENCY BUTTON ── */}
            <div className={styles.emergencyWrap}>
                {showEmergency && (
                    <div className={styles.emergencyPanel}>
                        <p className={styles.emergencyTitle}>Emergency? We respond immediately.</p>
                        <a
                            href="tel:+15039982340"
                            className={styles.emergencyCall}
                            onClick={handleEmergency}
                        >
                            Call (503) 998-2340 Now
                        </a>
                        <p className={styles.emergencySub}>Tap to call · We answer 24/7 for emergencies</p>
                        <button className={styles.emergencyClose} onClick={() => setShowEmergency(false)}>✕ Close</button>
                    </div>
                )}
                <button
                    className={styles.emergencyBtn}
                    onClick={() => setShowEmergency(v => !v)}
                    aria-label="Emergency contact"
                >
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/></svg>
                    <span className={styles.emergencyDivider} />
                    EMERGENCY – 24/7
                </button>
            </div>
        </div>
        </ThemeProvider>
    );
}
