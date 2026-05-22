import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import styles from './ContainerScroll.module.css';

/**
 * ContainerScroll — Aceternity-style 3D perspective scroll reveal.
 * Card starts tilted (rotateX 20°), flattens as user scrolls into it.
 * titleComponent: JSX shown above the card (shrinks as card rises).
 * children: content inside the 3D card.
 */
export function ContainerScroll({ titleComponent, children }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Title shrinks + moves up as card comes forward
  const titleScale = useTransform(scrollYProgress, [0, 0.38], [1, 0.72]);
  const titleY     = useTransform(scrollYProgress, [0, 0.38], [0, -55]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [1, 1, 0.4]);

  // Card 3D — tilted → flat
  const rotateX  = useTransform(scrollYProgress, [0.08, 0.55], [22, 0]);
  const cardScale = useTransform(scrollYProgress, [0.08, 0.55], [0.62, 1]);
  const cardY    = useTransform(scrollYProgress, [0.08, 0.55], [120, 0]);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Sticky wrapper so title + card stay visible during scroll */}
      <div className={styles.sticky}>
        <motion.div
          className={styles.titleWrap}
          style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
        >
          {titleComponent}
        </motion.div>

        <div className={styles.perspective}>
          <motion.div
            className={styles.card}
            style={{
              rotateX,
              scale: cardScale,
              y: cardY,
              transformStyle: 'preserve-3d',
            }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
