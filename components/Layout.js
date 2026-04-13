import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import styles from './Layout.module.css';

// SVG icons inline (no emoji, no extra packages)
const PhoneIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a1 1 0 000-1z" />
    </svg>
);

const MailIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

export default function Layout({ children, title = 'J&R NW Construction', onContactClick }) {
    const { t, lang, chooseLang } = useLang();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={styles.container}>
            <Head>
                <title>{title}</title>
                <meta name="description" content="J&R NW Construction - Restoration and Construction Services" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* ── TOPBAR ── */}
            <div className={styles.topbar}>
                <div className={styles.topbarItem}>
                    <PhoneIcon />
                    <a href="tel:+15039982340"
                        onClick={() => { if (typeof gtag_report_conversion !== 'undefined') gtag_report_conversion('tel:+15039982340'); }}>
                        (503) 998-2340
                    </a>
                </div>
                <div className={styles.topbarDivider} />
                <div className={styles.topbarItem}>
                    <MailIcon />
                    <a href="mailto:jandrnwconstruction@gmail.com">jandrnwconstruction@gmail.com</a>
                </div>
                <div className={styles.topbarDivider} />
                <div className={styles.topbarItem}>{t.navAvailability}</div>
            </div>

            {/* ── NAVBAR ── */}
            <nav className={styles.nav}>
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
                </div>

               {/* Hamburger (mobile) */}
<button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}
    aria-label={t.menuLabel}>
    <span />
    <span />
    <span />
    <span className={styles.hamburgerLabel}>MENU</span>
</button>
            </nav>

            {/* ── MOBILE MENU ── */}
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
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
                </div>
            </div>

            {/* ── MAIN ── */}
            <main className={styles.main}>{children}</main>

            {/* ── FOOTER ── */}
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
                            <li><a href="/services">{t.pt1}</a></li>
                            <li><a href="/services">{t.pt2}</a></li>
                            <li><a href="/services">{t.pt3}</a></li>
                            <li><a href="/services">{t.pt6}</a></li>
                            <li><a href="/services">{t.pt5}</a></li>
                            <li><a href="/services">{t.pt7}</a></li>
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
        </div>
    );
}
