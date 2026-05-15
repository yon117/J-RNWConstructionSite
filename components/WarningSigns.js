import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../styles/WarningSigns.module.css';

const WARNINGS = [
  {
    sev: 'crit', sevLabel: 'Critical Severity', tag: 'Restoration & Mitigation',
    title: 'Water Stains on Ceiling or Walls',
    desc: 'Yellow or brown stains signal active water intrusion behind the surface. Every day it sits, the damage moves deeper into the wall cavity.',
    chain: ['Water\nentry', 'Drywall\nsaturates', 'Mold in\n48 hrs', 'Framing\nrots'],
    risk: 'Drywall loses structural integrity. Mold colonies form within 24–48 hours.',
    fix: 'Stop the source, remove damaged drywall, treat for mold, rebuild and finish.',
    evidence: { code: 'WS-MOISTURE-01', img: '/assets/mitigation.png', tools: ['Non-invasive moisture testing', 'Thermal imaging of wet areas'] },
  },
  {
    sev: 'crit', sevLabel: 'Critical Severity', tag: 'Remodeling & Restoration',
    title: 'Soft or Spongy Floor Spots',
    desc: 'Soft spots under your feet — especially near bathrooms — mean the subfloor is water-damaged and actively failing underneath.',
    chain: ['Hidden\nleak', 'Subfloor\nswells', 'Joists\nrot', 'Floor\nfails'],
    risk: 'Floor collapse can occur suddenly. Cost rises sharply once joists are involved.',
    fix: 'Open the floor, replace subfloor and joists as needed, treat for mold, refinish to match.',
    evidence: { code: 'WS-FLOOR-02', img: '/assets/drywall.png', tools: ['Subfloor moisture probe', 'Structural load assessment'] },
  },
  {
    sev: 'crit', sevLabel: 'Critical Severity', tag: 'Mitigation & Emergency',
    title: 'Flooding or Burst Pipe Damage',
    desc: 'Standing water from a burst pipe or storm flooding requires immediate response. Every hour the water sits multiplies the damage.',
    chain: ['Water\nevent', 'Materials\nsaturate', 'Mold\nat 48 hrs', 'Full\nrebuild'],
    risk: 'Flooring, subfloor, drywall, and framing all absorb water rapidly. Mold starts fast.',
    fix: 'Same-day response — extract water, dry structure, remove saturated materials, rebuild.',
    evidence: { code: 'WS-EMERG-03', img: '/assets/emergency.png', tools: ['Commercial water extraction', 'Industrial drying equipment'] },
  },
  {
    sev: 'high', sevLabel: 'High Severity', tag: 'Bathroom Remodeling',
    title: 'Mold or Discoloration in Bathroom',
    desc: 'Black or green growth on grout or walls signals ventilation failure and water already behind your tile.',
    chain: ['Grout\nfails', 'Water\nbehind tile', 'Drywall\nmold', 'Subfloor\nrots'],
    risk: 'Mold eats through drywall and reaches the subfloor. Full tile removal becomes unavoidable.',
    fix: 'Remove tile and drywall, treat mold, install moisture-resistant board, retile and refinish.',
    evidence: { code: 'WS-BATH-04', img: '/assets/bathroom-reno-1.png', tools: ['Air quality sampling', 'Mold species identification'] },
  },
  {
    sev: 'high', sevLabel: 'High Severity', tag: 'Siding & Restoration',
    title: 'Wood Rot on Siding, Trim, or Eaves',
    desc: 'Soft, dark, or crumbling wood on exterior trim or siding means rot is already spreading into adjacent healthy material.',
    chain: ['Seal\nfails', 'Wood\nwet', 'Rot\nspreads', 'Frame\ndamage'],
    risk: 'Rot spreads to wall sheathing and framing. Pests are attracted and accelerate damage.',
    fix: 'Remove all rotted material, treat surrounding wood, replace with rot-resistant sealed material.',
    evidence: { code: 'WS-SIDING-05', img: '/assets/siding-project-1.png', tools: ['Probe testing for rot depth', 'Moisture content readings'] },
  },
];

const AUTOPLAY_MS = 8000;
const FADE_OUT_MS = 300;

export default function WarningSigns({ onCta }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('in');
  const timerRef = useRef(null);

  const goTo = (next) => {
    if (next === index) return;
    setPhase('out');
    setTimeout(() => { setIndex(next); setPhase('in'); }, FADE_OUT_MS);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPhase('out');
      setTimeout(() => {
        setIndex((i) => (i + 1) % WARNINGS.length);
        setPhase('in');
      }, FADE_OUT_MS);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDotClick = (i) => { goTo(i); resetTimer(); };

  const d = WARNINGS[index];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Field Guide · Inspector's Notes</span>
        <h2 className={styles.h2}>Warning Signs <em>In Your Home</em></h2>
        <p className={styles.lead}>
          Small problems become expensive problems quickly. If you see any of these in your home,
          call us before the damage spreads — inspections are free, no obligation.
        </p>
      </div>

      <div className={styles.stage}>
        <div key={index} className={`${styles.twoCol} ${phase === 'in' ? styles.cardIn : styles.cardOut}`}>
          {/* LEFT — main card */}
          <article className={styles.card}>
            <div className={`${styles.h} ${styles.fadeIn}`}>
              <span className={`${styles.sev} ${styles[d.sev]}`}>{d.sevLabel}</span>
              <span className={styles.codeTag}>CODE: {d.evidence.code}</span>
            </div>

            <div className={`${styles.tb} ${styles.stagger}`}>
              <span className={styles.tag}>{d.tag}</span>
              <h3 className={styles.ttl}>{d.title}</h3>
              <p className={styles.desc}>{d.desc}</p>
            </div>

            <div className={styles.chain}>
              <div className={styles.clbl}>If ignored · progression</div>
              <div className={styles.progress}>
                {d.chain.map((label, n) => (
                  <div key={n} className={styles.step} style={{ animationDelay: `${0.3 + n * 0.1}s` }}>
                    <span className={styles.dot}>{n + 1}</span>
                    <span className={styles.lab}>
                      {label.split('\n').map((line, j, arr) => (
                        <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.split}>
              <div className={`${styles.col} ${styles.risk}`}>
                <span className={styles.lbl}>The Risk</span>
                <p>{d.risk}</p>
              </div>
              <div className={`${styles.col} ${styles.fix}`}>
                <span className={styles.lbl}>Our Fix</span>
                <p>{d.fix}</p>
              </div>
            </div>

            <button type="button" className={styles.cta} onClick={onCta}>
              <span>Book Free Inspection</span>
              <span className={styles.ctaRight}>
                <span className={styles.pill}>No Obligation</span>
                <svg width="14" height="10" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 2l7 7m0 0l-7 7m7-7H1" />
                </svg>
              </span>
            </button>
          </article>

          {/* RIGHT — Evidence Log */}
          <aside className={styles.evidencePanel}>
            <div className={styles.evidenceImgWrap}>
              <Image src={d.evidence.img} alt="Evidence" fill sizes="320px" style={{ objectFit: 'cover', filter: 'brightness(0.75) saturate(0.8)' }} />
            </div>
            <div className={styles.evidenceBody}>
              <div className={styles.evidenceTitle}>Evidence Log</div>
              <p className={styles.evidenceDesc}>Inspectors often find moisture levels exceeding 20% behind seemingly intact surfaces.</p>
              <ul className={styles.evidenceList}>
                {d.evidence.tools.map((tool, i) => (
                  <li key={i} className={styles.evidenceItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className={styles.pager}>
        {WARNINGS.map((_, n) => (
          <button
            key={n} type="button" aria-label={`Show warning ${n + 1}`}
            className={`${styles.dotBtn} ${n === index ? styles.dotOn : ''}`}
            onClick={() => handleDotClick(n)}
          />
        ))}
        <span className={styles.pagerLabel}>
          {String(index + 1).padStart(2, '0')} / {String(WARNINGS.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
