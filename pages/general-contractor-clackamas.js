import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'General Contractor Clackamas OR | Home Repair & Renovation | J&R NW Construction',
    description: 'General contractor serving Clackamas, OR. Kitchen remodels, bathroom updates, water damage repair, structural work & home improvements. Serving Sunnyside, Carver & surrounding Clackamas County areas. CCB #232708. Call (503) 998-2340.',
    canonical: '/general-contractor-clackamas',

    h1: 'General Contractor',
    h1Em: 'Clackamas, OR',
    subtitle: "Clackamas is growing. New subdivisions, established neighborhoods near Happy Valley, and older rural properties on the county fringe all have different needs — and we work across all of them.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.5685!3d45.4024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950c2fcaa0ea91%3A0xfdb7d3b3b8e5c0be!2sClackamas%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Clackamas County — Diverse Properties, One Reliable Contractor",
    whyPoints: [
        "Clackamas is unincorporated Clackamas County — permitting runs through the county building department rather than a city, which catches some homeowners off guard. We know the county process and handle it without pushing the administrative burden onto you.",
        "The area's housing mix is genuinely diverse: 1970s ranch homes in established pockets near Sunnyside Road, newer subdivision construction near Clackamas Town Center, and older farmhouse-style properties on the county fringe near Carver. We work across all of it.",
        "Proximity to Happy Valley and Oregon City means Clackamas homeowners have access to a growing labor market — but also increasing renovation activity that means good contractors have full schedules. We take Clackamas jobs and treat them the same as Portland work.",
    ],

    neighborhoods: [
        'Sunnyside', 'Carver', 'Happy Valley border',
        'Clackamas Town Center area', 'Oregon City border',
        'Rock Creek', 'Boring border', 'Pleasant Valley',
        'Damascus corridor',
    ],

    services: [
        {
            num: '01', cat: 'KITCHEN', name: 'Kitchen Remodel',
            desc: 'Full kitchen renovations and targeted updates — cabinet replacement, countertops, tile work, layout changes. Clackamas County permits handled in-house.',
        },
        {
            num: '02', cat: 'BATH', name: 'Bathroom Renovation',
            desc: 'Tile replacement, shower conversions, vanity upgrades, and full bathroom renovations. Older Clackamas homes often have original 1970s bathrooms — full replacement is often better value than patching.',
        },
        {
            num: '03', cat: 'WATER DAMAGE', name: 'Water Damage Repair',
            desc: 'Source assessment, remediation, and reconstruction. Rural and semi-rural Clackamas properties sometimes have deferred maintenance that allows water infiltration to go undetected — we find it and fix it.',
        },
        {
            num: '04', cat: 'STRUCTURAL', name: 'Structural Repairs',
            desc: 'Post replacement, dry rot repair, joist sistering, cripple wall bracing. Older Clackamas rural properties often have crawl space framing that hasn\'t been inspected in decades.',
        },
        {
            num: '05', cat: 'EXTERIOR', name: 'Siding & Exterior Repairs',
            desc: 'Siding replacement, exterior painting, rot remediation. Clackamas properties with mature trees and shaded exposures see aggressive moisture damage to exterior wood — we address it fully, not temporarily.',
        },
        {
            num: '06', cat: 'GENERAL', name: 'General Home Repairs',
            desc: 'Deck work, door replacements, drywall, finish carpentry, and general improvements. Available for both one-time projects and ongoing property maintenance.',
        },
    ],

    faqs: [
        {
            cat: 'Permits', q: 'Clackamas is unincorporated county — how does permitting work?',
            a: "Clackamas County has its own building department at 150 Beavercreek Road in Oregon City. Most structural, electrical, and plumbing work requires county permits. We submit the applications, coordinate the inspections, and give you the final paperwork. Unincorporated county permitting is different from city processes — but not harder when you know the system.",
        },
        {
            cat: 'Rural', q: 'I have an older rural property on the Clackamas fringe — do you work on those?',
            a: "Yes. Older farmhouse-style properties, properties with outbuildings, and homes on larger lots are all work we take. Rural properties sometimes have deferred maintenance that accumulates because the house 'functions' despite problems — we assess what's actually there and prioritize realistically.",
        },
        {
            cat: 'New Construction Area', q: 'My Clackamas home is newer (2000s) — why would I need repairs?',
            a: "Newer homes need maintenance too — water damage from plumbing failures, roof aging, and crawl space issues from drainage that wasn't properly engineered in subdivision development. The claim that newer homes don't need work usually lasts until something fails.",
        },
        {
            cat: 'Insurance', q: 'Can you help with insurance claims for storm or water damage?',
            a: "Yes. We document damage, provide written estimates in a format useful for insurance adjusters, and coordinate on scope. We don't manufacture damage to inflate claims — we document what's there and repair it properly.",
        },
        {
            cat: 'Timeline', q: 'How quickly can you respond to a Clackamas job?',
            a: "Estimates typically within 1–2 weeks. Emergency situations with active water intrusion or structural safety concerns — call us directly and we'll prioritize assessment. Non-emergency project starts are 2–4 weeks out depending on current schedule and permit timelines.",
        },
    ],
};

export default function GeneralContractorClackamas() {
    return <CityLandingPage data={PAGE_DATA} />;
}
