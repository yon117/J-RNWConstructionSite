import { useState } from 'react';
import styles from '../styles/Home.module.css';

const SERVICE_OPTIONS = [
    'Interior Construction & Remodeling',
    'Restoration & Reconstruction',
    'Mitigation & Emergency Services',
    'General Repairs & Carpentry',
    'Paint',
    'Siding',
    'Drywall',
    'Other'
];

export default function ContactFormSection() {
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
            setEmailError('Please enter a valid email');
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
            setPhoneError('Only numbers allowed');
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(contactForm.email)) {
            setEmailError('Please enter a valid email');
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
            serviceType: contactForm.serviceType === 'Other' ? contactForm.otherService : contactForm.serviceType
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success'); if (typeof window !== 'undefined' && window.gtag) { window.gtag('event', 'conversion', { 'send_to': 'AW-17362940957/co0XCP6H_pAcEJ3opddA' }); }
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
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Get in Touch</h2>
                <div className={styles.contactContainer}>
                    <div className={styles.contactInfo}>
                        <h3>Always Ready When You Are</h3>
                        <p>From Repairs to Full Construction Solutions</p>
                        <p>Get a FREE estimate today. We handle interior and exterior construction projects, expert repairs, and preventative solutions—built to last and done right the first time.</p>
                    </div>

                    {/* Contact Form */}
                    <form className={styles.contactForm} onSubmit={handleContactSubmit}>
                        <div style={{ width: '100%' }}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={contactForm.fullName}
                                onChange={e => setContactForm({ ...contactForm, fullName: e.target.value })}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <input
                                type="email"
                                placeholder="Email"
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
                                placeholder="Phone Number"
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
                                <option value="" disabled>Select Service Type</option>
                                {SERVICE_OPTIONS.map(service => (
                                    <option key={service} value={service} style={{ color: '#000' }}>{service}</option>
                                ))}
                            </select>
                        </div>

                        {/* Other Service Text Field */}
                        {contactForm.serviceType === 'Other' && (
                            <div style={{ width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder="Please specify the service you need"
                                    required
                                    value={contactForm.otherService}
                                    onChange={e => setContactForm({ ...contactForm, otherService: e.target.value })}
                                />
                            </div>
                        )}

                        <textarea
                            placeholder="Message"
                            rows={5}
                            required
                            value={contactForm.message}
                            onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        ></textarea>

                        <button type="submit" className="btn btn-accent" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending...' : 'Submit'}
                        </button>
                        {status === 'success' && <p className={styles.success}>Message sent successfully!</p>}
                        {status === 'error' && <p className={styles.error}>Error sending message.</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
