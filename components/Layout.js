import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Facebook, Instagram, Star, MapPin } from 'lucide-react';
import styles from './Layout.module.css';
import { useLang } from '../context/LanguageContext';
import { useEffect } from 'react';

export default function Layout({ children, title = 'J&R NW Construction', onContactClick }) {
    const { t, lang, chooseLang } = useLang();
    useEffect(() => {
        var bbb = [];
        bbb.push(['bbbid', 'greatwestpacific']);
        bbb.push(['bid', '1000117288']);
        bbb.push(['chk', 'A690EB6EA0']);
        bbb.push(['pos', 'inline']);
        bbb.push(['container', 'bbb-seal']);
        var scheme = document.location.protocol === 'https:' ? 'https://' : 'http://';
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = scheme + 'seal-alaskaoregonwesternwashington.bbb.org/badge/badge.min.js';
        document.head.appendChild(s);
    }, []);
    return (
        <div className={styles.container}>
            <Head>
                <title>{title}</title>
                <meta name="description" content="J&R NW Construction - Restoration and Construction Services" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header}>
                <div className={styles.topBar}>
                    <div className={styles.contactInfo}>
                        <span><Phone size={16} /> {t.callUs} <a href="tel:+15039982340" onClick={() => { if(typeof gtag_report_conversion !== "undefined") gtag_report_conversion("tel:+15039982340"); }}>(503) 998-2340</a></span>
                        <span><Mail size={16} /> <a href="mailto:jandrnwconstruction@gmail.com">jandrnwconstruction@gmail.com</a></span>
                        <button
                            className={styles.langToggle}
                            onClick={() => chooseLang(lang === 'es' ? 'en' : 'es')}
                            aria-label="Switch language"
                        >
                            {lang === 'es' ? '🇺🇸 EN' : '🇲🇽 ES'}
                        </button>
                    </div>
                </div>
                <div className={styles.navBar}>
                    <div className={styles.logo}>
                        <Image src="/logo.png" alt="J&R NW Construction Logo" width={50} height={50} />
                        <h1>J&R NW Construction</h1>
                    </div>
                    <nav>
                        <Link href="/">{t.home}</Link>
                        <Link href="/services">{t.services}</Link>
                        <Link href="/projects">{t.projects}</Link>
                        {onContactClick ? (
                            <button onClick={onContactClick} className={styles.navButton}>{t.getFreeEstimate}</button>
                        ) : (
                            <Link href="/">{t.getFreeEstimate}</Link>
                        )}
                        <div className={styles.navSocials}>
                            <a href="https://www.facebook.com/JRNWConstruction/" target="_blank" rel="noreferrer" title="Facebook" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="https://www.instagram.com/jandrnwconstruction/" target="_blank" rel="noreferrer" title="Instagram" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="https://m.yelp.com/biz/j-and-r-nw-construction-portland-5" target="_blank" rel="noreferrer" title="Yelp" aria-label="Yelp">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.2 14.4c-.12.48-.6.84-1.08.84-.12 0-.24 0-.36-.036l-2.52-.72c-.48-.132-.768-.636-.636-1.116.012-.048.024-.096.048-.144l.588-1.44c.18-.456.672-.684 1.128-.504l2.4.864c.468.168.708.684.54 1.152l-.108.3zm.18-4.44l-2.88-1.044c-.468-.168-.708-.684-.54-1.152l.756-2.1c.18-.456.672-.684 1.128-.504l2.88 1.044c.468.168.708.684.54 1.152l-.756 2.1c-.168.456-.66.672-1.128.504zm5.04 4.56c-.12.48-.6.852-1.092.852-.12 0-.24-.012-.348-.048l-2.52-.72c-.48-.132-.768-.636-.636-1.116l.108-.3c.18-.468.696-.696 1.164-.516l2.4.864c.468.168.696.696.516 1.164l-.108.3c-.012.024-.048.048-.084.12zm.84-4.44l-2.88-1.044c-.468-.168-.708-.684-.54-1.152l.756-2.1c.168-.468.684-.696 1.152-.528l2.88 1.044c.468.168.708.684.54 1.152l-.756 2.1c-.168.456-.672.684-1.152.528zm.6-5.748c-.312.396-.84.54-1.296.348l-2.64-.96c-.48-.168-.72-.696-.54-1.176l.456-1.272c.156-.432.576-.708 1.02-.684.108 0 .216.024.312.06l2.64.96c.468.168.72.696.54 1.176l-.18.504c-.072.192-.18.36-.312.996z" />
                                </svg>
                            </a>
                            <a href="https://share.google/ulkf5v91kfXkhgdPP" target="_blank" rel="noreferrer" title="Google Reviews" aria-label="Google Reviews">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </a>
                        </div>
                    </nav>
                </div>
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <div className={styles.footerLogo}>
                            <Image src="/logo.png" alt="J&R NW Construction Logo" width={40} height={40} />
                            <h3>J&R NW Construction</h3>
                        </div>
                        <p>{t.copyright}</p>
                    <div id="bbb-seal" style={{ marginTop: "10px" }}></div>
                    </div>
                    <div className={styles.footerSection}>
                        <h3><a href="tel:+15039982340" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{t.callUsNow}</a></h3>
                        <div className={styles.socials}>
                            <a href="tel:+15039982340" title="Call us"><Phone /></a>
                            <a href="mailto:jandrnwconstruction@gmail.com" title="Send us an email"><Mail /></a>
                            <a href="https://www.facebook.com/JRNWConstruction/" target="_blank" rel="noreferrer" title="Facebook"><Facebook /></a>
                            <a href="https://www.instagram.com/jandrnwconstruction/" target="_blank" rel="noreferrer" title="Instagram"><Instagram /></a>
                            <a href="https://m.yelp.com/biz/j-and-r-nw-construction-portland-5" target="_blank" rel="noreferrer" title="Yelp"><Star /></a>
                            <a href="https://www.google.com/maps/place/J%26R+NW+Construction/data=!4m2!3m1!1s0x0:0x5ea1161c5e563902?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noreferrer" title="Google Maps"><MapPin /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
