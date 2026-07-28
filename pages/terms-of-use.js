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
  caps: {
    fontSize: 13,
    marginBottom: 16,
    color: 'var(--gray)',
    lineHeight: 1.6,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    margin: '48px 0 0',
  },
  address: {
    marginTop: 16,
    fontSize: 14,
    color: 'var(--gray)',
    lineHeight: 1.7,
    fontStyle: 'normal',
  },
};

export default function TermsOfUse() {
  return (
    <Layout
      title="Terms of Use | J&R NW Construction"
      description="Terms of use for jandrnw.com, operated by J&R NW Construction LLC — Portland, OR licensed general contractor. CCB# 232708."
      canonical="/terms-of-use"
    >
      <div style={s.wrap}>
        <div style={s.eyebrow}>Legal</div>
        <h1 style={s.h1}>Terms of Use</h1>
        <p style={s.meta}>Effective Date: {EFFECTIVE_DATE}</p>

        <p style={s.p}>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your use of the website jandrnw.com (the &ldquo;Site&rdquo;),
          operated by J&amp;R NW Construction LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing
          or using the Site, you agree to these Terms. If you do not agree, please do not use the Site.
        </p>

        <h2 style={s.h2}>1. Use of the Site</h2>
        <p style={s.p}>
          The Site provides information about our construction, remodeling, and restoration services and allows you to
          request a free estimate. You agree to use the Site only for lawful purposes and in a way that does not infringe
          the rights of others or restrict their use of the Site.
        </p>
        <p style={s.p}>You agree not to:</p>
        <ul style={s.ul}>
          <li style={s.li}>Use the Site in any way that violates applicable laws or regulations</li>
          <li style={s.li}>Submit false or misleading information through our forms</li>
          <li style={s.li}>Attempt to gain unauthorized access to the Site, its servers, or related systems</li>
          <li style={s.li}>Use automated tools to scrape, copy, or extract Site content without our written permission</li>
          <li style={s.li}>Introduce viruses, malware, or other harmful code</li>
        </ul>

        <h2 style={s.h2}>2. No Contract for Services Through the Site</h2>
        <p style={s.p}>
          Submitting a form, requesting an estimate, or communicating with us through the Site does{' '}
          <strong style={{ color: 'var(--text)' }}>not</strong> create a contract for construction services. All
          construction, remodeling, and restoration work is governed by a separate written contract signed by both parties,
          as required by Oregon law. Estimates provided are preliminary and subject to change after an on-site evaluation.
        </p>

        <h2 style={s.h2}>3. Estimates and Information Accuracy</h2>
        <p style={s.p}>
          Free estimates and any pricing, timeline, or project information on the Site are provided for general
          informational purposes only. Actual project costs, timelines, and scope depend on site conditions, materials,
          permits, and other factors determined during formal evaluation. We make reasonable efforts to keep Site content
          accurate but do not guarantee that all information is current, complete, or error-free.
        </p>

        <h2 style={s.h2}>4. Licensing</h2>
        <p style={s.p}>
          J&amp;R NW Construction LLC is licensed by the Oregon Construction Contractors Board (CCB# 232708). You can
          verify our license at{' '}
          <a href="https://www.oregon.gov/ccb" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
            oregon.gov/ccb
          </a>
          .
        </p>

        <h2 style={s.h2}>5. Intellectual Property</h2>
        <p style={s.p}>
          All content on the Site — including text, project photos, logos, graphics, and design — is the property of
          J&amp;R NW Construction LLC or its licensors and is protected by copyright and trademark laws. You may not
          reproduce, distribute, or use Site content for commercial purposes without our prior written consent. Project
          photos may not be used to misrepresent the work of other contractors.
        </p>

        <h2 style={s.h2}>6. Reviews and Testimonials</h2>
        <p style={s.p}>
          Client reviews and testimonials displayed on the Site reflect the individual experiences of real clients and are
          sourced from public review platforms (such as Google and Yelp). Individual results and experiences may vary.
        </p>

        <h2 style={s.h2}>7. Third-Party Links and Services</h2>
        <p style={s.p}>
          The Site may contain links to third-party websites or services (Google, Yelp, Facebook, Instagram, BBB). We do
          not control and are not responsible for the content, policies, or practices of third-party sites.
        </p>

        <h2 style={s.h2}>8. Disclaimer of Warranties</h2>
        <p style={s.caps}>
          THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS
          OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NON-INFRINGEMENT. THIS DISCLAIMER APPLIES TO THE WEBSITE ONLY AND DOES NOT LIMIT ANY WARRANTIES PROVIDED IN A
          SIGNED CONSTRUCTION CONTRACT OR ANY WARRANTY RIGHTS UNDER OREGON LAW.
        </p>

        <h2 style={s.h2}>9. Limitation of Liability</h2>
        <p style={s.caps}>
          TO THE FULLEST EXTENT PERMITTED BY LAW, J&amp;R NW CONSTRUCTION LLC SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SITE. THIS LIMITATION APPLIES TO USE
          OF THE WEBSITE ONLY AND DOES NOT LIMIT LIABILITY UNDER ANY SIGNED CONSTRUCTION CONTRACT OR LIABILITY THAT CANNOT
          BE LIMITED UNDER APPLICABLE LAW.
        </p>

        <h2 style={s.h2}>10. Indemnification</h2>
        <p style={s.p}>
          You agree to indemnify and hold harmless J&amp;R NW Construction LLC from claims, damages, or expenses arising
          from your misuse of the Site or violation of these Terms.
        </p>

        <h2 style={s.h2}>11. Privacy</h2>
        <p style={s.p}>
          Your use of the Site is also governed by our{' '}
          <a href="/privacy-policy" style={{ color: 'var(--gold)' }}>
            Privacy Policy
          </a>
          , which describes how we collect and use your information.
        </p>

        <h2 style={s.h2}>12. Governing Law</h2>
        <p style={s.p}>
          These Terms are governed by the laws of the State of Oregon, without regard to conflict of law principles. Any
          dispute arising from these Terms or your use of the Site shall be resolved in the state or federal courts located
          in Multnomah County, Oregon.
        </p>

        <h2 style={s.h2}>13. Changes to These Terms</h2>
        <p style={s.p}>
          We may update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance
          of the revised Terms.
        </p>

        <h2 style={s.h2}>14. Contact</h2>
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
