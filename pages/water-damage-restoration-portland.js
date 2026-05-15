import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Water Damage Restoration Portland OR | Same-Day Response | J&R NW Construction',
    description: '24/7 water damage restoration in Portland, OR. Burst pipes, flooding, mold remediation. Same-day emergency response. Licensed CCB #232708. Call (503) 998-2340.',
    canonical: '/water-damage-restoration-portland',

    h1: 'Water Damage Restoration',
    h1Em: 'Portland, OR',
    subtitle: "Portland's rainy season means burst pipes, flooding, and hidden mold. We respond same-day, stop the damage, and rebuild — start to finish under one contract.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89459.0!2d-122.6784!3d45.5051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950b0b7da97427%3A0x1c36b9e6f6d18591!2sPortland%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Portland's Rain Creates Real Damage",
    whyPoints: [
        'Oregon averages 144 rainy days per year — water intrusion is the #1 home damage cause in the Portland metro area.',
        'We extract water, dry the structure, test for mold, and fully rebuild — one crew, one contract, no gaps between trades.',
        'Insurance documentation handled start to finish — we have worked with every major carrier and know what adjusters need to approve full scope.',
    ],

    neighborhoods: [
        'SE Portland', 'NE Portland', 'North Portland', 'Gresham',
        'Troutdale', 'Fairview', 'Wood Village', 'Maywood Park',
    ],

    services: [
        {
            num: '01', cat: 'EMERGENCY', name: 'Emergency Water Extraction',
            desc: 'Same-day response to burst pipes, appliance failures, and storm flooding. We extract standing water immediately and prevent further saturation.',
        },
        {
            num: '02', cat: 'MITIGATION', name: 'Structural Drying & Mitigation',
            desc: 'Industrial drying equipment, moisture meters, and air movers deployed throughout the structure. We document every reading for your insurance claim.',
        },
        {
            num: '03', cat: 'RESTORATION', name: 'Full Reconstruction & Rebuild',
            desc: 'Drywall replacement, antimicrobial treatment, flooring, paint — everything removed and rebuilt to code. You get a finished home, not a half-done job site.',
        },
    ],

    faqs: [
        {
            cat: 'Response', q: 'How fast do you respond to water damage in Portland?',
            a: "Same day, every time. We keep crews available for water damage emergencies throughout the Portland metro. Call (503) 998-2340 and we'll confirm our ETA immediately.",
        },
        {
            cat: 'Mold', q: 'Can water damage cause mold in Portland homes?',
            a: 'Yes — and quickly. Mold colonies begin forming within 24-48 hours of saturation. Portland homes are especially vulnerable due to humidity levels. We test for mold and treat it before rebuilding.',
        },
        {
            cat: 'Insurance', q: 'Will my homeowners insurance cover water damage restoration?',
            a: 'Most policies cover sudden water damage from burst pipes and appliance failures. We work directly with your adjuster, document the full scope, and make sure nothing gets missed on the claim.',
        },
        {
            cat: 'Process', q: 'Do you handle everything from water extraction to final rebuild?',
            a: "Yes. We are a full-service contractor — not just a mitigation company. We extract, dry, treat, rebuild, and finish. One call, one crew, one contract. No handing you off to another company.",
        },
    ],

    schema: {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'EmergencyService'],
        name: 'J&R NW Construction LLC — Water Damage Restoration Portland',
        description: '24/7 water damage restoration in Portland, OR. Burst pipes, flooding, mold remediation. Same-day emergency response.',
        url: 'https://jandrnw.com/water-damage-restoration-portland',
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
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Water Damage Restoration Portland OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Emergency Flood Cleanup Portland OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mold Remediation Portland OR' } },
        ],
    },
};

export default function WaterDamageRestorationPortland() {
    return <CityLandingPage data={PAGE_DATA} />;
}
