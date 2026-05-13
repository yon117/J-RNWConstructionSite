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

        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GeneralContractor",
              "name": "J&R NW Construction",
              "url": "https://jandrnw.com",
              "logo": "https://jandrnw.com/logo.png",
              "image": "https://jandrnw.com/og-image.jpg",
              "telephone": "+15039982340",
              "email": "jandrnwconstruction@gmail.com",
              "description": "Portland's trusted general contractor specializing in home remodeling, siding installation, water damage restoration, painting, and general repairs. Licensed, bonded & insured.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Portland",
                "addressRegion": "OR",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 45.5051,
                "longitude": -122.6750
              },
              "areaServed": [
                { "@type": "City", "name": "Portland" },
                { "@type": "State", "name": "Oregon" }
              ],
              "serviceType": [
                "Home Remodeling",
                "Siding Installation",
                "Water Damage Restoration",
                "Painting",
                "Drywall",
                "General Construction"
              ],
              "award": "Oregon CCB #232708",
              "priceRange": "$$",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "07:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.facebook.com/JRNWConstruction/",
                "https://www.instagram.com/jandrnwconstruction/",
                "https://m.yelp.com/biz/j-and-r-nw-construction-portland-5",
                "https://www.google.com/maps/place/J%26R+NW+Construction/"
              ]
            }),
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