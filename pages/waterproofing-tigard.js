import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Waterproofing Services Tigard OR | Crawl Space Encapsulation & Drainage | J&R NW Construction',
    description: 'Waterproofing contractor in Tigard, OR. Crawl space encapsulation, vapor barriers, interior drainage & sump pumps. Serving Bull Mountain, Metzger & surrounding areas. CCB #232708. Call (503) 998-2340.',
    canonical: '/waterproofing-tigard',

    h1: 'Waterproofing Services',
    h1Em: 'Tigard, OR',
    subtitle: "Tigard's housing spans 1960s ranch homes in Metzger to newer Bull Mountain construction — but crawl space moisture problems appear in both. Oregon winters don't care how new or old the house is. We install systems that last.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.7712!3d45.4312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950a9e5b786ddf%3A0x60f23b7f3a8e62c!2sTigard%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Tigard's Waterproofing Problem Spans Every Decade of Housing",
    whyPoints: [
        "Older Metzger and Summerfield homes from the 1960s–70s have original vapor barriers that are long past their service life. These crawl spaces often have wood posts sitting directly on concrete without standoffs, wicking moisture into the post base — invisible rot that weakens the structure before anyone notices.",
        "Newer Bull Mountain construction sits at elevation, but slope grading means rainwater follows the hillside and concentrates along foundation walls. Even homes built in the 1990s and 2000s can have chronic wet crawl spaces if the grading or drainage wasn't engineered properly.",
        "The Tualatin River floodplain in lower Tigard creates seasonally high water tables that push upward through crawl space floors — no amount of grading fixes that without active drainage and a proper sump system.",
    ],

    neighborhoods: [
        'Bull Mountain', 'Metzger', 'Summerfield',
        'Walnut Grove', 'Durham', 'Tigard Triangle',
        'Progress Ridge', 'King City', 'Tualatin border',
    ],

    services: [
        {
            num: '01', cat: 'ENCAPSULATION', name: 'Crawl Space Encapsulation',
            desc: 'Sealed encapsulation system with heavy-duty vapor barrier fastened continuously to foundation walls and sealed at all penetrations. Designed for Oregon winters — not just Oregon summers.',
        },
        {
            num: '02', cat: 'DRAINAGE', name: 'Interior French Drain System',
            desc: 'Perforated perimeter drain channel at footing level, directing infiltrating groundwater to a sump before it contacts framing or creates standing water under the floor.',
        },
        {
            num: '03', cat: 'DRAINAGE', name: 'Sump Pump Installation',
            desc: 'Submersible pump with battery backup installed in a proper collection pit — active water removal rather than passive moisture management. Critical for low-lying Tigard properties near the Tualatin floodplain.',
        },
        {
            num: '04', cat: 'VAPOR', name: 'Vapor Barrier Upgrade',
            desc: 'Replace builder-grade or aged poly sheeting with a properly sealed heavy-duty replacement — lapped seams, wall fastening, and sealed penetrations for a continuous moisture barrier.',
        },
        {
            num: '05', cat: 'POSTS', name: 'Post Base Inspection & Treatment',
            desc: 'Inspect crawl space posts for moisture wicking and rot at the base. Treat affected wood, install proper post bases with standoffs where missing, and document findings for homeowner records.',
        },
        {
            num: '06', cat: 'MOLD', name: 'Mold Remediation + Waterproofing',
            desc: 'Identify and treat mold on framing using EPA-registered products, then install waterproofing to address the moisture source. Permanent fix — not a temporary cosmetic treatment.',
        },
    ],

    faqs: [
        {
            cat: 'Bull Mountain', q: 'My Bull Mountain home is on a hillside — why is my crawl space wet?',
            a: "Slope grading concentrates surface runoff along the uphill foundation wall. Even with gutters and proper landscaping, heavy Oregon rain events overwhelm surface drainage and push water against the foundation. Interior perimeter drainage intercepting that water before it enters is the reliable solution.",
        },
        {
            cat: 'Floodplain', q: 'My Tigard property is near the Tualatin River — what does that mean for waterproofing?',
            a: "Low-lying Tigard properties near the Tualatin floodplain have seasonal water table rise that pushes upward through the crawl space floor — not just infiltrating through walls. That requires active sump drainage to manage, not just a vapor barrier. We assess the source during inspection.",
        },
        {
            cat: 'Older Homes', q: 'What are signs of moisture damage in a 1970s Tigard home?',
            a: "Musty smell in the living area that gets worse in winter, soft spots in the floor, post bases in the crawl space that feel soft when you probe them, or visible dark staining on joists. Any one of these warrants an inspection — all of them together means action is overdue.",
        },
        {
            cat: 'Cost', q: 'How much does waterproofing cost in Tigard?',
            a: "Depends on crawl space size, access, and what the moisture source requires. Most Tigard homes run $3,500–$8,000 for encapsulation. Adding interior drainage adds cost but is often necessary in lower-elevation properties. Written estimate after free inspection — every time.",
        },
        {
            cat: 'Timeline', q: 'How quickly can you schedule waterproofing in Tigard?',
            a: "Typically 1–2 weeks for scheduled work. If you're seeing active water intrusion during a rain event, call us — we can assess quickly and prioritize water intrusion situations.",
        },
    ],
};

export default function WaterproofingTigard() {
    return <CityLandingPage data={PAGE_DATA} />;
}
