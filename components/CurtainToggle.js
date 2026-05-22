import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../context/ThemeContext';
import styles from './CurtainToggle.module.css';

const THEME_BG = {
  dark: '#0F1923',
  light: '#F5F3EF',
};

export default function CurtainToggle() {
  const { theme, toggle } = useTheme();
  const [curtainState, setCurtainState] = useState('hidden');
  const [curtainColor, setCurtainColor] = useState('#0F1923');
  const [mounted, setMounted] = useState(false);
  const animating = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleToggle = () => {
    if (animating.current) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      toggle();
      return;
    }

    animating.current = true;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setCurtainColor(THEME_BG[nextTheme]);
    setCurtainState('falling');

    timerRef.current = setTimeout(() => {
      toggle();
      setCurtainState('rising');

      timerRef.current = setTimeout(() => {
        setCurtainState('hidden');
        animating.current = false;
      }, 280);
    }, 280);
  };

  const curtain = mounted ? createPortal(
    <div
      className={styles.curtainWrap}
      aria-hidden="true"
      style={{ pointerEvents: curtainState === 'hidden' ? 'none' : 'all' }}
    >
      <div
        className={styles.curtainTop}
        style={{
          backgroundColor: curtainColor,
          transform: curtainState === 'falling' || curtainState === 'risen'
            ? 'scaleY(1)'
            : 'scaleY(0)',
        }}
      />
      <div
        className={styles.curtainBot}
        style={{
          backgroundColor: curtainColor,
          transform: curtainState === 'falling' || curtainState === 'risen'
            ? 'scaleY(1)'
            : 'scaleY(0)',
        }}
      />
    </div>,
    document.body
  ) : null;

  return (
    <>
      {curtain}
      <button
        type="button"
        onClick={handleToggle}
        className={styles.toggleBtn}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className={styles.icon} aria-hidden="true">
          {theme === 'dark' ? '☀' : '☾'}
        </span>
      </button>
    </>
  );
}
