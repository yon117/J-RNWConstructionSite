import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Structural Support & Repair Portland OR | Foundation & Beam Repair | J&R NW Construction',
    description: 'Structural repair contractor in Portland, OR. Foundation bolting, post & beam replacement, cripple wall bracing, dry rot framing repair. Licensed CCB #232708. Free estimates. Call (503) 998-2340.',
    canonical: '/structural-repair-portland',

    h1: 'Structural Support & Repair',
    h1Em: 'Portland, OR',
    subtitle: "Most Portland homes were built between 1905 and 1960 on pier-and-beam foundations with old-growth Douglas fir framing. Decades of moisture and Oregon's seismic exposure take a toll. We assess the real condition and fix what's actually failing.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89488.0!2d-122.6765!3d45.5231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950b0b7da97427%3A0x1c36b9e6f6d18591!2sPortland%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Portland's Structural Reality — What Most Contractors Miss",
    whyPoints: [
        "Portland's bungalows, craftsman homes, and mid-century houses were built with pier-and-beam systems that weren't designed for 70+ years of Oregon's wet-dry cycles. Posts rot from the base. Beams deflect. Sill plates absorb moisture from concrete and deteriorate from below — invisible until a floor starts to sag.",
        "The Cascadia Subduction Zone puts the Portland metro in a moderate-to-high seismic hazard zone. Pre-1980 homes often have unbraced cripple walls — the short stud walls between foundation and first floor — that fail in lateral movement, causing the house to slide off the foundation.",
        "We trace the actual load path from roof to foundation, identify where it's compromised, and repair the structure properly — not cosmetically. That means permits, inspections, and documentation that holds up for insurance and resale.",
    ],

    neighborhoods: [
        'SE Portland', 'NE Portland', 'Irvington',
        'Alberta Arts District', 'Sellwood-Moreland', 'Woodstock',
        'Richmond', 'Hawthorne', 'Mississippi', 'St. Johns',
    ],

    services: [
        {
            num: '01', cat: 'DRY ROT', name: 'Structural Dry Rot Repair',
            desc: 'Remove and replace rotted posts, sill plates, rim joists, and beams. We trace the moisture source — leaking pipe, failed flashing, or grade drainage — address it, then replace compromised framing with properly treated lumber and sealed connections.',
        },
        {
            num: '02', cat: 'FRAMING', name: 'Post & Beam Replacement',
            desc: 'Safely jack and shore the load above, remove and replace failed posts or deteriorated beams in crawl spaces and basement framing. Full load transfer handled before any cuts — no shortcuts on structural support.',
        },
        {
            num: '03', cat: 'SEISMIC', name: 'Cripple Wall Bracing & Foundation Bolting',
            desc: 'Install plywood shear panels on cripple walls and anchor bolts connecting the mudsill to the foundation — the most critical seismic retrofit for Portland homes built before 1980. Reduces risk of the house sliding off the foundation in a major earthquake.',
        },
        {
            num: '04', cat: 'FRAMING', name: 'Header & Structural Beam Installation',
            desc: 'Install properly sized structural headers over new or widened openings, carry beams to correct bearing points, and install appropriate hardware — permits pulled, inspections passed.',
        },
        {
            num: '05', cat: 'CRAWL SPACE', name: 'Crawl Space Post Replacement',
            desc: 'Replace deteriorated wood posts on concrete pads with adjustable steel columns — eliminates future rot potential and allows for proper height adjustment as the structure settles.',
        },
        {
            num: '06', cat: 'ASSESSMENT', name: 'Structural Condition Assessment',
            desc: 'Written report documenting the condition of posts, beams, sill plates, floor joists, and foundation connections. Useful for real estate transactions, insurance documentation, or before starting a major remodel.',
        },
    ],

    faqs: [
        {
            cat: 'Warning Signs', q: 'What are the signs of structural problems in Portland homes?',
            a: "Springy or soft floors that weren't always that way, doors or windows that stick or no longer close squarely, diagonal cracks in drywall at corners of window and door openings, visible gaps between baseboard and floor, or a floor that slopes noticeably in one direction. None of these are cosmetic — they indicate movement in the structure below.",
        },
        {
            cat: 'Permits', q: 'Do structural repairs in Portland require permits?',
            a: "Yes — most structural work in Portland requires a permit from the Bureau of Development Services. This includes beam replacement, cripple wall bracing, and header installation. We pull the permit, coordinate the inspection, and give you documentation. Permitted work is the only kind that satisfies insurance companies and future buyers.",
        },
        {
            cat: 'Seismic', q: 'Is my Portland home at risk in an earthquake?',
            a: "Homes built before 1980 that have not been seismically retrofitted are at significant risk from a major Cascadia event. The most vulnerable point is the cripple wall — if it's unbraced, the house can slide off the foundation. Foundation bolting and cripple wall bracing is the most cost-effective seismic upgrade available for Portland's housing stock.",
        },
        {
            cat: 'Timeline', q: 'How long does structural repair take?',
            a: "Dry rot repair to isolated posts or sill plates typically takes 2–4 days. Full cripple wall bracing takes 1–2 days. Larger beam replacement work involving jacking and shoring can take 1–2 weeks. We give you a specific timeline with the estimate after seeing the actual scope.",
        },
        {
            cat: 'Living', q: 'Can I stay in my home during structural repairs?',
            a: "In most cases, yes. Crawl space work is isolated below the living space. When we're jacking or shoring a section, there may be a few hours where the area above is off-limits, but we plan around your schedule to minimize disruption.",
        },
    ],
};

export default function StructuralRepairPortland() {
    return <CityLandingPage data={PAGE_DATA} />;
}
