import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from './Layout';
import Modal from './Modal';
import styles from '../styles/CityLandingPage.module.css';
import homeStyles from '../styles/Home.module.css';

/* ── ICONS ── */
const CheckIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
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
const ChevronIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);
const PhoneIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5a2 2 0 012-2z" />
    </svg>
);
const ArrowIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);
const YelpLogoIcon = () => (
    <Image src="/yelp-logo.png" alt="Yelp" width={130} height={40} style={{ objectFit: 'contain' }} />
);
const GoogleLogoIcon = () => (
    <Image src="/google-logo.png" alt="Google" width={130} height={130} style={{ objectFit: 'contain' }} />
);

const PROJECT_TYPES = [
    'Interior Construction & Remodeling',
    'Bathroom Remodel',
    'Restoration & Reconstruction',
    'Mitigation & Emergency Services',
    'General Repairs & Carpentry',
    'Paint',
    'Siding',
    'Drywall',
    'Other',
];

/* ── CONTACT FORM ── */
function ContactForm() {
    const [form, setForm] = useState({ fullName: '', phone: '', email: '', projectType: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [emailError, setEmailError] = useState('');

    const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === 'email') setEmailError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(form.email)) { setEmailError('Please enter a valid email address.'); return; }
        setStatus('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: form.fullName, lastName: '',
                    email: form.email, phone: form.phone,
                    message: form.message, serviceType: form.projectType, budget: '',
                }),
            });
            if (res.ok) {
                // Also send to n8n webhook
                fetch('https://n8n.jandrnw.com/webhook/formulario-contacto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: form.fullName,
                        email: form.email,
                        telefono: form.phone,
                        tipo_proyecto: form.projectType,
                        mensaje: form.message,
                        fuente: 'city-landing-page',
                    }),
                }).catch(() => {});
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'form_submit', { event_category: 'contact', event_label: 'city_landing' });
                }
                if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('track', 'Lead');
                }
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className={homeStyles.contactForm} style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#4caf50', fontWeight: 700 }}>✅ Message sent! We'll be in touch soon.</p>
            </div>
        );
    }

    return (
        <div className={homeStyles.contactForm}>
            <div className={homeStyles.formTitle}>Request a Free Quote</div>
            <form onSubmit={handleSubmit}>
                <div className={homeStyles.formRow}>
                    <div className={homeStyles.formGroup}>
                        <label>Full Name</label>
                        <input name="fullName" type="text" placeholder="John Smith"
                            value={form.fullName} onChange={handleChange} required />
                    </div>
                    <div className={homeStyles.formGroup}>
                        <label>Phone Number</label>
                        <input name="phone" type="tel" placeholder="(503) 000-0000"
                            value={form.phone} onChange={handleChange} />
                    </div>
                </div>
                <div className={homeStyles.formGroup}>
                    <label>Email Address</label>
                    <input name="email" type="email" placeholder="john@email.com"
                        value={form.email} onChange={handleChange} required />
                    {emailError && <p className={homeStyles.validationError}>{emailError}</p>}
                </div>
                <div className={homeStyles.formGroup}>
                    <label>Project Type</label>
                    <select name="projectType" value={form.projectType} onChange={handleChange} required>
                        <option value="" disabled>Select Service Type</option>
                        {PROJECT_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                    </select>
                </div>
                <div className={homeStyles.formGroup}>
                    <label>Message</label>
                    <textarea name="message" placeholder="Provide a brief description of your project..."
                        value={form.message} onChange={handleChange} />
                </div>
                <button type="submit" className={homeStyles.formSubmit} disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : 'Get Free Estimate →'}
                </button>
                <div className={homeStyles.formNote}>
                    <CheckIcon /> Fast Response · No Obligation
                </div>
                {status === 'error' && <p className={homeStyles.formError}>Error sending. Please try again.</p>}
            </form>
        </div>
    );
}

/* ── MAIN COMPONENT ── */
export default function CityLandingPage({ data }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const {
        title, description, canonical,
        h1, h1Em, subtitle, mapSrc,
        whyTitle, whyPoints,
        neighborhoods, services, faqs,
        schema,
    } = data;

    const toggleFaq = (i) => setOpenFaq(prev => (prev === i ? null : i));

    return (
        <Layout
            title={title}
            description={description}
            canonical={canonical}
            onContactClick={() => setModalOpen(true)}
        >
            <Head>
                {schema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    />
                )}
            </Head>

            <div className={styles.page}>

                {/* ── HERO — exact homepage structure ── */}
                <section className={homeStyles.hero}>
                    <div className={homeStyles.heroBg} />
                    <div className={homeStyles.heroAccentLine} />
                    <div className={homeStyles.heroInner}>
                        <div className={homeStyles.heroContent}>
                            <div className={homeStyles.heroBadge}>
                                <div className={homeStyles.heroBadgeDot} />
                                Build Better, Restore Stronger
                            </div>
                            <h1 className={homeStyles.heroH1}>
                                {h1}
                                <em>{h1Em}</em>
                            </h1>
                            <p className={homeStyles.heroDesc}>{subtitle}</p>
                            <div className={homeStyles.heroActions}>
                                <button className={homeStyles.btnPrimary} onClick={() => setModalOpen(true)}>
                                    Get Free Estimate <ArrowIcon />
                                </button>
                                <a href="tel:+15039982340" className={homeStyles.btnSecondary}>
                                    <PhoneIcon /> (503) 998-2340
                                </a>
                            </div>
                            <div className={homeStyles.heroReviewBlock}>
                                <div className={homeStyles.heroReviewRow}>
                                    <span className={homeStyles.heroReviewLabel}>Look us up on</span>
                                    <div className={homeStyles.heroReviewItems}>
                                        <span className={homeStyles.heroReviewIcon}><YelpLogoIcon /></span>
                                        <span className={homeStyles.heroReviewIcon}><GoogleLogoIcon /></span>
                                        <span className={homeStyles.heroReviewStars}>★★★★★</span>
                                    </div>
                                </div>
                                <div className={homeStyles.heroReviewGuarantee}>100% Satisfaction Guarantee</div>
                                <div className={homeStyles.heroReviewCcb}>CCB: 232708</div>
                            </div>
                            <div className={homeStyles.heroTrust}>
                                <div className={homeStyles.trustItem}>
                                    <ShieldIcon /> Licensed, Insured &amp; Bonded
                                </div>
                                <span className={homeStyles.trustSep}>·</span>
                                <div className={homeStyles.trustItem}>
                                    <StarIcon /> BBB Accredited
                                </div>
                                <span className={homeStyles.trustSep}>·</span>
                                <div className={homeStyles.trustItem}>
                                    <CheckIcon /> 100% Satisfaction Guarantee
                                </div>
                            </div>
                        </div>
                        <div className={homeStyles.heroFormPanel}>
                            <ContactForm />
                        </div>
                    </div>
                    <div className={homeStyles.heroStats}>
                        <div className={homeStyles.statBox}>
                            <div className={homeStyles.statNum}>20+</div>
                            <div className={homeStyles.statLabel}>Years Exp.</div>
                        </div>
                        <div className={homeStyles.statBox}>
                            <div className={homeStyles.statNum}>50+</div>
                            <div className={homeStyles.statLabel}>Families Served</div>
                        </div>
                        <div className={homeStyles.statBox}>
                            <div className={homeStyles.statNum}>★ 5.0</div>
                            <div className={homeStyles.statLabel}>Rating</div>
                        </div>
                    </div>
                </section>


                {/* ── SERVICES ── */}
                <section className={styles.servicesSection}>
                    <span className={styles.sectionLabel}>What We Do</span>
                    <h2 className={styles.sectionTitle}>Services We Offer</h2>
                    <div className={styles.servicesGrid}>
                        {services.map((s) => (
                            <div key={s.num} className={styles.serviceCard}>
                                <span className={styles.serviceNum}>{s.num}</span>
                                <span className={styles.serviceCat}>{s.cat}</span>
                                <h3 className={styles.serviceName}>{s.name}</h3>
                                <p className={styles.serviceDesc}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── WHY US LOCAL ── */}
                <section className={styles.localSection}>
                    <div className={styles.localInner}>
                        <div className={styles.localContent}>
                            <span className={styles.sectionLabel}>Why J&amp;R NW</span>
                            <h2 className={styles.localTitle}>{whyTitle}</h2>
                            <ul className={styles.localPoints}>
                                {whyPoints.map((pt, i) => (
                                    <li key={i} className={styles.localPoint}>
                                        <span className={styles.localPointIcon}><CheckIcon /></span>
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.localMap}>
                            <iframe
                                src={mapSrc}
                                title="Service Area Map"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </section>

                {/* ── NEIGHBORHOODS ── */}
                <section className={styles.neighborhoodsSection}>
                    <div className={styles.neighborhoodsInner}>
                        <span className={styles.sectionLabel}>Coverage Area</span>
                        <h2 className={styles.sectionTitle}>Neighborhoods We Serve</h2>
                        <div className={styles.chipsGrid}>
                            {neighborhoods.map((n) => (
                                <span key={n} className={styles.chip}>{n}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className={styles.faqSection}>
                    <div className={styles.faqInner}>
                        <span className={styles.sectionLabel}>Common Questions</span>
                        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                        <div className={styles.faqList}>
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`${styles.faqAccordion} ${openFaq === i ? styles.faqOpen : ''}`}
                                >
                                    <button
                                        className={styles.faqTrigger}
                                        onClick={() => toggleFaq(i)}
                                        aria-expanded={openFaq === i}
                                    >
                                        <span className={styles.faqChip}>{faq.cat}</span>
                                        <span className={styles.faqQ}>{faq.q}</span>
                                        <span className={styles.faqChevron}><ChevronIcon /></span>
                                    </button>
                                    <div className={styles.faqAnswer}>
                                        <p className={styles.faqAnswerText}>{faq.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── BOTTOM CTA ── */}
                <section className={styles.ctaSection}>
                    <div className={styles.ctaInner}>
                        <h2 className={styles.ctaTitle}>
                            Ready to Get Started?<br />
                            <span className={styles.ctaTitleEm}>Free Estimates. No Pressure.</span>
                        </h2>
                        <p className={styles.ctaSub}>Family-owned, locally operated. We show up, do the work, and stand behind it.</p>
                        <div className={styles.ctaActions}>
                            <button className={styles.btnPrimary} onClick={() => setModalOpen(true)}>
                                Request Free Estimate <ArrowIcon />
                            </button>
                            <a href="tel:+15039982340" className={styles.ctaPhone}>
                                <PhoneIcon /> (503) 998-2340
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            {/* ── MODAL ── */}
            {modalOpen && (
                <Modal title="Request a Free Estimate" onClose={() => setModalOpen(false)}>
                    <ContactForm />
                </Modal>
            )}
        </Layout>
    );
}
