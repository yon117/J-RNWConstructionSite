import Link from 'next/link';
import { useEffect, useRef } from 'react';
import InteractiveHouse from './InteractiveHouse';
import WordCycler from './WordCycler';
import { VerticalCutReveal } from './ui/VerticalCutReveal';
import styles from '../styles/Home.module.css';

const T_SPRING = { type: 'spring', stiffness: 300, damping: 28 };
const B_SPRING = { type: 'spring', stiffness: 250, damping: 32 };

export default function HeroSection({
  t,
  children,
  onEstimateClick,
  icons: { ShieldIcon, StarIcon, CheckIcon, ArrowIcon, PhoneIcon, YelpLogoIcon, GoogleLogoIcon },
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let ctx;

    const run = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const { default: gsap } = await import('gsap');
      if (cancelled) return;

      ctx = gsap.context(() => {
        const fades = sectionRef.current?.querySelectorAll('[data-hero-fade]');
        if (!fades?.length) return;

        gsap.set(fades, { autoAlpha: 0, y: 28 });
        gsap.to(fades, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 1.1,
        });
      }, sectionRef);
    };

    run();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('hero-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (onEstimateClick) onEstimateClick();
  };

  return (
    <section ref={sectionRef} className={styles.hero} data-anim="hero-section">
      <div className={styles.heroBg} data-anim="hero-bg" aria-hidden="true" />

      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge} data-hero-fade>
            <div className={styles.heroBadgeDot} />
            {t.navSubtitle}
          </div>

          <h1 className={styles.heroCutHeadline} aria-label="Portland's number one general contractor">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.1}
              staggerFrom="first"
              transition={{ ...T_SPRING, delay: 0.05 }}
              className={styles.heroCutLineTitle}
            >
              {"Portland's #1"}
            </VerticalCutReveal>

            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.1}
              staggerFrom="last"
              reverse
              transition={{ ...T_SPRING, delay: 0.28 }}
              className={`${styles.heroCutLineTitle} ${styles.heroCutLineTitleAccent}`}
            >
              {"General Contractor"}
            </VerticalCutReveal>

            <VerticalCutReveal
              splitBy="lines"
              transition={{ ...B_SPRING, delay: 0.54 }}
              className={styles.heroCutLineBody}
            >
              {"Serving Homes & Businesses for Over 20 Years."}
            </VerticalCutReveal>

            <VerticalCutReveal
              splitBy="lines"
              transition={{ ...B_SPRING, delay: 0.66 }}
              className={styles.heroCutLineBody}
            >
              {"Remodeling · Additions · Siding · Painting."}
            </VerticalCutReveal>

            <VerticalCutReveal
              splitBy="lines"
              transition={{ ...B_SPRING, delay: 0.78 }}
              className={styles.heroCutLineBody}
            >
              {"Drywall · Restoration · Mitigation · Mold."}
            </VerticalCutReveal>

            <VerticalCutReveal
              splitBy="lines"
              transition={{ ...B_SPRING, delay: 0.90 }}
              className={styles.heroCutLineBody}
            >
              {"Structural Support/Repair · Emergency Services."}
            </VerticalCutReveal>

            <VerticalCutReveal
              splitBy="lines"
              staggerDuration={0.06}
              staggerFrom="first"
              transition={{ ...B_SPRING, delay: 1.02 }}
              className={`${styles.heroCutLineBody} ${styles.heroCutLineCities} ${styles.heroCutLineServiceArea}`}
            >
              {"Service Area: Portland · Tigard · Tualatin · Gresham · Happy Valley · Oregon City\nNot listed? Contact us to confirm coverage."}
            </VerticalCutReveal>

          </h1>

          <div className={styles.insuranceBanner} data-hero-fade>
            <div className={styles.insuranceBannerHeader}>
              <span className={styles.insuranceBannerDot} />
              We Work With You — Your Way
            </div>
            <div className={styles.insuranceBannerCards}>
              <div className={styles.insuranceBannerCard}>
                <div className={styles.insuranceBannerCardTitle}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Insurance Claims
                </div>
                <p className={styles.insuranceBannerCardDesc}>
                  We coordinate directly with your adjuster from start to finish. No paperwork headaches, just results.
                </p>
              </div>
              <div className={styles.insuranceBannerCard}>
                <div className={styles.insuranceBannerCardTitle}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Direct Client
                </div>
                <p className={styles.insuranceBannerCardDesc}>
                  No claim needed. Transparent quote, no surprises, pay only what&apos;s agreed.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.heroCycler}>
            <WordCycler />
          </div>

          <div className={styles.heroActions} data-hero-fade>
            <button type="button" className={styles.btnPrimary} onClick={scrollToForm}>
              {t.getFreeEstimate} <ArrowIcon />
            </button>
            <Link href="/projects" className={styles.btnSecondary}>
              {t.viewOurWork}
            </Link>
          </div>

          <a
            href="tel:5039982340"
            className={styles.heroCallLink}
            data-hero-fade
            onClick={() => {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'phone_click', { event_category: 'contact', event_label: 'hero_call' });
              }
            }}
          >
            <PhoneIcon /> (503) 998-2340 — Tap to Call
          </a>

          <div className={styles.heroReviewBlock} data-hero-fade>
            <div className={styles.heroReviewRow}>
              <span className={styles.heroReviewLabel}>{t.lookUsUp}</span>
              <div className={styles.heroReviewItems}>
                <span className={styles.heroReviewIcon}><YelpLogoIcon /></span>
                <span className={styles.heroReviewIcon}><GoogleLogoIcon /></span>
                <span className={styles.heroReviewStars}>{"\u2605\u2605\u2605\u2605\u2605"}</span>
                <span className={styles.heroReviewCount}>50+ reviews</span>
              </div>
            </div>
            <div className={styles.heroReviewGuarantee}>100% Satisfaction Guarantee</div>
            <div className={styles.heroReviewCcb}>CCB: 232708</div>
          </div>

          <div className={styles.heroTrust} data-hero-fade>
            <div className={styles.trustItem}>
              <ShieldIcon />
              {t.licensed}, {t.insured} &amp; {t.bonded}
            </div>
            <span className={styles.trustSep}>·</span>
            <div className={styles.trustItem}>
              <StarIcon />
              BBB {t.accredited || 'Accredited'}
            </div>
            <span className={styles.trustSep}>·</span>
            <div className={styles.trustItem}>
              <CheckIcon />
              100% Satisfaction Guarantee
            </div>
          </div>
        </div>

        <div className={styles.heroHouseCol} data-hero-fade>
          <InteractiveHouse />
        </div>

        <div className={styles.heroFormCol} data-hero-fade>
          <div className={styles.heroFormPanel} id="hero-form">
            {children}
          </div>
        </div>
      </div>

      <div className={styles.heroStats}>
        <div className={styles.statBox} data-anim="stat">
          <div className={styles.statNum} data-countup="20" data-countup-suffix="+">20+</div>
          <div className={styles.statLabel}>{t.yearsExp || 'Years Exp.'}</div>
        </div>
        <div className={styles.statBox} data-anim="stat">
          <div className={styles.statNum} data-countup="50" data-countup-suffix="+">50+</div>
          <div className={styles.statLabel}>Families Served</div>
        </div>
        <div className={styles.statBox} data-anim="stat">
          <div className={styles.statNum}>★ 5.0</div>
          <div className={styles.statLabel}>{t.rating || 'Rating'}</div>
        </div>
      </div>

      <div className={styles.heroCredentials}>
        <span><ShieldIcon /> {t.licensed}, {t.insured} &amp; {t.bonded}</span>
        <span>CCB #232708</span>
        <span>BBB {t.accredited || 'Accredited'}</span>
        <span>100% Satisfaction Guarantee</span>
      </div>
    </section>
  );
}
