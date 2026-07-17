import Layout from '../components/Layout';

const EFFECTIVE_DATE = 'July 16, 2026';

const s = {
  wrap: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '80px 24px 100px',
    color: 'var(--text)',
    lineHeight: 1.7,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    borderLeft: '2px solid var(--gold)',
    paddingLeft: 10,
    marginBottom: 20,
  },
  h1: {
    fontSize: 'clamp(28px, 4vw, 42px)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: 'var(--gray)',
    marginBottom: 52,
  },
  h2: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginTop: 44,
    marginBottom: 12,
    color: 'var(--text)',
  },
  h3: {
    fontSize: 14,
    fontWeight: 700,
    marginTop: 24,
    marginBottom: 8,
    color: 'var(--text)',
  },
  p: {
    fontSize: 15,
    marginBottom: 16,
    color: 'var(--gray)',
  },
  ul: {
    paddingLeft: 20,
    marginBottom: 16,
    color: 'var(--gray)',
    fontSize: 15,
  },
  li: {
    marginBottom: 8,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    margin: '48px 0 0',
  },
  contact: {
    marginTop: 32,
    fontSize: 14,
    color: 'var(--gray)',
  },
  address: {
    marginTop: 16,
    fontSize: 14,
    color: 'var(--gray)',
    lineHeight: 1.7,
    fontStyle: 'normal',
  },
};

export default function PrivacyPolicy() {
  return (
    <Layout
      title="Privacy Policy | J&R NW Construction"
      description="Privacy policy for J&R NW Construction LLC — how we collect, use, and share information submitted through jandrnw.com."
      canonical="/privacy-policy"
    >
      <div style={s.wrap}>
        <div style={s.eyebrow}>Legal</div>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.meta}>Effective Date: {EFFECTIVE_DATE}</p>

        <p style={s.p}>
          This Privacy Policy describes how J&amp;R NW Construction LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares information
          when you visit our website at jandrnw.com (the &ldquo;Site&rdquo;) or contact us for our services.
        </p>

        <h2 style={s.h2}>1. Information We Collect</h2>

        <h3 style={s.h3}>Information You Provide Directly</h3>
        <p style={s.p}>
          When you fill out our contact or free estimate form, call us, or otherwise communicate with us, we may collect:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>Name</li>
          <li style={s.li}>Phone number</li>
          <li style={s.li}>Email address</li>
          <li style={s.li}>Physical address or project location</li>
          <li style={s.li}>Details about your project or service request</li>
        </ul>

        <h3 style={s.h3}>Information Collected Automatically</h3>
        <p style={s.p}>
          When you visit the Site, we and our third-party service providers automatically collect certain information through
          cookies and similar technologies, including:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>IP address and approximate location</li>
          <li style={s.li}>Browser type and device information</li>
          <li style={s.li}>Pages visited, time spent on pages, and referring website</li>
          <li style={s.li}>Interactions with the Site (clicks, form submissions, phone number clicks)</li>
        </ul>

        <h2 style={s.h2}>2. How We Use Your Information</h2>
        <p style={s.p}>We use the information we collect to:</p>
        <ul style={s.ul}>
          <li style={s.li}>Respond to your inquiries and provide free estimates</li>
          <li style={s.li}>Schedule and perform construction and remodeling services</li>
          <li style={s.li}>Communicate with you about your project</li>
          <li style={s.li}>Improve our website and services</li>
          <li style={s.li}>Measure the effectiveness of our advertising</li>
          <li style={s.li}>
            Contact you about future services, promotions, or company updates, including newsletters
            (you may opt out of marketing communications at any time)
          </li>
          <li style={s.li}>Maintain records of past clients for reference and follow-up purposes</li>
          <li style={s.li}>Comply with legal obligations</li>
        </ul>

        <h2 style={s.h2}>3. Analytics and Advertising</h2>
        <p style={s.p}>
          We use the following third-party services, which may collect information through cookies and similar technologies:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Google Analytics (GA4):</strong> Helps us understand how visitors use
            the Site. Learn more at{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
              policies.google.com/privacy
            </a>
            . You can opt out at{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
              tools.google.com/dlpage/gaoptout
            </a>
            .
          </li>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Google Ads and Google Tag Manager:</strong> We use conversion tracking
            to measure the effectiveness of our advertising. Google may use cookies to show you ads based on your visit to
            our Site.
          </li>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Meta (Facebook/Instagram) Pixel:</strong> We may use the Meta Pixel to
            measure advertising effectiveness and show you relevant ads on Meta platforms. Learn more at{' '}
            <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
              facebook.com/privacy/policy
            </a>
            . You can adjust your ad preferences in your Facebook settings.
          </li>
        </ul>
        <p style={s.p}>
          These providers may combine information collected on our Site with other information they have collected
          independently. We do not sell your personal information.
        </p>

        <h2 style={s.h2}>4. How We Share Information</h2>
        <p style={s.p}>We do not sell or rent your personal information. We may share information with:</p>
        <ul style={s.ul}>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Service providers</strong> who help us operate our business
            (analytics, advertising, website hosting, scheduling tools), under obligations to protect your information
          </li>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Legal authorities</strong> when required by law, subpoena, or to
            protect our rights
          </li>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Business transfers</strong> in connection with a merger, sale, or
            transfer of business assets
          </li>
        </ul>

        <h2 style={s.h2}>5. Cookies</h2>
        <p style={s.p}>
          You can control cookies through your browser settings. Disabling cookies may affect some Site functionality. Most
          browsers allow you to refuse or delete cookies; consult your browser&apos;s help documentation.
        </p>

        <h2 style={s.h2}>6. Marketing Communications</h2>
        <p style={s.p}>
          If we send you marketing emails or newsletters, each message will include an option to unsubscribe. You may also
          opt out at any time by contacting us using the information below. Opting out of marketing does not affect
          communications related to an active project or service request.
        </p>

        <h2 style={s.h2}>7. Data Retention</h2>
        <p style={s.p}>
          We retain the information you submit through our forms for as long as needed to respond to your inquiry, provide
          services, and meet legal, accounting, or insurance requirements.
        </p>

        <h2 style={s.h2}>8. Your Privacy Rights</h2>
        <p style={s.p}>
          Depending on your state of residence, you may have rights regarding your personal information, including the right
          to access, correct, or delete personal data we hold about you, and the right to opt out of targeted advertising.
        </p>
        <p style={s.p}>
          <strong style={{ color: 'var(--text)' }}>Oregon residents:</strong> Under the Oregon Consumer Privacy Act (OCPA),
          Oregon consumers may have the right to confirm whether we process their personal data, access it, correct
          inaccuracies, request deletion, obtain a copy, and opt out of targeted advertising. To exercise any of these
          rights, contact us using the information below. We will respond within the time required by applicable law.
        </p>

        <h2 style={s.h2}>9. Children&apos;s Privacy</h2>
        <p style={s.p}>
          Our Site and services are not directed to children under 16, and we do not knowingly collect personal information
          from children.
        </p>

        <h2 style={s.h2}>10. Security</h2>
        <p style={s.p}>
          We take reasonable measures to protect your information. However, no method of transmission over the internet is
          completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 style={s.h2}>11. Third-Party Links</h2>
        <p style={s.p}>
          The Site may contain links to third-party websites (such as Yelp, Google, or Facebook). We are not responsible
          for the privacy practices of those websites.
        </p>

        <h2 style={s.h2}>12. Changes to This Policy</h2>
        <p style={s.p}>
          We may update this Privacy Policy from time to time. The updated version will be posted on this page with a
          revised effective date.
        </p>

        <h2 style={s.h2}>13. Contact Us</h2>
        <p style={s.p}>If you have questions about this Privacy Policy or want to exercise your privacy rights, contact us:</p>

        <address style={s.address}>
          J&amp;R NW Construction LLC<br />
          17942 SE Division St, Portland, OR 97236<br />
          Phone:{' '}
          <a href="tel:+15039982340" style={{ color: 'var(--gold)' }}>
            (503) 998-2340
          </a>
          <br />
          Email:{' '}
          <a href="mailto:julioramirez@jandrnw.com" style={{ color: 'var(--gold)' }}>
            julioramirez@jandrnw.com
          </a>
        </address>

        <hr style={s.divider} />
      </div>
    </Layout>
  );
}
