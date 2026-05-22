import { useMemo } from 'react';

function splitText(text, by) {
  if (by === 'characters') return [...text];
  if (by === 'words') return text.split(' ');
  if (by === 'lines') return text.split('\n');
  return [text];
}

function staggerDelay(i, total, from, duration) {
  if (from === 'first')  return i * duration;
  if (from === 'last')   return (total - 1 - i) * duration;
  if (from === 'center') return Math.abs(i - (total - 1) / 2) * duration;
  if (from === 'random') return Math.random() * total * duration;
  if (typeof from === 'number') return Math.abs(i - from) * duration;
  return i * duration;
}

// Map spring-like params to CSS easing + duration
function springToCss(transition = {}) {
  const stiffness = transition.stiffness ?? 260;
  const damping   = transition.damping   ?? 28;
  // High stiffness + low damping = fast + bouncy; low stiffness = slow + smooth
  const duration  = Math.max(0.4, Math.min(1.4, 1.2 - stiffness / 600));
  // Approximate spring as ease-out curve (with slight bounce for low damping)
  const easing = damping < 22
    ? 'cubic-bezier(0.34, 1.52, 0.64, 1)'  // slight overshoot
    : 'cubic-bezier(0.16, 1, 0.3, 1)';      // smooth ease-out expo
  return { duration, easing };
}

/**
 * VerticalCutReveal — CSS animation port of danielpetho/vertical-cut-reveal.
 * No framer-motion/SSR conflicts. Pure @keyframes, works on first paint.
 */
export function VerticalCutReveal({
  children,
  splitBy         = 'lines',
  staggerDuration = 0.06,
  staggerFrom     = 'first',
  reverse         = false,
  transition      = { type: 'spring', stiffness: 260, damping: 28 },
  containerStyle  = {},
  className       = '',
}) {
  const text     = String(children);
  const isBlock  = splitBy === 'lines';
  const segments = useMemo(() => splitText(text, splitBy), [text, splitBy]);
  const baseDelay = transition.delay ?? 0;
  const { duration, easing } = springToCss(transition);
  const fromY = reverse ? '-112%' : '112%';

  return (
    <span
      className={className}
      style={{ display: 'block', ...containerStyle }}
      aria-label={text}
    >
      {segments.map((seg, i) => {
        const delay = baseDelay + staggerDelay(i, segments.length, staggerFrom, staggerDuration);
        return (
          <span
            key={i}
            aria-hidden
            style={{
              display: isBlock ? 'block' : 'inline-block',
              overflow: 'hidden',
              verticalAlign: isBlock ? undefined : 'bottom',
              paddingBottom: isBlock ? '0.06em' : undefined,
            }}
          >
            {!isBlock && i > 0 && splitBy === 'words' && (
              <span style={{ display: 'inline-block' }}>&nbsp;</span>
            )}
            <span
              style={{
                display: 'inline-block',
                animation: `vcr-reveal ${duration}s ${easing} ${delay}s both`,
                animationName: reverse ? 'vcr-reveal-reverse' : 'vcr-reveal',
              }}
            >
              {seg}
            </span>
          </span>
        );
      })}
    </span>
  );
}
