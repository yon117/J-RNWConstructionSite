import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'General Contractor Lake Oswego OR | Kitchen, Bath & Home Renovation | J&R NW Construction',
    description: 'General contractor in Lake Oswego, OR. Kitchen remodels, bathroom renovations, water damage repair, structural work & more. CCB #232708. Serving Iron Mountain, Palisades & all LO neighborhoods. Call (503) 998-2340.',
    canonical: '/general-contractor-lake-oswego',

    h1: 'General Contractor',
    h1Em: 'Lake Oswego, OR',
    subtitle: "Lake Oswego's mid-century and 1970s homes are being renovated to modern standards — larger kitchens, updated primary suites, finished basements. J&R NW does quality renovation work in Lake Oswego's high-value market.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.6707!3d45.4207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950b99e13e3a5f%3A0x8882f1af9427b6ec!2sLake%20Oswego%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Lake Oswego Renovation Requires a Contractor Who Matches the Market",
    whyPoints: [
        "Lake Oswego has a high concentration of 1960s–1980s homes that are architecturally interesting but functionally dated — original galley kitchens, single-pane windows, compartmentalized floor plans. Renovation scope in LO typically runs larger than adjacent markets, and buyers and owners expect quality that shows.",
        "Homes near Oswego Lake, in Iron Mountain, and in Palisades often have hillside sites with drainage considerations and older structural systems that need assessment before major renovation. We don't start opening walls in a Lake Oswego home without knowing what's behind them.",
        "CCB licensed, insured, and experienced with Clackamas County permits. Renovation work in Lake Oswego goes through the City of Lake Oswego's permitting department — we know the process and handle it without delays that cost you time and money.",
    ],

    neighborhoods: [
        'Iron Mountain', 'Lake Grove', 'Palisades',
        'Westlake', 'Lakewood Bay', 'Lake Forest',
        'Bryant', 'Stafford', 'Oswego Lake corridor',
    ],

    services: [
        {
            num: '01', cat: 'KITCHEN', name: 'Kitchen Remodel',
            desc: 'Full kitchen renovation — layout reconfiguration, cabinet replacement, countertops, tile, appliance rough-in, and finish work. We do structural work in-house when walls need to come out, so there\'s one contractor, one schedule, one point of accountability.',
        },
        {
            num: '02', cat: 'BATH', name: 'Bathroom Renovation',
            desc: 'Primary suite expansions, secondary bath updates, tile replacement, shower conversions. Lake Oswego homes benefit from quality fixture selections and precise tile work — we work to that standard.',
        },
        {
            num: '03', cat: 'WATER DAMAGE', name: 'Water Damage Restoration',
            desc: 'Assessment, remediation, and reconstruction after water intrusion. Hillside LO homes can develop chronic moisture problems in lower levels — we address the source and restore affected areas.',
        },
        {
            num: '04', cat: 'STRUCTURAL', name: 'Structural Repairs & Renovations',
            desc: 'Load-bearing wall modifications, beam installation, post replacement, foundation bolting. Licensed structural work with permits — documented for insurance and resale.',
        },
        {
            num: '05', cat: 'EXTERIOR', name: 'Siding, Painting & Exterior Work',
            desc: 'Siding replacement, exterior painting, trim repair, and rot remediation. Lake Oswego\'s wooded lots and year-round moisture mean exterior maintenance is ongoing — we do it right so it lasts.',
        },
        {
            num: '06', cat: 'GENERAL', name: 'General Home Repairs & Improvements',
            desc: 'Deck repairs, door replacements, drywall, finish carpentry, and general improvements. For Lake Oswego homeowners who want a reliable contractor for ongoing work rather than searching for a new one every project.',
        },
    ],

    faqs: [
        {
            cat: 'Scope', q: 'Do you take on large kitchen renovations in Lake Oswego — not just small repairs?',
            a: "Yes. Full kitchen renovations including layout changes, structural modifications, full cabinetry and countertop replacement, and finish work. We also pull the permits and handle inspections. Lake Oswego kitchen renovations typically run $35,000–$85,000+ depending on scope — we give you a detailed written estimate before any commitment.",
        },
        {
            cat: 'Permits', q: 'How does permitting work in Lake Oswego?',
            a: "City of Lake Oswego has its own building department separate from Clackamas County. Structural work, electrical, and plumbing modifications all require permits. We handle the permit applications, coordinate with inspectors, and provide you the final inspection sign-off for your records. Don't let a contractor skip permits on Lake Oswego renovation work.",
        },
        {
            cat: 'Hillside', q: 'My Lake Oswego home is on a hillside — does that affect renovation scope?',
            a: "Often yes. Hillside homes may have retaining considerations, drainage that needs attention during renovation, and structural systems that respond differently to load changes. We assess before we demo — not after. This avoids surprises mid-project that expand your budget without expanding your scope.",
        },
        {
            cat: 'Timeline', q: 'How far out are you typically scheduled for Lake Oswego projects?',
            a: "Usually 2–4 weeks for assessments and estimates. Project start depends on scope — smaller repairs can often start within a week; major renovations typically start 3–6 weeks out while permits process and materials are ordered.",
        },
        {
            cat: 'Coordination', q: 'Do you coordinate subcontractors (electricians, plumbers) or do I need to hire those separately?',
            a: "We coordinate licensed subcontractors when the work requires them. You have one point of contact — us — not three different contractors on different schedules. Subcontractors we use regularly are licensed and carry their own insurance.",
        },
    ],
};

export default function GeneralContractorLakeOswego() {
    return <CityLandingPage data={PAGE_DATA} />;
}
