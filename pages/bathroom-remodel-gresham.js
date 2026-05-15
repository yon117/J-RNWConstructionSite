import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Bathroom Remodeling Gresham OR | Custom Bath Contractor | J&R NW Construction',
    description: 'Expert bathroom remodeling in Gresham, OR. Tile, waterproofing, full gut remodels. Free estimates. Licensed CCB #232708. Call (503) 998-2340.',
    canonical: '/bathroom-remodel-gresham',

    h1: 'Bathroom Remodeling',
    h1Em: 'Gresham, OR',
    subtitle: "Old tile, failing grout, and water-damaged walls — we gut Gresham bathrooms down to the studs and rebuild them right. Waterproof, code-compliant, and built to last 20+ years.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44916.0!2d-122.4306!3d45.5023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495756e3b7f0a79%3A0x3b9a3e9e8c2c0eea!2sGresham%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: 'Gresham Bathroom Remodel Experts',
    whyPoints: [
        "Hidden water damage behind Gresham's older bathroom tile is our specialty — we find the rot, replace the backer, and rebuild properly instead of tiling over a failing substrate.",
        "Waterproof cement backer, RedGard membrane, new tile set in mortar — done to Multnomah County code and fully permitted so your home's value is protected.",
        'We document all water damage findings in writing — critical for insurance claims on water-damaged bathrooms and for your own records.',
    ],

    neighborhoods: [
        'Rockwood', 'Pleasant Valley', 'Powell Valley', 'Centennial',
        'Fairview', 'Troutdale', 'Wood Village',
    ],

    services: [
        {
            num: '01', cat: 'BATHROOM', name: 'Full Bathroom Gut & Remodel',
            desc: "Everything out to the studs — backer, tile, fixtures, vanity, tub or shower. Inspect for rot and mold, treat it, then rebuild with modern waterproofing from the floor up.",
        },
        {
            num: '02', cat: 'TILE', name: 'Tile Installation & Waterproofing',
            desc: 'Cement backer, waterproof membrane, and tile set in proper thinset — installed flat and level. Grout sealed for longevity. Walk-in showers, tub surrounds, and floor tile.',
        },
        {
            num: '03', cat: 'SHOWER', name: 'Shower & Tub Replacement',
            desc: 'Remove the old tub or one-piece shower, inspect the subfloor, waterproof the niche and curb, and install the new unit properly sealed and caulked.',
        },
        {
            num: '04', cat: 'RESTORATION', name: 'Water Damage Repair Behind Tile',
            desc: "When grout fails, water gets in. We remove the tile, measure moisture in the drywall and subfloor, replace everything compromised, and tile over solid substrate.",
        },
        {
            num: '05', cat: 'FIXTURES', name: 'Vanity, Plumbing & Electrical',
            desc: 'Vanity installation, faucet and drain rough-in, exhaust fan upgrade, and GFCI outlets to code. We coordinate all trades so you have one point of contact.',
        },
        {
            num: '06', cat: 'DRYWALL', name: 'Drywall & Paint Finishing',
            desc: 'Moisture-resistant drywall in all wet areas, smooth finish, and paint. Clean lines at every transition — ceiling, trim, and tile edge finished with precision.',
        },
    ],

    faqs: [
        {
            cat: 'Timeline', q: 'How long does a bathroom remodel take in Gresham?',
            a: "A standard bathroom remodel runs 2-4 weeks. Master bathrooms and full gut remodels with significant water damage repair can run 4-8 weeks. We give you a realistic schedule — not a best-case estimate.",
        },
        {
            cat: 'Water Damage', q: 'What if there is water damage behind my tile?',
            a: "Very common in Gresham's older homes. We remove all affected tile and backer, measure moisture levels, replace rotted drywall and subfloor, treat for mold if found, and document everything in writing. We never tile over a problem.",
        },
        {
            cat: 'Permits', q: 'Do bathroom remodels in Gresham require permits?',
            a: 'Any plumbing, electrical, or structural work requires a Multnomah County permit. We pull all permits, schedule inspections, and handle every code requirement — you never have to deal with the city.',
        },
        {
            cat: 'Insurance', q: 'Can I use insurance for bathroom water damage repair?',
            a: 'Yes — if the water damage came from a sudden event (burst pipe, appliance failure), your homeowners policy typically covers it. We document the damage thoroughly and work with your adjuster to approve full scope coverage.',
        },
    ],

    schema: {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
        name: 'J&R NW Construction LLC — Bathroom Remodeling Gresham',
        description: 'Expert bathroom remodeling in Gresham, OR. Tile, waterproofing, full gut remodels.',
        url: 'https://jandrnw.com/bathroom-remodel-gresham',
        telephone: '+15039982340',
        email: 'jandrnwconstruction@gmail.com',
        image: 'https://jandrnw.com/assets/home-hero-bg.jpg',
        priceRange: '$$',
        openingHours: 'Mo-Fr 07:00-18:00',
        address: { '@type': 'PostalAddress', addressLocality: 'Gresham', addressRegion: 'OR', addressCountry: 'US' },
        geo: { '@type': 'GeoCoordinates', latitude: 45.5023, longitude: -122.4306 },
        areaServed: { '@type': 'City', name: 'Gresham', sameAs: 'https://en.wikipedia.org/wiki/Gresham,_Oregon' },
        hasCredential: 'Oregon CCB #232708',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '50', bestRating: '5' },
        sameAs: ['https://www.facebook.com/JRNWConstruction/'],
        makesOffer: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bathroom Remodeling Gresham OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tile Installation Gresham OR' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shower Replacement Gresham OR' } },
        ],
    },
};

export default function BathroomRemodelGresham() {
    return <CityLandingPage data={PAGE_DATA} />;
}
