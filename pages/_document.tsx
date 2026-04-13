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

        {/* BBB Seal — sin cambios */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var bbb = bbb || [];
              bbb.push(["bbbid", "greatwestpacific"]);
              bbb.push(["bid", "1000117288"]);
              bbb.push(["chk", "A690EB6EA0"]);
              bbb.push(["pos", "inline"]);
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

        {/* GTM — solo aquí, NO en _app.tsx */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K44RZ5FM');`,
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