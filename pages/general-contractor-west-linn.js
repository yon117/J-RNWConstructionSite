import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'General Contractor West Linn OR | Home Renovation & Repair | J&R NW Construction',
    description: 'General contractor in West Linn, OR. Kitchen remodels, bathroom renovations, structural repairs & water damage restoration. Serving Robinwood, Willamette, Bolton & all West Linn neighborhoods. CCB #232708. Call (503) 998-2340.',
    canonical: '/general-contractor-west-linn',

    h1: 'General Contractor',
    h1Em: 'West Linn, OR',
    subtitle: "West Linn has some of the most demanding terrain in the Portland metro — steep lots, mature landscaping, and homes that require a contractor who understands hillside construction. J&R NW serves West Linn homeowners with quality renovation and repair work.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.6651!3d45.3648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495067efc8cc0c9%3A0x9ed2c7832e21e25d!2sWest%20Linn%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "West Linn Renovation — Hillside Sites, Established Homes, High Expectations",
    whyPoints: [
        "West Linn's homes sit on terrain that requires more care than flat suburban lots — retaining walls, hillside drainage, and foundation systems adapted to slope. Before we open walls or start a renovation, we understand the site. This matters when you're dealing with a 1970s home on a slope above the Willamette.",
        "The housing stock ranges from mid-century Willamette district homes to larger Robinwood properties from the 1980s and 1990s. Both age ranges are actively renovated — and both have structural and moisture considerations that require an experienced contractor rather than a handyman.",
        "West Linn permitting runs through Clackamas County and the City of West Linn. We handle the permit applications, inspections, and final documentation. You get the sign-off paperwork for your files at project close.",
    ],

    neighborhoods: [
        'Robinwood', 'Willamette', 'Bolton',
        'Tanner Basin', 'Sunset', 'Rosemont Ridge',
        'Hidden Springs', 'Marylhurst', 'Stafford border',
    ],

    services: [
        {
            num: '01', cat: 'KITCHEN', name: 'Kitchen Remodel',
            desc: 'Full kitchen renovation from layout to finish. West Linn kitchens often involve sloped floor corrections and structural modifications to open floor plans — we handle the structural work in-house.',
        },
        {
            num: '02', cat: 'BATH', name: 'Bathroom Renovation',
            desc: 'Tile work, shower conversions, primary suite expansions. Precise finish work that holds up in West Linn\'s humid hillside environment — proper waterproofing behind every tile installation.',
        },
        {
            num: '03', cat: 'WATER DAMAGE', name: 'Water Damage Restoration',
            desc: 'Diagnose source, remediate, and reconstruct. Hillside West Linn properties see moisture intrusion from uphill runoff, drainage failures, and roof penetrations — we find the source before we repair the damage.',
        },
        {
            num: '04', cat: 'STRUCTURAL', name: 'Structural Repairs',
            desc: 'Crawl space post and beam work, dry rot repair, cripple wall bracing. West Linn\'s older homes on sloped lots often have deferred structural maintenance — we assess and fix it properly.',
        },
        {
            num: '05', cat: 'EXTERIOR', name: 'Siding & Exterior Work',
            desc: 'Siding replacement, rot remediation, exterior painting. West Linn\'s wooded environment creates aggressive moisture conditions for exterior materials — we use proper materials and installation methods that last.',
        },
        {
            num: '06', cat: 'GENERAL', name: 'General Home Repairs',
            desc: 'Deck restoration, door replacements, drywall, trim, and ongoing home maintenance. West Linn homeowners who want one contractor they trust for repairs as they come up.',
        },
    ],

    faqs: [
        {
            cat: 'Hillside', q: 'My West Linn home is on a steep lot — does that make renovation more complicated?',
            a: "It adds considerations but doesn't make renovation impossible. Steep lots can mean moisture infiltration on the uphill side, uneven floors from soil movement, and access challenges for material delivery. We account for these in scope and scheduling — no surprises mid-project.",
        },
        {
            cat: 'Age', q: 'My Willamette district home is from the 1960s — what should I expect before starting a renovation?',
            a: "A crawl space inspection and assessment of the electrical and plumbing systems before committing to renovation scope. 1960s West Linn homes often have knob-and-tube or early aluminum wiring, original galvanized plumbing, and crawl space framing that hasn't been looked at in decades. Know what you're dealing with first.",
        },
        {
            cat: 'Permits', q: 'How does West Linn permitting work?',
            a: "City of West Linn has its own building department. Structural, electrical, and plumbing work all requires permits. We submit applications, coordinate inspections, and hand you the final documentation. Don't skip permits on West Linn renovation — it creates real problems at resale.",
        },
        {
            cat: 'Cost', q: 'Are renovation costs higher in West Linn than other Portland suburbs?',
            a: "Labor and materials are the same — but hillside access, site complexity, and the older housing stock sometimes add scope that flat suburban projects don't have. We give you a detailed written estimate so you understand what's driving cost before work starts.",
        },
        {
            cat: 'Timeline', q: 'How far out are you typically scheduling for West Linn projects?',
            a: "Estimates within 1–2 weeks. Project starts vary — smaller repairs can often start within a week, permitted renovations typically 3–5 weeks out depending on permit timeline and material lead times.",
        },
    ],
};

export default function GeneralContractorWestLinn() {
    return <CityLandingPage data={PAGE_DATA} />;
}
