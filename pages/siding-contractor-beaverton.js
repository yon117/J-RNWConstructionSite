import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Siding Contractor Beaverton OR | Hardie Board & LP SmartSide | J&R NW Construction',
    description: 'Licensed siding contractor in Beaverton, OR. Hardie board, LP SmartSide, vinyl siding installation & repair. Free estimates. CCB #232708. Call (503) 998-2340.',
    canonical: '/siding-contractor-beaverton',

    h1: 'Siding Contractor',
    h1Em: 'Beaverton, OR',
    subtitle: "Beaverton's older homes need weatherproof siding that lasts. We install Hardie board, LP SmartSide, and vinyl — properly sealed against Oregon weather, every penetration caulked.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.8037!3d45.4871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950e04e5a3e7cf%3A0x89d47c7501cf3a0a!2sBeaverton%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Why Beaverton Homes Need Quality Siding",
    whyPoints: [
        "Beaverton's 1970s-90s housing stock has original siding that's failing from 30+ years of moisture exposure — rot hides behind the surface where you can't see it.",
        'We replace rotted sheathing before installing new siding, install a vapor barrier, and seal every penetration — not just the visible panels.',
        'Hardie board and LP SmartSide carry 30-year manufacturer warranties, and we back our installation with our own craftsmanship guarantee.',
    ],

    neighborhoods: [
        'Aloha', 'Raleigh Hills', 'Cedar Hills', 'Sunset',
        'Cooper Mountain', 'Murrayhill', 'Scholls',
    ],

    services: [
        {
            num: '01', cat: 'SIDING', name: 'Hardie Board Installation',
            desc: 'James Hardie fiber cement siding installed to manufacturer spec. We cut precisely, prime all cuts, and use corrosion-resistant fasteners rated for Oregon weather.',
        },
        {
            num: '02', cat: 'SIDING', name: 'LP SmartSide Installation',
            desc: 'LP SmartSide engineered wood installed with proper overlap, flashing at all transitions, and sealed caulk at every penetration. Rated for moisture exposure.',
        },
        {
            num: '03', cat: 'SIDING', name: 'Vinyl Siding & Repairs',
            desc: 'Full vinyl replacement or panel-by-panel repair. Color-matched panels, corrected trim work, and resealed J-channels to stop water infiltration.',
        },
        {
            num: '04', cat: 'REPAIRS', name: 'Rot Remediation & Sheathing',
            desc: 'We remove damaged siding, inspect and replace rotted sheathing and framing, install vapor barrier, then side over solid structure — not rotted wood.',
        },
        {
            num: '05', cat: 'PAINTING', name: 'Exterior Painting & Caulking',
            desc: 'Full exterior paint with proper prime coat, surface prep, and two-coat finish. Caulk all transitions, windows, and doors for a sealed envelope.',
        },
        {
            num: '06', cat: 'INSPECTION', name: 'Free Siding Assessment',
            desc: 'Not sure if you need repair or full replacement? We inspect your siding, probe for rot, and give you an honest written assessment — no upsell, no pressure.',
        },
    ],

    faqs: [
        {
            cat: 'Materials', q: 'What siding material is best for Beaverton homes?',
            a: "Hardie board is the gold standard for Oregon's wet climate — it won't rot, swell, or absorb moisture like wood. LP SmartSide is a strong alternative with an excellent warranty. We'll recommend the right material for your specific home and budget.",
        },
        {
            cat: 'Rot', q: 'How do I know if my siding has hidden rot?',
            a: "Soft spots when you press on the surface, paint bubbling away from a seam, or discoloration around windows and doors are all warning signs. We probe during our free inspection and show you exactly what we find before any work begins.",
        },
        {
            cat: 'Permits', q: 'Does siding replacement in Beaverton require a permit?',
            a: 'Full siding replacement in Beaverton typically requires a Washington County building permit. We handle the permit application, scheduling, and inspection — you do nothing.',
        },
        {
            cat: 'Timeline', q: 'How long does siding replacement take in Beaverton?',
            a: 'Most full siding jobs on a standard Beaverton home run 5-10 days. Homes with significant rot repair may take 2-3 weeks. We give you a realistic schedule before we start — weather delays included in the plan.',
        },
    ],

    schema: {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
        name: 'J&R NW Construction LLC — Siding Contractor Beaverton',
        description: 'Licensed siding contractor in Beaverton, OR. Hardie board, LP SmartSide, vinyl siding installation & repair.',
        url: 'https://jandrnw.com/siding-contractor-beaverton',
        telephone: '+15039982340',
        email: 'jandrnwconstruction@gmail.com',
        image: 'https://jandrnw.com/assets/home-hero-bg.jpg',
        priceRange: '$$',
        openingHours: 'Mo-Fr 07:00-18:00',
        address: { '@type': 'PostalAddress', addressLocality: 'Beaverton', addressRegion: 'OR', addressCountry: 'US' },
        geo: { '@type': 'GeoCoordinates', latitude: 45.4871, longitude: -122.8037 },
        areaServed: { '@type': 'City', name: 'Beaverton', sameAs: 'https://en.wikipedia.org/wiki/Beaverton,_Oregon' },
        hasCredential: 'Oregon CCB #232708',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '50', bestRating: '5' },
        sameAs: ['https://www.facebook.com/JRNWConstruction/'],
        makesOffer: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Siding Installation Beaverton OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hardie Board Beaverton OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'LP SmartSide Beaverton OR' } },
        ],
    },
};

export default function SidingContractorBeaverton() {
    return <CityLandingPage data={PAGE_DATA} />;
}
