import { useEffect } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const TOGGLE = 'play none none none';

function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileViewport() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
}

function sideOffset(index, strength = 1) {
    const vw = Math.min(window.innerWidth, 520);
    const distance = Math.max(vw * 0.42 * strength, 140);
    return index % 2 === 0 ? -distance : distance;
}

function connectLenis(lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
}

function revealFromSide(el, index, { strength = 1, y = 72, duration = 0.95 } = {}) {
    const x = sideOffset(index, strength);

    gsap.fromTo(
        el,
        { autoAlpha: 0, x, y, scale: 0.94, rotation: index % 2 === 0 ? -4 : 4 },
        {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                end: 'top 45%',
                toggleActions: TOGGLE,
                invalidateOnRefresh: true,
            },
        }
    );
}

function setupAnimations() {
    const isMobile = isMobileViewport();
    const heroBg = document.querySelector('[data-anim="hero-bg"]');
    if (heroBg && !isMobile) {
        gsap.to(heroBg, {
            yPercent: 22,
            ease: 'none',
            scrollTrigger: {
                trigger: '[data-anim="hero-section"]',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
            },
        });
    } else if (heroBg) {
        gsap.set(heroBg, { clearProps: 'transform' });
    }

    const heroReveal = document.querySelectorAll('[data-anim="hero-reveal"]');
    if (heroReveal.length) {
        gsap.fromTo(
            heroReveal,
            { autoAlpha: 0, y: isMobile ? 28 : 56, x: isMobile ? 0 : (i) => (i === 0 ? -80 : 80) },
            {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: isMobile ? 0.72 : 1,
                stagger: 0.14,
                ease: 'power3.out',
                delay: 0.05,
            }
        );
    }

    gsap.utils.toArray('[data-anim="fade-up"]').forEach((el) => {
        gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
                invalidateOnRefresh: true,
            },
        });
    });

    gsap.utils.toArray('[data-anim="about-logo"]').forEach((el, i) => {
        if (isMobile) {
            gsap.from(el, {
                y: 26,
                autoAlpha: 0,
                duration: 0.62,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 92%',
                    once: true,
                    invalidateOnRefresh: true,
                },
            });
            return;
        }

        revealFromSide(el, i + 1, { strength: 1.25, y: 60, duration: 1.05 });
    });

    gsap.utils.toArray('[data-anim="stat"]').forEach((el, i) => {
        if (isMobile) {
            gsap.from(el, {
                y: 22,
                autoAlpha: 0,
                duration: 0.55,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 94%',
                    once: true,
                    invalidateOnRefresh: true,
                },
            });
            return;
        }

        revealFromSide(el, i, { strength: 0.75, y: 50, duration: 0.85 });
    });

    gsap.utils.toArray('[data-anim="service-card"]').forEach((el) => {
        gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
                invalidateOnRefresh: true,
            },
        });
    });

    gsap.utils.toArray('[data-anim="service-item"]').forEach((el, i) => {
        if (isMobile) {
            gsap.from(el, {
                y: 24,
                autoAlpha: 0,
                duration: 0.58,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 92%',
                    once: true,
                    invalidateOnRefresh: true,
                },
            });
            return;
        }

        revealFromSide(el, i, { strength: 1.1, y: 70, duration: 0.9 });
    });

    gsap.utils.toArray('[data-anim="project-card"]').forEach((el) => {
        gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
                invalidateOnRefresh: true,
            },
        });
    });

    // Stagger groups — children animate in sequence
    gsap.utils.toArray('[data-anim="stagger-group"]').forEach(group => {
        const children = group.querySelectorAll('[data-anim-child]');
        if (!children.length) return;
        gsap.fromTo(
            children,
            { autoAlpha: 0, y: 28 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.09,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: group,
                    start: isMobile ? 'top 93%' : 'top 86%',
                    once: true,
                },
            }
        );
    });

    gsap.utils.toArray('[data-anim="faq-item"]').forEach((el, i) => {
        gsap.fromTo(
            el,
            { autoAlpha: 0, x: -60, y: 20 },
            {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: isMobile ? 0.48 : 0.55,
                ease: 'power2.out',
                delay: i * 0.08,
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? 'top 94%' : 'top 90%',
                    end: 'top 55%',
                    toggleActions: TOGGLE,
                    invalidateOnRefresh: true,
                },
            }
        );
    });

    // ── Sticky-column parallax (OpenAI-style horiz rows) ──
    // Normal rows: left sticks, right scrolls.
    // Flip rows:   right sticks, left scrolls.
    // The scrub makes the depth contrast between columns tangible.
    const horizRows = [
        ...gsap.utils.toArray('[data-layout="horiz-row"]').map(el => ({ el, flip: false })),
        ...gsap.utils.toArray('[data-layout="horiz-row-flip"]').map(el => ({ el, flip: true })),
    ];

    horizRows.forEach(({ el: row, flip }) => {
        // Sticky + parallax only makes sense on desktop (columns side-by-side)
        if (window.innerWidth <= 1100) return;

        const leftCol = row.firstElementChild;
        const rightCol = row.lastElementChild;
        if (!leftCol || !rightCol || leftCol === rightCol) return;

        const scrollingCol = flip ? leftCol : rightCol;
        const stickyCol    = flip ? rightCol : leftCol;

        // Scrolling column: subtle upward parallax for depth contrast
        gsap.to(scrollingCol, {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.7,
                invalidateOnRefresh: true,
            },
        });

        // Sticky column: fades as the section exits so the release feels intentional
        gsap.to(stickyCol, {
            opacity: 0.68,
            scale: 0.976,
            ease: 'none',
            scrollTrigger: {
                trigger: row,
                start: 'bottom 68%',
                end: 'bottom top',
                scrub: 0.45,
                invalidateOnRefresh: true,
            },
        });
    });

    ScrollTrigger.refresh();

    // Elements already in/above viewport on load → show immediately
    ScrollTrigger.getAll().forEach(st => {
        if (st.animation && window.scrollY >= st.start) {
            st.animation.progress(1, true);
        }
    });
}

export default function ScrollMotion() {
    const router = useRouter();

    useEffect(() => {
        if (prefersReducedMotion()) return undefined;

        let ctx;
        const run = () => {
            ctx?.revert();
            ctx = gsap.context(() => setupAnimations());
        };

        const raf = requestAnimationFrame(() => requestAnimationFrame(run));
        const refresh = () => {
            requestAnimationFrame(() => requestAnimationFrame(run));
        };

        const mobile = isMobileViewport();
        let lenis;
        let ticker;
        let bodyObs;

        if (!mobile) {
            document.documentElement.classList.add('lenis', 'lenis-smooth');

            lenis = new Lenis({
                duration: 1.1,
                smoothWheel: true,
                touchMultiplier: 1.6,
            });

            connectLenis(lenis);

            ticker = (time) => lenis.raf(time * 1000);
            gsap.ticker.add(ticker);
            gsap.ticker.lagSmoothing(0);

            const pauseIfLocked = () => {
                const locked = document.body.style.overflow === 'hidden';
                if (locked) lenis.stop();
                else lenis.start();
            };

            bodyObs = new MutationObserver(pauseIfLocked);
            bodyObs.observe(document.body, { attributes: true, attributeFilter: ['style'] });
        }

        document.documentElement.classList.add('scroll-motion-ready');
        router.events.on('routeChangeComplete', refresh);
        window.addEventListener('resize', refresh);

        return () => {
            cancelAnimationFrame(raf);
            router.events.off('routeChangeComplete', refresh);
            window.removeEventListener('resize', refresh);
            bodyObs?.disconnect();
            ctx?.revert();
            if (ticker) gsap.ticker.remove(ticker);
            lenis?.destroy();
            ScrollTrigger.getAll().forEach((st) => st.kill());
            document.documentElement.classList.remove('lenis', 'lenis-smooth', 'scroll-motion-ready');
        };
    }, [router.events, router.asPath]);

    return null;
}
