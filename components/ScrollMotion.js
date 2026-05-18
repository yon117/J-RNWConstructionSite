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
    const heroBg = document.querySelector('[data-anim="hero-bg"]');
    if (heroBg) {
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
    }

    const heroReveal = document.querySelectorAll('[data-anim="hero-reveal"]');
    if (heroReveal.length) {
        gsap.fromTo(
            heroReveal,
            { autoAlpha: 0, y: 56, x: (i) => (i === 0 ? -80 : 80) },
            {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 1,
                stagger: 0.14,
                ease: 'power3.out',
                delay: 0.05,
            }
        );
    }

    gsap.utils.toArray('[data-anim="fade-up"]').forEach((el, i) => {
        revealFromSide(el, i, { strength: 1.1, y: 90, duration: 1 });
    });

    gsap.utils.toArray('[data-anim="about-logo"]').forEach((el, i) => {
        revealFromSide(el, i + 1, { strength: 1.25, y: 60, duration: 1.05 });
    });

    gsap.utils.toArray('[data-anim="stat"]').forEach((el, i) => {
        revealFromSide(el, i, { strength: 0.75, y: 50, duration: 0.85 });
    });

    gsap.utils.toArray('[data-anim="service-card"]').forEach((el, i) => {
        revealFromSide(el, i, { strength: 1.15, y: 80, duration: 0.95 });
    });

    gsap.utils.toArray('[data-anim="faq-item"]').forEach((el, i) => {
        gsap.fromTo(
            el,
            { autoAlpha: 0, x: -60, y: 20 },
            {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
                delay: i * 0.08,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    end: 'top 55%',
                    toggleActions: TOGGLE,
                    invalidateOnRefresh: true,
                },
            }
        );
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

        document.documentElement.classList.add('lenis', 'lenis-smooth', 'scroll-motion-ready');

        const lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            touchMultiplier: 1.6,
        });

        connectLenis(lenis);

        const ticker = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        let ctx;
        const run = () => {
            ctx?.revert();
            ctx = gsap.context(() => setupAnimations());
        };

        const raf = requestAnimationFrame(() => requestAnimationFrame(run));

        const refresh = () => {
            requestAnimationFrame(() => requestAnimationFrame(run));
        };
        router.events.on('routeChangeComplete', refresh);

        const pauseIfLocked = () => {
            const locked = document.body.style.overflow === 'hidden';
            if (locked) lenis.stop();
            else lenis.start();
        };
        const bodyObs = new MutationObserver(pauseIfLocked);
        bodyObs.observe(document.body, { attributes: true, attributeFilter: ['style'] });

        return () => {
            cancelAnimationFrame(raf);
            router.events.off('routeChangeComplete', refresh);
            bodyObs.disconnect();
            ctx?.revert();
            gsap.ticker.remove(ticker);
            lenis.destroy();
            ScrollTrigger.getAll().forEach((st) => st.kill());
            document.documentElement.classList.remove('lenis', 'lenis-smooth', 'scroll-motion-ready');
        };
    }, [router.events, router.asPath]);

    return null;
}
