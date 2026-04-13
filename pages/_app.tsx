import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { LanguageProvider } from "../context/LanguageContext";
import { Barlow, Barlow_Condensed } from "next/font/google";

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