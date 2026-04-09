import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { LanguageProvider } from "../context/LanguageContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8GM4CDHB35"
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8GM4CDHB35');
          gtag('config', 'AW-17362940957');

          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            gtag('event', 'conversion', {
              'send_to': 'AW-17362940957/wysBCNLdh5EcEJ3opddA',
              'value': 1.0,
              'currency': 'USD',
              'event_callback': callback
            });
            return false;
          }
        `}
      </Script>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
