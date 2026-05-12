import { useState, useEffect, useRef } from 'react';
import styles from '../styles/WarningSigns.module.css';

const WARNINGS = [
  {
    sev: 'crit', sevLabel: 'Critical Severity', tag: 'Restoration & Mitigation',
    title: 'Water Stains on Ceiling or Walls',
    desc: 'Yellow or brown stains signal active water intrusion behind the surface. Every day it sits, the damage moves deeper into the wall cavity.',
    chain: ['Water\nentry', 'Drywall\nsaturates', 'Mold in\n48 hrs', 'Framing\nrots'],
    risk: 'Drywall loses structural integrity. Mold colonies form within 24–48 hours.',
    fix: 'Stop the source, remove damaged drywall, treat for mold, rebuild and finish.',
  },
  {
    sev: 'crit', sevLabel: 'Critical Severity', tag: 'Restoration & Mitigation',
    title: 'Musty or Earthy Smell Inside',
    desc: 'A persistent musty smell almost always means hidden mold — behind drywall, under flooring, or inside wall cavities you cannot see.',
    chain: ['Hidden\nmoisture', 'Mold\ngrows', 'Spores\nspread', 'Health\nimpact'],
    risk: 'Airborne spores trigger respiratory issues. Spreads through HVAC to entire home.',
    fix: 'Moisture mapping, containment, HEPA filtration, antimicrobial treatment, then rebuild.',
  },
  {
    sev: 'high', sevLabel: 'High Severity', tag: 'Painting & Siding',
    title: 'Cracked or Peeling Exterior Paint',
    desc: 'Paint that peels or cracks is no longer sealing your home. Water is already getting behind it and saturating the surface below.',
    chain: ['Paint\nfails', 'Siding\nwet', 'Rot\nspreads', 'Wall\nreplacement'],
    risk: 'Wood rot in siding and framing. Once rot sets in, paint alone cannot fix it.',
    fix: 'Remove failed paint, replace rotted sections, prime and apply durable exterior finish.',
  },
  {
    sev: 'high', sevLabel: 'High Severity', tag: 'Siding',
    title: 'Gaps or Damaged Siding Panels',
    desc: 'Missing caulk, cracked panels, or separated siding are open invitations for water and pests to enter your wall system.',
    chain: ['Gap\nforms', 'Water\nenters', 'Insulation\nwet', 'Drywall\nmold'],
    risk: 'Water infiltrates insulation and sheathing. Interior drywall absorbs moisture from outside in.',
    fix: 'Remove damaged panels, treat underlying rot, install new siding sealed against Oregon weather.',
  },
  {
    sev: 'crit', sevLabel: 'Critical Severity', tag: 'Remodeling & Restoration',
    title: 'Soft or Spongy Floor Spots',
    desc: 'Soft spots under your feet — especially near bathrooms — mean the subfloor is water-damaged and actively failing underneath.',
    chain: ['Hidden\nleak', 'Subfloor\nswells', 'Joists\nrot', 'Floor\nfails'],
    risk: 'Floor collapse can occur suddenly. Cost rises sharply once joists are involved.',
    fix: 'Open the floor, replace subfloor and joists as needed, treat for mold, refinish to match.',
  },
  {
    sev: 'high', sevLabel: 'High Severity', tag: 'Bathroom Remodeling',
    title: 'Mold or Discoloration in Bathroom',
    desc: 'Black or green growth on grout or walls signals ventilation failure and water already behind your tile.',
    chain: ['Grout\nfails', 'Water\nbehind tile', 'Drywall\nmold', 'Subfloor\nrots'],
    risk: 'Mold eats through drywall and reaches the subfloor. Full tile removal becomes unavoidable.',
    fix: 'Remove tile and drywall, treat mold, install moisture-resistant board, retile and refinish.',
  },
  {
    sev: 'med', sevLabel: 'Medium Severity', tag: 'Drywall',
    title: 'Cracks, Holes, or Bulging Drywall',
    desc: 'Drywall that cracks, bulges, or is damaged is not just cosmetic — it often signals moisture or structural issues behind the wall.',
    chain: ['Crack\nforms', 'Moisture\nenters', 'Paper\ndeteriorates', 'Mold\ngrows'],
    risk: 'Bulging drywall means water is already trapped behind it. Ignored, leads to mold.',
    fix: 'Assess cause, replace affected sections, tape, mud, sand, and paint to seamless finish.',
  },
  {
    sev: 'med', sevLabel: 'Medium Severity', tag: 'Interior Painting',
    title: 'Bubbling or Peeling Interior Paint',
    desc: 'Interior paint that bubbles or peels is almost always caused by moisture behind the surface — not just poor application.',
    chain: ['Moisture\nbehind', 'Adhesion\nfails', 'Bubbles\nappear', 'Drywall\nmoldy'],
    risk: 'Mold grows on the paper backing of drywall before the paint even fully falls off.',
    fix: 'Identify moisture source, remove and treat affected drywall if needed, repaint properly.',
  },
  {
    sev: 'med', sevLabel: 'Medium Severity', tag: 'Remodeling & Siding',
    title: 'Drafts Around Windows or Doors',
    desc: 'Feeling air movement around window frames means your home envelope is compromised — and water follows wherever air goes.',
    chain: ['Seal\nfails', 'Water\nenters', 'Insulation\nwet', 'Mold\ngrows'],
    risk: 'Water infiltrates wall cavities. Drywall absorbs moisture. Mold follows.',
    fix: 'Seal penetrations, replace failed caulk and flashing, repair siding or trim, restore barrier.',
  },
  {
    sev: 'crit', sevLabel: 'Critical Severity', tag: 'Mitigation & Emergency',
    title: 'Flooding or Burst Pipe Damage',
    desc: 'Standing water from a burst pipe or storm flooding requires immediate response. Every hour the water sits multiplies the damage.',
    chain: ['Water\nevent', 'Materials\nsaturate', 'Mold\nat 48 hrs', 'Full\nrebuild'],
    risk: 'Flooring, subfloor, drywall, and framing all absorb water rapidly. Mold starts fast.',
    fix: 'Same-day response — extract water, dry structure, remove saturated materials, rebuild.',
  },
  {
    sev: 'med', sevLabel: 'Medium Severity', tag: 'Bathroom Remodeling',
    title: 'Old or Failing Bathroom Tile & Fixtures',
    desc: 'Worn grout, cracked tile, or old caulk look cosmetic but allow water to seep behind walls slowly over time.',
    chain: ['Tile\ncracks', 'Slow\nleak', 'Backer\nfails', 'Subfloor\nrots'],
    risk: 'Old tile hides years of slow water damage to the backer board and subfloor beneath.',
    fix: 'Full bathroom remodel — new tile, waterproof backer, modern fixtures, proper ventilation.',
  },
  {
    sev: 'high', sevLabel: 'High Severity', tag: 'Siding & Restoration',
    title: 'Wood Rot on Siding, Trim, or Eaves',
    desc: 'Soft, dark, or crumbling wood on exterior trim or siding means rot is already spreading into adjacent healthy material.',
    chain: ['Seal\nfails', 'Wood\nwet', 'Rot\nspreads', 'Frame\ndamage'],
    risk: 'Rot spreads to wall sheathing and framing. Pests are attracted and accelerate damage.',
    fix: 'Remove all rotted material, treat surrounding wood, replace with rot-resistant sealed material.',
  },
  {
    sev: 'high', sevLabel: 'High Severity', tag: 'Remodeling & Restoration',
    title: 'Warping or Buckling Flooring',
    desc: 'Hardwood, laminate, or vinyl that warps or lifts at the edges means moisture is rising from below — a subfloor problem.',
    chain: ['Moisture\nrises', 'Floor\nbuckles', 'Mold\nunder', 'Subfloor\nreplace'],
    risk: 'Subfloor damage. Mold grows underneath where you cannot see it. Joists deteriorate.',
    fix: 'Stop moisture source, replace subfloor, treat for mold, install new flooring with vapor barrier.',
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
        <article key={index} className={`${styles.card} ${phase === 'in' ? styles.cardIn : styles.cardOut}`}>
          <div className={`${styles.h} ${styles.fadeIn}`}>
            <span className={`${styles.sev} ${styles[d.sev]}`}>{d.sevLabel}</span>
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
