import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Structural Support & Repair Beaverton OR | Beam, Post & Dry Rot Repair | J&R NW Construction',
    description: 'Structural repair contractor in Beaverton, OR. Dry rot framing repair, post & beam replacement, floor joist sistering & structural assessment. CCB #232708. Free estimates. Call (503) 998-2340.',
    canonical: '/structural-repair-beaverton',

    h1: 'Structural Support & Repair',
    h1Em: 'Beaverton, OR',
    subtitle: "Beaverton's 1970s tract homes are hitting the age where crawl space structural damage becomes common. Renovation reveals what inspectors miss. We find what's actually failing and fix it with the right materials — not just accessible surfaces.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.8037!3d45.4871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950e04e5a3e7cf%3A0x89d47c7501cf3a0a!2sBeaverton%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Why Beaverton's 1970s Housing Stock Is Hitting a Structural Inflection Point",
    whyPoints: [
        "Beaverton expanded rapidly in the early-to-mid 1970s, producing large tracts of ranch homes with crawl space foundations. Those homes are now 45–55 years old. Wood posts on concrete pads without standoffs, minimal crawl space ventilation, and no vapor barriers were standard at the time — and the cumulative moisture exposure is now producing structural dry rot at the post bases and sill plates.",
        "Renovation activity in Cedar Hills, Raleigh Hills, and the Sunset corridor is accelerating — and demolition regularly reveals structural damage that wasn't visible during purchase inspections. Rotted sill plates behind siding, sagging beams under subfloor, soft rim joists — these don't show up on a surface inspection.",
        "We assess crawl space framing with the same rigor as a new construction inspector: every accessible post checked, sill plates probed, beams visually evaluated, and joist hangers inspected. Written documentation of findings you can act on.",
    ],

    neighborhoods: [
        'Cedar Hills', 'Raleigh Hills', 'Sunset',
        'Aloha', 'Murrayhill', 'Cooper Mountain',
        'Sexton Mountain', 'Greenway', 'West Slope',
    ],

    services: [
        {
            num: '01', cat: 'DRY ROT', name: 'Structural Dry Rot Repair',
            desc: 'Probe, identify, and replace rotted posts, sill plates, rim joists, and beams. We trace moisture back to its source — whether a drainage issue, failed vapor barrier, or plumbing leak — and address it before framing replacement.',
        },
        {
            num: '02', cat: 'POSTS', name: 'Post Replacement with Steel Columns',
            desc: 'Remove wood posts on concrete pads and replace with adjustable steel columns on proper footings — eliminating the wood-to-concrete contact that has been wicking moisture into post bases for decades in Beaverton crawl spaces.',
        },
        {
            num: '03', cat: 'JOISTS', name: 'Floor Joist Sistering',
            desc: 'Sister full-length dimensional lumber alongside deflected, cracked, or notched floor joists to restore structural stiffness without removing subfloor or disturbing the living space above.',
        },
        {
            num: '04', cat: 'SEISMIC', name: 'Cripple Wall Bracing & Foundation Bolting',
            desc: 'Plywood shear panels on cripple walls and anchor bolts at the mudsill — seismic retrofit that significantly reduces risk of lateral failure in Beaverton\'s pre-1980 housing stock during a major seismic event.',
        },
        {
            num: '05', cat: 'FRAMING', name: 'Renovation Structural Support',
            desc: 'Structural modifications to support renovation work: opening walls, relocating load-bearing points, installing temporary shoring, and installing new beams to carry redirected loads — permitted and inspected.',
        },
        {
            num: '06', cat: 'ASSESSMENT', name: 'Pre-Purchase Structural Inspection',
            desc: 'Detailed crawl space assessment for buyers considering a Beaverton home. Written report on post, beam, sill plate, and joist condition — goes beyond a standard home inspection and gives you real data before closing.',
        },
    ],

    faqs: [
        {
            cat: 'Renovation', q: 'I\'m renovating a 1970s Beaverton home and found structural damage during demo — what now?',
            a: "Stop work in that area, document what you found with photos, and call us for an assessment. Structural damage found during renovation is common in Beaverton's older housing stock. We can assess quickly, give you a scope and cost, and integrate the repair into your renovation timeline so you're not waiting weeks.",
        },
        {
            cat: 'Inspection', q: 'My home inspection didn\'t flag any structural issues — why should I get a crawl space assessment?',
            a: "Standard home inspectors do a visual surface inspection — they're not in the crawl space probing posts and sill plates with a moisture meter and awl. Soft rot in a post base doesn't show until you test it. Pre-purchase structural assessments by a contractor who does this work regularly catch things that general inspectors miss.",
        },
        {
            cat: 'Steel Columns', q: 'Why replace wood posts with steel columns instead of treated wood?',
            a: "Pressure-treated wood is better than untreated, but it still absorbs moisture over decades of contact with concrete. Steel adjustable columns eliminate the wood-to-concrete interface entirely. They're also adjustable post-installation if settling occurs. For a one-time fix, steel is the right material.",
        },
        {
            cat: 'Permits', q: 'Does structural repair in Beaverton need permits?',
            a: "Structural work in Beaverton goes through Washington County or the City of Beaverton depending on jurisdiction. Post replacement for minor dry rot may not require a permit; beam work and cripple wall bracing typically does. We determine what's required during the estimate and handle permitting when needed.",
        },
        {
            cat: 'Timeline', q: 'How long does structural repair take in a typical Beaverton ranch home?',
            a: "Isolated post replacement: 1–2 days. Widespread dry rot with multiple posts and sill plate sections: 3–5 days. Full cripple wall bracing: 1–2 days. If we're integrating with a renovation, we coordinate timing with your project schedule.",
        },
    ],
};

export default function StructuralRepairBeaverton() {
    return <CityLandingPage data={PAGE_DATA} />;
}
