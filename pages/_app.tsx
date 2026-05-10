import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { LanguageProvider } from "../context/LanguageContext";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
    window.addEventListener('error', handleError);

    return () => {
      router.events.off('routeChangeComplete', track);
      window.removeEventListener('error', handleError);
    };
  }, [router.events]);

  return (
    <LanguageProvider>
      <div className={`${barlow.variable} ${barlowCondensed.variable}`}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Component {...pageProps} />
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