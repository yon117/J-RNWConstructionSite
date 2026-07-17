import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Waterproofing Services Portland OR | Crawl Space & Foundation | J&R NW Construction',
    description: 'Licensed waterproofing contractor in Portland, OR. Crawl space encapsulation, vapor barriers, sump pump installation & foundation drainage. Free estimates. CCB #232708. Call (503) 998-2340.',
    canonical: '/waterproofing-portland',

    h1: 'Waterproofing Services',
    h1Em: 'Portland, OR',
    subtitle: "Portland gets 36+ inches of rain a year — most of it between October and April. Clay soil holds water against your foundation. We seal it out permanently with proper drainage, vapor barriers, and encapsulation systems built for the Pacific Northwest.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89488.0!2d-122.6765!3d45.5231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950b0b7da97427%3A0x1c36b9e6f6d18591!2sPortland%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Why Portland Crawl Spaces Fail Every Winter",
    whyPoints: [
        "Portland's Willamette Valley soil is heavy with clay — it doesn't drain, it holds water against foundation walls and floor assemblies all winter. Homes built before 1970 have little to no waterproofing. That moisture gets into framing, creates mold, and rots floor joists from below.",
        "Most crawl spaces in SE, NE, and North Portland have bare-earth floors or failed 6-mil poly sheets that were never sealed to the walls. Ground moisture evaporates upward into framing constantly — even when it hasn't rained in weeks.",
        "We don't apply band-aids. We diagnose the drainage pattern, install a system that intercepts water before it reaches your structure, and encapsulate the crawl space so ground moisture has nowhere to go.",
    ],

    neighborhoods: [
        'SE Portland', 'NE Portland', 'North Portland',
        'Sellwood-Moreland', 'St. Johns', 'Woodstock',
        'Montavilla', 'Sunnyside', 'Hawthorne',
    ],

    services: [
        {
            num: '01', cat: 'ENCAPSULATION', name: 'Crawl Space Encapsulation',
            desc: 'Full encapsulation with 20-mil reinforced vapor barrier, sealed and fastened to foundation walls, piers, and penetrations. No gaps, no loose edges — the barrier works as a system, not just a sheet on dirt.',
        },
        {
            num: '02', cat: 'DRAINAGE', name: 'Interior Perimeter Drainage',
            desc: 'French drain channels installed along the crawl space perimeter below grade, directing infiltrating water to a sump collection point before it reaches floor joists or concrete blocks.',
        },
        {
            num: '03', cat: 'DRAINAGE', name: 'Sump Pump Installation',
            desc: 'Submersible sump pumps with battery backup installed in a proper sump pit — so water is actively removed even during the power outages that hit Portland hardest during winter storms.',
        },
        {
            num: '04', cat: 'FOUNDATION', name: 'Exterior Foundation Waterproofing',
            desc: 'Excavation, surface prep, waterproof membrane application, and drainage board installation on the exterior face of the foundation — stopping water at its entry point rather than managing it inside.',
        },
        {
            num: '05', cat: 'VAPOR', name: 'Vapor Barrier Replacement',
            desc: 'Remove old, failed, or improperly installed poly sheeting and replace with a properly overlapped and sealed system — lapped at seams, fastened to all walls, and sealed around every pipe and pier.',
        },
        {
            num: '06', cat: 'MOLD', name: 'Mold Remediation + Waterproofing',
            desc: 'When moisture has already caused mold on joists or framing, we remediate the mold first using approved methods, then address the moisture source permanently so it cannot return.',
        },
    ],

    faqs: [
        {
            cat: 'Signs', q: 'How do I know if my Portland crawl space needs waterproofing?',
            a: "Musty or earthy smell in your living areas, soft or springy floors, condensation on pipes under the house, visible mold or dark staining on floor joists, or efflorescence (white mineral deposits) on concrete foundation walls are all signs. You don't need to see standing water — chronic humidity is enough to cause serious damage over time.",
        },
        {
            cat: 'Permits', q: 'Does waterproofing in Portland require permits?',
            a: "Interior drainage systems and vapor barrier installation typically don't require permits. Exterior excavation and foundation work may require a permit from the City of Portland Bureau of Development Services depending on scope. We assess this at the inspection and handle the paperwork when needed.",
        },
        {
            cat: 'Cost', q: 'What does crawl space encapsulation cost in Portland?',
            a: "Every crawl space is different — access, square footage, current moisture levels, and whether mold remediation is needed all affect the price. Typical range for Portland homes is $3,500–$9,000. We give you a written line-item estimate after a free on-site inspection — no guessing, no hidden fees.",
        },
        {
            cat: 'Mold', q: 'Will waterproofing fix my mold problem?',
            a: "Waterproofing prevents future mold by removing the moisture source, but it doesn't kill or remove existing mold colonies. If mold is present, we remediate first — then waterproof. Doing it in the wrong order just traps the problem behind a barrier.",
        },
        {
            cat: 'Timing', q: 'Can you waterproof during winter in Portland?',
            a: "Yes. Interior drainage and encapsulation work proceeds year-round. Exterior excavation has some weather constraints, but most Portland waterproofing projects are interior-focused and fully schedulable in winter — which is exactly when homeowners notice the problem.",
        },
    ],
};

export default function WaterproofingPortland() {
    return <CityLandingPage data={PAGE_DATA} />;
}
