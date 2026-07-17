import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Structural Support & Repair Gresham OR | Foundation & Framing Repair | J&R NW Construction',
    description: 'Structural repair contractor in Gresham, OR. Post & beam replacement, dry rot framing repair, foundation bolting & structural assessment. Licensed CCB #232708. Free estimates. Call (503) 998-2340.',
    canonical: '/structural-repair-gresham',

    h1: 'Structural Support & Repair',
    h1Em: 'Gresham, OR',
    subtitle: "Gresham's post-war housing stock is aging into its 60s and 70s. Pier-and-beam foundations built during the 1950s–70s suburban expansion are showing rot, settling, and deflection. We assess what's actually failing and fix the structure — not the symptoms.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.4302!3d45.5001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495787e773c3b15%3A0x2ceaa1e581c5ee56!2sGresham%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Gresham's Structural Reality — 70 Years of Oregon Weather Takes a Toll",
    whyPoints: [
        "Gresham grew rapidly during the 1950s and 1960s as Portland expanded east. Tract homes in Rockwood, Centennial, and central Gresham were built fast, with minimal crawl space treatment and wood posts sitting directly on concrete pads — no standoffs, no moisture barriers. After 60+ years of Oregon's wet winters, those post bases are rotting from the bottom up.",
        "Gresham's east location means more temperature variation than Portland — colder winters, drier summers — causing more expansion and contraction cycling in foundation systems. Over decades, this works connections loose and opens gaps in sill plates that were never properly sealed.",
        "We trace structural problems to their source: moisture, settling, or overloading. Then we fix the cause before addressing the damage — replacing rotted posts, sistering joists, and reinforcing connections with proper hardware rated for Oregon conditions.",
    ],

    neighborhoods: [
        'Rockwood', 'Centennial', 'West Gresham',
        'East Gresham', 'Gresham Butte', 'Pleasant Valley',
        'Jenne Butte', 'North Gresham', 'Kelly Creek',
    ],

    services: [
        {
            num: '01', cat: 'DRY ROT', name: 'Structural Dry Rot Repair',
            desc: 'Remove rotted posts, sill plates, rim joists, and beams in Gresham crawl spaces. We probe for soft wood, trace the moisture source, fix it, then replace compromised framing with properly treated lumber — not just surface treatment.',
        },
        {
            num: '02', cat: 'POSTS', name: 'Crawl Space Post Replacement',
            desc: 'Jack the load, remove deteriorated wood posts, and replace with adjustable steel columns on proper pad footings — eliminating the wood-to-concrete contact that causes rot in Gresham\'s older homes.',
        },
        {
            num: '03', cat: 'FRAMING', name: 'Floor Joist Sistering & Repair',
            desc: 'Sister new dimensional lumber alongside deflected or damaged floor joists to restore stiffness and load capacity. Fixes soft or springy floors without requiring subfloor removal from above.',
        },
        {
            num: '04', cat: 'SEISMIC', name: 'Foundation Bolting & Cripple Wall Bracing',
            desc: 'Anchor bolts connecting the mudsill to the foundation and plywood shear panels on cripple walls — the primary seismic retrofit for Gresham\'s pre-1980 housing stock. Reduces risk of lateral movement in a Cascadia event.',
        },
        {
            num: '05', cat: 'FRAMING', name: 'Beam & Header Replacement',
            desc: 'Replace undersized or deteriorated beams and install properly engineered headers over openings — permitted work that documents the load path for insurance and future buyers.',
        },
        {
            num: '06', cat: 'ASSESSMENT', name: 'Pre-Renovation Structural Assessment',
            desc: 'Written assessment of crawl space framing before a remodel — common in Gresham where renovation reveals hidden damage. Know what you\'re dealing with before the walls come down.',
        },
    ],

    faqs: [
        {
            cat: 'Signs', q: 'What structural warning signs are common in older Gresham homes?',
            a: "Floors that have developed a noticeable bounce or slope since you moved in, doors in the middle of the house that started sticking or dragging, gaps opening between the baseboard and the floor in specific areas, or visible lean in a post when you get in the crawl space. These indicate movement — find the cause before it gets worse.",
        },
        {
            cat: 'Rockwood', q: 'Are homes in Rockwood and Centennial at higher risk for structural problems?',
            a: "The density of post-war housing in Rockwood and Centennial, combined with deferred maintenance in the neighborhood, means structural issues in these areas are common. Older homes that haven't had the crawl space inspected in 10+ years often have surprises. We recommend a proactive inspection rather than waiting for visible symptoms.",
        },
        {
            cat: 'Permits', q: 'Does structural repair in Gresham require permits?',
            a: "Structural work in Gresham is permitted through the City of Gresham Building Division. Beam replacement, post replacement, and any work that modifies the load path requires permits and inspections. We pull the permits, coordinate the inspections, and provide you documentation. Unpermitted structural work creates serious problems at resale.",
        },
        {
            cat: 'Staging', q: 'Can you stage structural repairs while I still live in the house?',
            a: "Yes. Crawl space work is isolated below the living space and doesn't displace you. We work in sections so the load is always supported. Most Gresham structural repairs complete in 3–7 days with minimal disruption to daily life.",
        },
        {
            cat: 'Cost', q: 'How much does structural repair cost in a Gresham home?',
            a: "Depends entirely on what we find. Single post replacement can be $400–$800 including labor and materials. Widespread dry rot requiring multiple posts, sill plate sections, and joist sistering can run $5,000–$15,000. We give you a written estimate after assessment — not a range that doubles when work starts.",
        },
    ],
};

export default function StructuralRepairGresham() {
    return <CityLandingPage data={PAGE_DATA} />;
}
