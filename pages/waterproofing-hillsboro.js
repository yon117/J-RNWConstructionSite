import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Waterproofing Services Hillsboro OR | Crawl Space Encapsulation | J&R NW Construction',
    description: 'Waterproofing contractor in Hillsboro, OR. Crawl space encapsulation, vapor barriers, interior drainage & sump pumps for Hillsboro homes. Free estimates. CCB #232708. Call (503) 998-2340.',
    canonical: '/waterproofing-hillsboro',

    h1: 'Waterproofing Services',
    h1Em: 'Hillsboro, OR',
    subtitle: "Hillsboro's flat terrain and former farmland soil create drainage problems even in newer homes. Production-grade vapor barriers fail within 10–15 years. We install commercial-grade encapsulation systems built to last in Oregon's climate.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.9898!3d45.5229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495091e4b88c517%3A0x23a47e0e8c9d0f4d!2sHillsboro%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Hillsboro's Drainage Problem Is Different From Portland",
    whyPoints: [
        "Unlike hillside lots in Portland, Hillsboro's flat terrain means water doesn't drain away from foundations naturally. It pools. South Hillsboro and Tanasbourne developments were built on former agricultural land — flat, with high seasonal water tables in the Tualatin Valley.",
        "Many homes in the Orenco Station, Quatama, and Reedville corridors were built with standard 6-mil poly vapor barriers that weren't designed for 15+ Oregon winters. These barriers degrade, tear at seams, and allow ground moisture to evaporate directly into floor framing.",
        "We upgrade to reinforced encapsulation systems with sealed seams, perimeter drainage where needed, and sump systems that actively manage water — not just slow it down.",
    ],

    neighborhoods: [
        'Orenco Station', 'Tanasbourne', 'South Hillsboro',
        'Quatama', 'Reedville', 'Cedar Mill',
        'Witch Hazel', 'North Plains', 'Aloha',
    ],

    services: [
        {
            num: '01', cat: 'ENCAPSULATION', name: 'Crawl Space Encapsulation',
            desc: 'Full encapsulation with thick, reinforced vapor barrier sealed to all foundation walls and penetrations. Proper overlap at seams, fastened along the perimeter — not just laid flat on dirt.',
        },
        {
            num: '02', cat: 'DRAINAGE', name: 'Interior Perimeter Drainage',
            desc: 'Perforated drain channel installed along the crawl space perimeter at footing level, intercepting infiltrating groundwater and directing it to a sump collection point before it contacts framing.',
        },
        {
            num: '03', cat: 'DRAINAGE', name: 'Sump Pump Installation & Replacement',
            desc: 'New sump pump installation with battery backup for Hillsboro homes without existing systems, plus replacement of failed or undersized pumps in homes that already have a pit.',
        },
        {
            num: '04', cat: 'VAPOR', name: 'Vapor Barrier Upgrade',
            desc: 'Replace failed or builder-grade poly sheeting with a properly installed, commercial-grade vapor barrier — sealed at all wall transitions, lapped at seams, and secured so it works long-term.',
        },
        {
            num: '05', cat: 'FOUNDATION', name: 'Foundation Crack Sealing',
            desc: 'Hydraulic cement and waterproof sealant applied to cracks in poured concrete or concrete block foundations that are actively admitting water or showing efflorescence.',
        },
        {
            num: '06', cat: 'MOLD', name: 'Mold Prevention & Treatment',
            desc: 'Inspect framing for mold or mildew growth caused by chronic moisture, treat affected surfaces, and implement a waterproofing plan that prevents recurrence — not just masks it.',
        },
    ],

    faqs: [
        {
            cat: 'New Homes', q: 'My Hillsboro home is less than 20 years old — why do I have moisture in the crawl space?',
            a: "Production builders install the minimum required vapor barrier — typically 6-mil poly — which degrades in 10–15 years. Hillsboro's flat terrain also means poor natural drainage around foundations. Newer doesn't mean waterproofed.",
        },
        {
            cat: 'Neighborhoods', q: 'Which areas of Hillsboro have the worst crawl space moisture problems?',
            a: "South Hillsboro new developments sit on former agricultural land with high water tables in winter. Quatama and Tanasbourne subdivisions see pooling around foundations due to flat grading. Orenco Station has older encapsulation starting to fail in homes from the early 2000s.",
        },
        {
            cat: 'Landscaping', q: 'Do you have to disturb my landscaping to waterproof?',
            a: "Interior drainage and encapsulation work is done entirely from inside the crawl space — no exterior excavation, no landscaping disruption. Exterior foundation work requires targeted excavation, but we work in sections to minimize yard impact.",
        },
        {
            cat: 'Timing', q: 'How long does crawl space encapsulation take in Hillsboro?',
            a: "Most Hillsboro crawl space encapsulations take 1–2 days depending on square footage and access. Adding an interior drainage system adds another half-day to a full day. We give you a timeline with the estimate.",
        },
        {
            cat: 'Cost', q: 'Is crawl space encapsulation worth it in a newer Hillsboro home?',
            a: "Yes — moisture damage to framing and subfloor is significantly more expensive to fix than encapsulation. It also improves energy efficiency and indoor air quality. Most homeowners recover the cost in reduced HVAC bills and avoided repairs within a few years.",
        },
    ],
};

export default function WaterproofingHillsboro() {
    return <CityLandingPage data={PAGE_DATA} />;
}
