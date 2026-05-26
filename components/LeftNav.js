import { useEffect, useState, useRef } from 'react';
import styles from './LeftNav.module.css';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const MARGIN = 150;
const HIDE_DELAY = 400;

export default function LeftNav({ sections = [] }) {
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState({});
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wasVisible = useRef(false);
  const hideTimer = useRef(null);
  const expandTimer = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || sections.length === 0) return undefined;

    let frameId = 0;

    const commitHide = () => {
      wasVisible.current = false;
      setVisible(false);
      setActive(null);
      hideTimer.current = null;
    };

    const updateNav = () => {
      const resolved = sections
        .map((section) => {
          const el = document.getElementById(section.id);
          return el ? { ...section, el } : null;
        })
        .filter(Boolean);

      if (!resolved.length) {
        clearTimeout(hideTimer.current);
        clearTimeout(expandTimer.current);
        hideTimer.current = null;
        expandTimer.current = null;
        wasVisible.current = false;
        setVisible(false);
        setExpanded(false);
        setActive(null);
        setProgress({});
        return;
      }

      const vh = window.innerHeight;
      const focusLine = vh * 0.42;

      const firstRect = resolved[0].el.getBoundingClientRect();
      const lastRect = resolved[resolved.length - 1].el.getBoundingClientRect();
      const shouldShow = window.innerWidth > 1100
        && firstRect.top <= focusLine
        && lastRect.bottom >= vh * 0.22;

      if (shouldShow) {
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        wasVisible.current = true;
        setVisible(true);
      } else if (wasVisible.current) {
        if (!hideTimer.current) {
          hideTimer.current = setTimeout(commitHide, HIDE_DELAY);
        }
      } else {
        setVisible(false);
        setExpanded(false);
      }

      const nextProgress = {};
      let nextActive = resolved[0].id;

      resolved.forEach((section) => {
        const rect = section.el.getBoundingClientRect();
        const rawProgress = (focusLine - rect.top) / Math.max(rect.height, 1);
        nextProgress[section.id] = clamp(rawProgress, 0, 1);

        if (rawProgress >= 0) {
          nextActive = section.id;
        }
      });

      setProgress(nextProgress);
      if (wasVisible.current) setActive(nextActive);
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateNav);
    };

    const handleScroll = () => {
      if (window.innerWidth > 1100) {
        setExpanded(true);
        clearTimeout(expandTimer.current);
        expandTimer.current = setTimeout(() => setExpanded(false), 220);
      }
      requestUpdate();
    };

    requestUpdate();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', requestUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(hideTimer.current);
      clearTimeout(expandTimer.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('load', requestUpdate);
    };
  }, [sections]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) return null;

  return (
    <nav
      className={`${styles.nav} ${visible ? styles.navVisible : ''} ${expanded ? styles.navExpanded : ''}`}
      aria-label="Page sections"
    >
      {sections.map(({ id, label, num }) => {
        const isActive = active === id;
        const prog = progress[id] ?? 0;
        const isComplete = prog >= 1;

        return (
          <button
            key={id}
            className={`${styles.item} ${isActive ? styles.active : ''} ${isComplete ? styles.complete : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={`Go to ${label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <div className={styles.row}>
              <span className={styles.num}>{num}</span>
              <span className={styles.label}>{label.toUpperCase()}</span>
            </div>
            <div className={styles.bar}>
              <span
                className={styles.fill}
                style={{ transform: `scaleX(${prog})` }}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
