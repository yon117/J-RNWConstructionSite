"use client";

import React, { useRef } from "react";
import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20"
      ref={containerRef}
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-[40rem] md:p-6"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};

export const ScrollTiltCard = ({
  children,
  className,
  index = 0,
  style,
  ...props
}: HTMLMotionProps<"div"> & { index?: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);
  const [viewportKnown, setViewportKnown] = React.useState(false);
  const [hasEntered, setHasEntered] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const syncViewport = () => {
      setIsMobile(mediaQuery.matches);
      setViewportKnown(true);
    };

    syncViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }

    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!viewportKnown) return undefined;
    if (prefersReducedMotion || !isMobile) {
      setHasEntered(true);
      return undefined;
    }

    const node = cardRef.current;
    if (!node) return undefined;

    if (node.getBoundingClientRect().top < window.innerHeight * 0.95) {
      const timer = window.setTimeout(() => setHasEntered(true), 160 + (index * 80));
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [index, isMobile, prefersReducedMotion, viewportKnown]);

  const desktopDirection = index % 2 === 0 ? -1 : 1;
  const desktopInitial = { opacity: 0, x: desktopDirection * 40, y: 56, scale: 0.982 };
  const mobileInitial = { opacity: 0, x: 0, y: 96, scale: 0.88 };
  const visibleState = { opacity: 1, x: 0, y: 0, scale: 1 };
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : isMobile
      ? { duration: 0.82, ease: [0.165, 0.84, 0.44, 1] as const }
      : { duration: 0.62, delay: Math.min(index * 0.08, 0.32), ease: [0.165, 0.84, 0.44, 1] as const };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        willChange: "transform, opacity",
      }}
      initial={
        prefersReducedMotion
          ? false
          : !viewportKnown
            ? false
            : isMobile
              ? mobileInitial
              : desktopInitial
      }
      animate={
        prefersReducedMotion
          ? undefined
          : !viewportKnown
            ? undefined
            : isMobile
              ? (hasEntered ? visibleState : mobileInitial)
              : visibleState
      }
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};
