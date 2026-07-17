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

export default function Terms() {
  return (
    <Layout
      title="Terms of Service | J&R NW Construction"
      description="Terms of service for J&R NW Construction — Portland, OR licensed general contractor. CCB #232708."
    >
      <div style={s.wrap}>
        <div style={s.eyebrow}>Legal</div>
        <h1 style={s.h1}>Terms of Service</h1>
        <p style={s.meta}>Last updated: {LAST_UPDATED}</p>

        <p style={s.p}>
          These Terms of Service govern your use of the J&amp;R NW Construction website located at
          jandrnw.com and any services requested through it. By accessing this site or submitting a
          request, you agree to these terms.
        </p>

        <h2 style={s.h2}>1. Estimates &amp; Quotes</h2>
        <p style={s.p}>
          All estimates provided — whether online, by phone, or in person — are non-binding until
          both parties sign a written contract. Prices are subject to change based on final scope,
          materials, and site conditions discovered during work.
        </p>

        <h2 style={s.h2}>2. Scope of Work</h2>
        <p style={s.p}>
          Work performed by J&amp;R NW Construction is limited to the scope described in the signed
          project contract. Any additions or changes to scope must be agreed upon in writing before
          work begins. Verbal agreements are not binding.
        </p>

        <h2 style={s.h2}>3. Payment</h2>
        <ul style={s.ul}>
          <li style={s.li}>Payment schedules are outlined in each individual project contract.</li>
          <li style={s.li}>Work may be paused if payment milestones are not met.</li>
          <li style={s.li}>Final payment is due upon project completion and client walkthrough.</li>
          <li style={s.li}>Returned checks are subject to a $35 fee plus any applicable bank charges.</li>
        </ul>

        <h2 style={s.h2}>4. Warranty</h2>
        <p style={s.p}>
          J&amp;R NW Construction warrants workmanship for one (1) year from project completion.
          This warranty covers defects in installation or craftsmanship directly caused by our crew.
          It does not cover damage from natural disasters, acts of God, misuse, or modifications
          made by others after completion.
        </p>
        <p style={s.p}>
          Manufacturer warranties for materials and products are separate and governed by each
          manufacturer&apos;s terms.
        </p>

        <h2 style={s.h2}>5. Limitation of Liability</h2>
        <p style={s.p}>
          To the maximum extent permitted by Oregon law, J&amp;R NW Construction&apos;s liability
          for any claim arising from services rendered shall not exceed the total amount paid for
          those services. We are not liable for indirect, incidental, or consequential damages.
        </p>

        <h2 style={s.h2}>6. Dispute Resolution</h2>
        <p style={s.p}>
          Any disputes shall first be addressed through good-faith communication. If unresolved,
          disputes shall be handled through mediation or binding arbitration in Multnomah County,
          Oregon, under Oregon state law.
        </p>

        <h2 style={s.h2}>7. Licensing</h2>
        <p style={s.p}>
          J&amp;R NW Construction is a licensed, bonded, and insured general contractor operating
          under Oregon CCB License #232708. All work complies with applicable Oregon building codes
          and permit requirements.
        </p>

        <h2 style={s.h2}>8. Website Use</h2>
        <p style={s.p}>
          This website is provided for informational purposes. You may not copy, reproduce, or
          distribute content from this site without written permission. We reserve the right to
          update these terms at any time; continued use of the site constitutes acceptance of
          any changes.
        </p>

        <hr style={s.divider} />
        <div style={s.contact}>
          <strong style={{ color: 'var(--text)' }}>Questions?</strong> Contact us at{' '}
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
