import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Hero image preload — crítico para LCP */}
        <link
          rel="preload"
          as="image"
          href="/assets/home-hero-bg.webp"
          fetchPriority="high"
        />
        {/* BBB Seal */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var bbb = bbb || [];
              bbb.push(["bbbid", "greatwestpacific"]);
              bbb.push(["bid", "1000117288"]);
              bbb.push(["chk", "A690EB6EA0"]);
              bbb.push(["pos", "bottom-left"]);
              bbb.push(["container", "bbb-seal"]);
              (function () {
                var scheme = (("https:" == document.location.protocol) ? "https://" : "http://");
                var bbb = document.createElement("script");
                bbb.type = "text/javascript";
                bbb.async = true;
                bbb.src = scheme + "seal-alaskaoregonwesternwashington.bbb.org/badge/badge.min.js";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(bbb, s);
              })();
            `,
          }}
        />
        {/* Google Ads gtag — requerido para conversion tracking */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17362940957"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("js", new Date());
              gtag("config", "AW-17362940957");
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != "undefined") { window.location = url; }
                };
                gtag("event", "conversion", {
                  "send_to": "AW-17362940957/co0XCP6H_pAcEJ3opddA",
                  "event_callback": callback
                });
                return false;
              }
            `,
          }}
        />

        {/* GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K44RZ5FM');`,
          }}
        />
        {/* Typebot Bubble */}
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
              import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3/dist/web.js'
              const messages = [
                "Schedule a Free Consultation 📅",
                "Get a Free Quote Today! 🏗️",
                "Let Us Help You! 💪"
              ];
              let msgIndex = 0;
              Typebot.initBubble({
                typebot: "j-r-nw-construction-bot-jo87vrh",
                apiHost: "https://typebot.io",
                previewMessage: {
                  message: "Schedule a Free Consultation 📅",
                  autoShowDelay: 2000
                },
                theme: {
                  button: {
                    backgroundColor: "#1D1D1D",
                    size: "large",
                    customIconSrc: "https://s3.typebotstorage.com/public/workspaces/cmo20jc8e000007kvcr9wsbe1/typebots/cmo23mpkg000108l7ujo87vrh/bubble-icon?v=1776897787128"
                  },
                  previewMessage: {
                    backgroundColor: "#1a252f",
                    textColor: "#D4AF37",
                    closeButtonBackgroundColor: "#D4AF37",
                    closeButtonIconColor: "#1a252f"
                  }
                }
              });
              setTimeout(() => {
                const bubble = document.querySelector('typebot-bubble');
                if (bubble && bubble.shadowRoot) {
                  const preview = bubble.shadowRoot.querySelector('[part="preview-message"]');
                  if (preview) {
                    preview.style.bottom = '10px';
                    preview.style.right = '80px';
                    preview.style.top = 'auto';
                  }
                }
              }, 2500);
              setInterval(() => {
                msgIndex = (msgIndex + 1) % messages.length;
                const bubble = document.querySelector('typebot-bubble');
                if (bubble && bubble.shadowRoot) {
                  const el = bubble.shadowRoot.querySelector('[part="preview-message"] p');
                  if (el) el.textContent = messages[msgIndex];
                }
              }, 3000);
            `,
          }}
        />
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K44RZ5FM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
