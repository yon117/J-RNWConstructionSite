import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Portland General Contractor | Home Remodeling & Restoration | J&R NW Construction',
    description: 'Top-rated general contractor in Portland, OR. Remodeling, siding, water damage restoration & emergency repairs. Free estimates. Licensed CCB #232708. Call (503) 998-2340.',
    canonical: '/portland-general-contractor',

    h1: "Portland's Trusted",
    h1Em: 'General Contractor',
    subtitle: 'Serving Portland homeowners for 20+ years. Remodeling, siding, restoration, and emergency services — all under one license. No subcontractor surprises, no runaround.',

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89459.0!2d-122.6784!3d45.5051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950b0b7da97427%3A0x1c36b9e6f6d18591!2sPortland%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: 'Why Portland Homeowners Choose J&R NW',
    whyPoints: [
        "Oregon's wet winters cause hidden water damage — we catch it early, stop it at the source, and fix it right the first time.",
        'Family-owned crew — same team on every job, no subcontractor surprises, and one point of contact from estimate to final walkthrough.',
        'We pull all permits and coordinate inspections so you never have to navigate Portland building departments on your own.',
    ],

    neighborhoods: [
        'Northwest Portland', 'Pearl District', 'Hawthorne', 'Alberta Arts', 'Sellwood',
        'St. Johns', 'Lake Oswego', 'Beaverton', 'Hillsboro',
    ],

    services: [
        {
            num: '01', cat: 'REMODEL', name: 'Interior Construction & Remodeling',
            desc: 'Kitchens, bathrooms, additions. Permits pulled, subs coordinated, finish carpentry in-house. We redesign for how Portland families actually live.',
        },
        {
            num: '02', cat: 'EMERGENCY', name: 'Mitigation & Emergency Services',
            desc: "Burst pipes, fire, windstorm damage. We dispatch within the hour and stabilize the same day — because every hour you wait compounds the damage.",
        },
        {
            num: '03', cat: 'RESTORATION', name: 'Restoration & Reconstruction',
            desc: 'Source repair, structural drying, antimicrobial treatment, then finish-grade rebuild. One crew, one contract, start to finish.',
        },
        {
            num: '04', cat: 'SIDING', name: 'Siding',
            desc: "Full replacement, repairs, and paint. Hardie board, LP SmartSide, vinyl — all weather-sealed against Oregon's relentless rain.",
        },
        {
            num: '05', cat: 'PAINTING', name: 'Paint',
            desc: 'Interior and exterior. Surface prep, primer coat, finish — clean lines and lasting color. We do not cut corners on prep.',
        },
        {
            num: '06', cat: 'DRYWALL', name: 'Drywall',
            desc: 'Hanging, taping, mudding, and finishing. Seamless texture matching and full room repairs — invisible seams guaranteed.',
        },
    ],

    faqs: [
        {
            cat: 'Response', q: 'How fast can you get to Portland?',
            a: "We're Portland-based. Most calls get a same-day or next-day estimate. Emergency jobs dispatch within the hour — we keep a crew on standby for urgent situations.",
        },
        {
            cat: 'Licensing', q: 'Are you licensed to work in Portland?',
            a: 'Yes. Oregon CCB #232708. Fully licensed, bonded, and insured. We pull all required Portland building permits and handle inspection scheduling.',
        },
        {
            cat: 'Pricing', q: 'Do you offer free estimates in Portland?',
            a: 'Always. Free, no-obligation written estimates with full line-item breakdown. No hidden fees, no pressure, no expiration dates on quotes.',
        },
        {
            cat: 'Insurance', q: 'Do you work with Portland homeowners insurance?',
            a: "Yes. We regularly work alongside insurance adjusters for water damage, fire, and structural claims. We document everything and advocate for full scope coverage.",
        },
    ],

    schema: {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
        name: 'J&R NW Construction LLC',
        description: 'Top-rated general contractor in Portland, OR. Remodeling, siding, water damage restoration & emergency repairs.',
        url: 'https://jandrnw.com/portland-general-contractor',
        telephone: '+15039982340',
        email: 'jandrnwconstruction@gmail.com',
        image: 'https://jandrnw.com/assets/home-hero-bg.jpg',
        priceRange: '$$',
        openingHours: 'Mo-Su 00:00-24:00',
        address: { '@type': 'PostalAddress', addressLocality: 'Portland', addressRegion: 'OR', addressCountry: 'US' },
        geo: { '@type': 'GeoCoordinates', latitude: 45.5051, longitude: -122.6784 },
        areaServed: { '@type': 'City', name: 'Portland', sameAs: 'https://en.wikipedia.org/wiki/Portland,_Oregon' },
        hasCredential: 'Oregon CCB #232708',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '50', bestRating: '5' },
        sameAs: ['https://www.facebook.com/JRNWConstruction/'],
        makesOffer: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Remodeling Portland OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Water Damage Restoration Portland OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Siding Installation Portland OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Emergency Repairs Portland OR' } },
        ],
    },
};

export default function PortlandGeneralContractor() {
    return <CityLandingPage data={PAGE_DATA} />;
}
