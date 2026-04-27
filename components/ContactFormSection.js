import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import styles from '../styles/Home.module.css';

const SERVICE_OPTION_KEYS = [
    'pt1',
    'pt2',
    'pt3',
    'pt4',
    'pt5',
    'pt6',
    'pt7',
    'pt8'
];

export default function ContactFormSection() {
    const { t } = useLang();
    const [contactForm, setContactForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        serviceType: '',
        otherService: ''
    });
    const [status, setStatus] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9\s\-\(\)]+$/;
        return phone === '' || phoneRegex.test(phone);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setContactForm({ ...contactForm, email });
        if (email && !validateEmail(email)) {
            setEmailError(t.validEmailError);
        } else {
            setEmailError('');
        }
    };

    const handlePhoneChange = (e) => {
        const phone = e.target.value;
        if (validatePhone(phone)) {
            setContactForm({ ...contactForm, phone });
            setPhoneError('');
        } else {
            setPhoneError(t.onlyNumbersError);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(contactForm.email)) {
            setEmailError(t.validEmailError);
            return;
        }

        setStatus('sending');
        setEmailError('');
        setPhoneError('');

        const formData = {
            firstName: contactForm.fullName,
            lastName: '',
            email: contactForm.email,
            phone: contactForm.phone,
            message: contactForm.message,
            budget: '',
            serviceType: contactForm.serviceType === 'pt8'
                ? contactForm.otherService
                : t[contactForm.serviceType]
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'conversion', {
                        send_to: 'AW-17362940957/it5lCL_Ei6IcEJ3opddA'
                    });
                }
                setContactForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    message: '',
                    serviceType: '',
                    otherService: ''
                });
            } else {
                console.error('Error response:', data);
                setStatus('error');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setStatus('error');
        }
    };

    return (
        <div className={styles.contactSection}>
            <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>{t.getInTouchTitle}</h2>
                <div className={styles.contactContainer}>
                    <div className={styles.contactInfo}>
                        <h3>{t.alwaysReady}</h3>
                        <p>{t.fromRepairs}</p>
                        <p>{t.getFreeEstimateDesc}</p>
                    </div>

                    {/* Contact Form */}
                    <form className={styles.contactForm} onSubmit={handleContactSubmit}>
                        <div style={{ width: '100%' }}>
                            <input
                                type="text"
                                placeholder={t.fullName}
                                required
                                value={contactForm.fullName}
                                onChange={e => setContactForm({ ...contactForm, fullName: e.target.value })}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <input
                                type="email"
                                placeholder={t.emailAddress}
                                required
                                value={contactForm.email}
                                onChange={handleEmailChange}
                                style={{ borderColor: emailError ? '#ff4444' : '', width: '100%' }}
                            />
                            {emailError && <p className={styles.validationError}>{emailError}</p>}
                        </div>
                        <div style={{ width: '100%' }}>
                            <input
                                type="tel"
                                placeholder={t.phoneNumber}
                                value={contactForm.phone}
                                onChange={handlePhoneChange}
                                style={{ borderColor: phoneError ? '#ff4444' : '', width: '100%' }}
                            />
                            {phoneError && <p className={styles.validationError}>{phoneError}</p>}
                        </div>

                        {/* Service Type Dropdown */}
                        <div style={{ width: '100%' }}>
                            <select
                                value={contactForm.serviceType}
                                onChange={e => setContactForm({ ...contactForm, serviceType: e.target.value, otherService: '' })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #555',
                                    borderRadius: '5px',
                                    fontFamily: 'inherit',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: contactForm.serviceType ? 'var(--text-light)' : 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="" disabled>{t.selectServiceType}</option>
                                {SERVICE_OPTION_KEYS.map(key => (
                                    <option key={key} value={key} style={{ color: '#000' }}>{t[key]}</option>
                                ))}
                            </select>
                        </div>

                        {/* Other Service Text Field */}
                        {contactForm.serviceType === 'pt8' && (
                            <div style={{ width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder={t.specifyService}
                                    required
                                    value={contactForm.otherService}
                                    onChange={e => setContactForm({ ...contactForm, otherService: e.target.value })}
                                />
                            </div>
                        )}

                        <textarea
                            placeholder={t.message}
                            rows={5}
                            required
                            value={contactForm.message}
                            onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        ></textarea>

                        <button type="submit" className="btn btn-accent" disabled={status === 'sending'}>
                            {status === 'sending' ? t.sending : t.submit}
                        </button>
                        {status === 'success' && <p className={styles.formSuccess}>{t.successMsg}</p>}
                        {status === 'error' && <p className={styles.formError}>{t.errorMsg}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
