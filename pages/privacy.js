import Layout from '../components/Layout';

const LAST_UPDATED = 'July 15, 2026';

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
};

export default function Privacy() {
  return (
    <Layout
      title="Privacy Policy | J&R NW Construction"
      description="Privacy policy for J&R NW Construction — how we collect and use information submitted through our website."
    >
      <div style={s.wrap}>
        <div style={s.eyebrow}>Legal</div>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.meta}>Last updated: {LAST_UPDATED}</p>

        <p style={s.p}>
          J&amp;R NW Construction (&quot;we&quot;, &quot;us&quot;) respects your privacy. This
          policy explains what information we collect through jandrnw.com, how we use it, and
          your rights regarding it.
        </p>

        <h2 style={s.h2}>1. Information We Collect</h2>
        <p style={s.p}>When you submit a contact or estimate request form, we collect:</p>
        <ul style={s.ul}>
          <li style={s.li}>Name</li>
          <li style={s.li}>Email address</li>
          <li style={s.li}>Phone number</li>
          <li style={s.li}>Project description and address (if provided)</li>
        </ul>
        <p style={s.p}>
          We do not collect payment information through this website. No credit card or banking
          data is stored here.
        </p>

        <h2 style={s.h2}>2. How We Use Your Information</h2>
        <p style={s.p}>Information submitted through our forms is used solely to:</p>
        <ul style={s.ul}>
          <li style={s.li}>Respond to your inquiry or estimate request</li>
          <li style={s.li}>Schedule consultations or site visits</li>
          <li style={s.li}>Follow up on active projects</li>
        </ul>
        <p style={s.p}>
          We do not sell, rent, or share your personal information with third parties for
          marketing purposes.
        </p>

        <h2 style={s.h2}>3. Third-Party Services</h2>
        <p style={s.p}>
          This website uses the following third-party services that may collect anonymous usage data:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Google Analytics</strong> — tracks page views
            and traffic patterns anonymously. See{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--gold)' }}
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li style={s.li}>
            <strong style={{ color: 'var(--text)' }}>Google Ads</strong> — conversion tracking
            to measure effectiveness of advertising. No personally identifiable information is
            shared with Google through this process.
          </li>
        </ul>

        <h2 style={s.h2}>4. Cookies</h2>
        <p style={s.p}>
          This site uses cookies only for analytics and advertising measurement purposes described
          above. We do not use cookies to identify you personally. You can disable cookies in
          your browser settings at any time.
        </p>

        <h2 style={s.h2}>5. Data Retention</h2>
        <p style={s.p}>
          Contact form submissions are retained in our email inbox for operational purposes.
          We do not maintain a separate customer database on this website. If you would like
          your information removed from our records, contact us and we will honor that request
          within 30 days.
        </p>

        <h2 style={s.h2}>6. Children&apos;s Privacy</h2>
        <p style={s.p}>
          This website is not directed at children under 13. We do not knowingly collect
          information from minors.
        </p>

        <h2 style={s.h2}>7. Changes to This Policy</h2>
        <p style={s.p}>
          We may update this policy periodically. The &quot;Last updated&quot; date at the top
          reflects the most recent revision. Continued use of the site after changes constitutes
          acceptance of the updated policy.
        </p>

        <hr style={s.divider} />
        <div style={s.contact}>
          <strong style={{ color: 'var(--text)' }}>Questions about your data?</strong> Email us at{' '}
          <a href="mailto:julioramirez@jandrnw.com" style={{ color: 'var(--gold)' }}>
            julioramirez@jandrnw.com
          </a>{' '}
          or call{' '}
          <a href="tel:+15039982340" style={{ color: 'var(--gold)' }}>
            (503) 998-2340
          </a>
          .
        </div>
      </div>
    </Layout>
  );
}
