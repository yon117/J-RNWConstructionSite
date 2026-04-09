
import Image from 'next/image';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ContactFormSection from '../components/ContactFormSection';
import Reviews from '../components/Reviews';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

export default function Home() {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showFloatingBtn, setShowFloatingBtn] = useState(false);
    const { t } = useLang();

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingBtn(window.scrollY > window.innerHeight * 0.85);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Layout onContactClick={() => setShowContactModal(true)}>
            <div className={styles.heroNew}>
                <div className={styles.heroNewOverlay}>
                    {/* Left: Text Content */}
                    <div className={styles.heroNewLeft}>
                        <h1 className={styles.heroNewH1}>
                            {t.yourTrusted}<br />
                            <span className={styles.heroNewAccent}>{t.generalContractor}</span><br />
                            {t.inOregon}
                        </h1>
                        <p className={styles.heroNewBadge}>
                            {t.licensed}
                            <span className={styles.heroBullet}> • </span>
                            {t.bonded}
                            <span className={styles.heroBullet}> • </span>
                            {t.insured}
                        </p>
                        <ul className={styles.heroNewChecklist}>
                            <li><span className={styles.heroCheck}>✓</span> {t.heroItem1}</li>
                            <li><span className={styles.heroCheck}>✓</span> <span className={styles.heroServicesText}>{t.heroItem2}</span></li>
                            <li><span className={styles.heroCheck}>✓</span> <span className={styles.heroServicesText}>{t.heroItem3}</span></li>
                        </ul>
<button onClick={() => {
    setShowContactModal(true);
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_click', {
            event_category: 'contact',
            event_label: 'hero_cta'
        });
    }
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Contact');
    }
}} className={styles.heroNewCta}>                            {t.getFreeEstimate}
                        </button>
                        <div className={styles.heroSocialRow}>
                            <span className={styles.heroSocialLabel}>{t.lookUsUp}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <a href="https://www.yelp.com/biz/nbdWs1DKtDOp1o7E6IdG-w" target="_blank" rel="noopener noreferrer" className={styles.heroSocialLink}>
                                    <img src="/yelp-logo.png" alt="Yelp" className={styles.heroYelpLogo} />
                                </a>
                                <a href="https://www.google.com/search?q=J%26R+NW+Construction" target="_blank" rel="noopener noreferrer" className={styles.heroSocialLink}>
                                    <img src="/google-logo.png" alt="Google" className={styles.heroGoogleLogo} />
                                </a>
                                <span className={styles.heroStars}>★★★★★</span>
                            </div>
                        </div>
                        <p className={styles.heroNewSubtext}>{t.fullyLicensed}</p>
                        <p className={styles.heroCcb}>CCB: 232708</p>
                        <div id="bbb-seal" style={{ marginTop: "10px", display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}></div>
                    </div>

                    {/* Center: Logo */}
                    <div className={styles.heroNewLogoCenter}>
                        <Image src="/logo.png" alt="J&R NW Construction Logo" width={460} height={460} style={{ borderRadius: '50%' }} />
                    </div>

                    {/* Right: Quote Form */}
                    <div className={styles.heroNewForm}>
                        <h2 className={styles.heroFormTitle}>
                            {t.requestFreeQuote} <span className={styles.heroFormAccent}>{t.freeQuote}</span>
                        </h2>
                        <HeroQuoteForm />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className={styles.originalHero}>
                <div className={styles.originalHeroContent}>
                    <div className={styles.originalHeroTitle}>
                        <Image src="/logo.png" alt="J&R NW Construction Logo" width={220} height={220} />
                        <h1>J&amp;R NW Construction</h1>
                    </div>
                    <h2>{t.weWorkForYou}</h2>
                    <p>{t.companyDesc}</p>
                </div>
            </div>

            <Reviews />

            {showFloatingBtn && (
                <button
                    className={styles.floatingContactBtn}
onClick={() => {
    setShowContactModal(true);
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_click', {
            event_category: 'contact',
            event_label: 'floating_button'
        });
    }
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Contact');
    }
}}                    aria-label={t.getEstimate}
                >
                    <span className={styles.floatingBtnIcon}>💬</span>
                    <span className={styles.floatingBtnText}>{t.getEstimate}</span>
                </button>
            )}

            {showContactModal && (
                <Modal title={t.getInTouch} onClose={() => setShowContactModal(false)}>
                    <ContactFormSection />
                </Modal>
            )}
        </Layout>
    );
}

function HeroQuoteForm() {
    const { t } = useLang();
    const [form, setForm] = useState({ fullName: '', phone: '', email: '', projectType: '', message: '' });
    const [status, setStatus] = useState('');

    const PROJECT_TYPES = [
        { key: 'pt1', en: 'Interior Construction & Remodeling' },
        { key: 'pt2', en: 'Restoration & Reconstruction' },
        { key: 'pt3', en: 'Mitigation & Emergency Services' },
        { key: 'pt4', en: 'General Repairs & Carpentry' },
        { key: 'pt5', en: 'Paint' },
        { key: 'pt6', en: 'Siding' },
        { key: 'pt7', en: 'Drywall' },
        { key: 'pt8', en: 'Other' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
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
    setStatus('success');
    setForm({ fullName: '', phone: '', email: '', projectType: '', message: '' });
    // GA4
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', { send_to: 'AW-17362940957/co0XCP6H_pAcEJ3opddA' });
        window.gtag('event', 'generate_lead', {
            event_category: 'contact',
            event_label: 'hero_form'
        });
    }
    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead');
    }
}
            else setStatus('error');
        } catch { setStatus('error'); }
    };

    return (
        <form className={styles.heroFormBody} onSubmit={handleSubmit}>
            <div className={styles.heroFormField}>
                <span className={styles.heroFormIcon}>👤</span>
                <input type="text" placeholder={t.fullName} required value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })} className={styles.heroFormInput} />
            </div>
         <div className={styles.heroFormField}>
                <span className={styles.heroFormIcon}>📞</span>
                <input type="tel" placeholder={t.phoneNumber} value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} className={styles.heroFormInput} />
            </div>
            <div className={styles.heroFormField}>
                <span className={styles.heroFormIcon}>✉️</span>
                <input type="email" placeholder={t.emailAddress} required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} className={styles.heroFormInput} />
            </div>
            <div className={styles.heroFormField}>
                <span className={styles.heroFormIcon}>🗂️</span>
                <select value={form.projectType} onChange={e => setForm({ ...form, projectType: e.target.value })}
                    required className={styles.heroFormSelect}>
                    <option value="" disabled>{t.projectType}</option>
                    {PROJECT_TYPES.map(pt => (
                        <option key={pt.key} value={pt.en}>{t[pt.key]}</option>
                    ))}
                </select>
                <span className={styles.heroFormDropIcon}>▾</span>
            </div>
            <textarea placeholder={t.projectDescription} rows={3} value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })} className={styles.heroFormTextarea} />
            <button type="submit" className={styles.heroFormBtn} disabled={status === 'sending'}>
                {status === 'sending' ? t.sending : t.getFreeEstimateBtn}
            </button>
            <p className={styles.heroFormNote}>{t.fastResponse}</p>
            {status === 'success' && <p style={{ color: '#4caf50', textAlign: 'center', fontSize: '0.9rem' }}>{t.successMsg}</p>}
            {status === 'error' && <p style={{ color: '#f44336', textAlign: 'center', fontSize: '0.9rem' }}>{t.errorMsg}</p>}
        </form>
    );
}
