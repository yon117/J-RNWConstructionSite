import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { LanguageProvider } from "../context/LanguageContext";
import { Barlow, Barlow_Condensed } from "next/font/google";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

if (typeof window !== 'undefined') {
  history.scrollRestoration = 'manual';
}

const Bubble = dynamic(
  () => import("@typebot.io/react").then((mod) => mod.Bubble),
  { ssr: false }
);

const ScrollMotion = dynamic(() => import("../components/ScrollMotion"), { ssr: false });

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

if (typeof window !== "undefined") {
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).gtag_report_conversion = function (url?: string) {
    const callback = function () {
      if (typeof url !== "undefined") {
        window.location.href = url;
      }
    };
    (window as any).dataLayer.push({
      event: "conversion",
      send_to: "AW-17362940957/wysBCNLdh5EcEJ3opddA",
      value: 1.0,
      currency: "USD",
      event_callback: callback,
    });
    return false;
  };
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    router.events.on('routeChangeComplete', resetScroll);
    return () => {
      router.events.off('routeChangeComplete', resetScroll);
    };
  }, [router.events]);

  // Dev only: preserve scroll position across HMR reloads
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const saved = parseInt(sessionStorage.getItem('__devScrollY') || '0', 10);
    if (saved > 0) requestAnimationFrame(() => window.scrollTo(0, saved));
    const save = () => sessionStorage.setItem('__devScrollY', String(Math.round(window.scrollY)));
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  useEffect(() => {
    const reloadKey = '__chunkLoadRetry';

    const isChunkLoadError = (value: unknown) => {
      if (!value) return false;
      if (value instanceof Error) {
        return value.name === 'ChunkLoadError'
          || /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(value.message);
      }
      if (typeof value === 'string') {
        return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(value);
      }
      return false;
    };

    const reloadOnce = () => {
      if (sessionStorage.getItem(reloadKey) === '1') return false;
      sessionStorage.setItem(reloadKey, '1');
      window.location.reload();
      return true;
    };

    const track = (url: string) => {
      if (url.startsWith('/adminside') || url.startsWith('/admin')) return;
      const device_type = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
      fetch('/api/monitor/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: url, referrer: document.referrer || '', device_type }),
        keepalive: true,
      }).catch(() => {});
    };

    const path = window.location.pathname + window.location.search;
    track(path);
    router.events.on('routeChangeComplete', track);

    const handleError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error) || isChunkLoadError(event.message)) {
        if (reloadOnce()) return;
      }
      fetch('/api/monitor/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.message,
          source: event.filename || '',
          lineno: event.lineno || 0,
          path: window.location.pathname,
        }),
        keepalive: true,
      }).catch(() => {});
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        event.preventDefault();
        if (reloadOnce()) return;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      router.events.off('routeChangeComplete', track);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [router.events]);

  const isAdmin = router.pathname.startsWith('/admin') || router.pathname.startsWith('/adminside');

  return (
    <LanguageProvider>
      <div className={`${barlow.variable} ${barlowCondensed.variable}`}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        {!isAdmin && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-8GM4CDHB35"
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','G-8GM4CDHB35');
            `}</Script>
            <Script id="gtm-init" strategy="afterInteractive">{`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K44RZ5FM');
            `}</Script>
          </>
        )}
        <Component {...pageProps} />
        {!isAdmin && <ScrollMotion />}
        {!isAdmin && (
          <Bubble
            typebot="j-r-nw-construction-bot-jo87vrh"
            apiHost="https://typebot.io"
            theme={{
              button: {
                backgroundColor: "#1D1D1D",
                customIconSrc: "https://s3.typebotstorage.com/public/workspaces/cmo20jc8e000007kvcr9wsbe1/typebots/cmo23mpkg000108l7ujo87vrh/bubble-icon?v=1778516713075",
                size: "large",
              } as any,
            }}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export function reportWebVitals(metric: any) {
  if (typeof navigator === 'undefined') return;
  fetch('/api/monitor/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: metric.name, value: metric.value, rating: metric.rating }),
    keepalive: true,
  }).catch(() => {});
}
