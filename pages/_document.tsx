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

        {/* Hero image preload — crítico para LCP */}
        <link
          rel="preload"
          as="image"
          href="/assets/home-hero-bg.webp"
          fetchPriority="high"
        />



        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GeneralContractor",
              "@id": "https://jandrnw.com/#business",
              "name": "J&R NW Construction",
              "legalName": "J&R NW Construction LLC",
              "url": "https://jandrnw.com",
              "logo": "https://jandrnw.com/logo.png",
              "image": "https://jandrnw.com/og-image.jpg",
              "telephone": "+15039982340",
              "email": "jandrnwconstruction@gmail.com",
              "description": "Portland's trusted general contractor specializing in home remodeling, siding installation, water damage restoration, painting, and general repairs. Licensed, bonded & insured. 24/7 emergency response for water damage.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "17942 SE Division St",
                "postalCode": "97236",
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
                "Portland", "Beaverton", "Hillsboro", "Gresham", "Tigard", "Tualatin",
                "Lake Oswego", "West Linn", "Clackamas", "Happy Valley", "Oregon City", "Milwaukie"
              ].map((name) => ({ "@type": "City", "name": name })),
              "serviceType": [
                "Home Remodeling",
                "Siding Installation",
                "Water Damage Restoration",
                "Painting",
                "Drywall",
                "General Construction"
              ],
              "hasCredential": "Oregon CCB #232708",
              "priceRange": "$$",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                "opens": "00:00",
                "closes": "23:59"
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