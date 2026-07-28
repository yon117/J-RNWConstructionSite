import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'General Contractor Hillsboro OR | Remodeling & Restoration | J&R NW Construction',
    description: 'Licensed general contractor in Hillsboro, OR. Kitchen & bathroom remodels, water damage restoration, siding, painting & structural repairs. Free estimates. CCB #232708. Call (503) 998-2340.',
    canonical: '/general-contractor-hillsboro',

    h1: 'General Contractor',
    h1Em: 'Hillsboro, OR',
    subtitle: "Hillsboro is one of Oregon's fastest-growing cities — but that growth means a lot of homes with builder-grade finishes, deferred maintenance, and water damage that got missed during the inspection. We fix what the builder left behind and deliver the quality the market demands.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.9898!3d45.5229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495091e4b88c517%3A0x23a47e0e8c9d0f4d!2sHillsboro%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Why Hillsboro Homeowners Choose J&R",
    whyPoints: [
        "Hillsboro has two distinct housing markets: older neighborhoods near downtown and Reedville with 1950s–70s homes needing full updates, and the newer Orenco Station, Tanasbourne, and South Hillsboro corridor where homeowners want quality finishes their production builder didn't provide. We work in both.",
        "We're Oregon-licensed (CCB #232708) and we pull permits. That matters when you're in a market where resale value depends on documented, permitted work — a handshake job done cheap now costs double when the buyer's inspector finds it.",
        "Our crew handles framing, drywall, finish carpentry, tile, and most finish trades in-house. Fewer subcontractors means better quality control, faster timelines, and a single point of accountability for the whole project.",
    ],

    neighborhoods: [
        'Orenco Station', 'Tanasbourne', 'Reedville',
        'Quatama', 'South Hillsboro', 'Cedar Mill',
        'Aloha', 'North Plains', 'Witch Hazel',
    ],

    services: [
        {
            num: '01', cat: 'REMODELING', name: 'Kitchen & Bathroom Remodels',
            desc: "Full gut remodels to targeted upgrades — demo, framing adjustments, tile, cabinets, countertops, and finish work. We coordinate plumbing and electrical rough-ins so you're dealing with one contractor, not three.",
        },
        {
            num: '02', cat: 'RESTORATION', name: 'Water Damage Restoration',
            desc: 'Fast response to burst pipes, appliance leaks, and roof water intrusion. We handle the complete cycle: demo wet materials, dry the structure, rebuild to pre-loss condition — one contractor, documented from start to finish for insurance.',
        },
        {
            num: '03', cat: 'EXTERIOR', name: 'Siding Installation & Repair',
            desc: 'Hardie board, LP SmartSide, and vinyl siding for Hillsboro homes. We replace rotted sheathing before new siding goes on — not over it. Proper flashing at all transitions, sealed penetrations, and moisture barrier installation.',
        },
        {
            num: '04', cat: 'PAINTING', name: 'Interior & Exterior Painting',
            desc: 'Full surface prep, spot prime, and two-coat finish on interiors and exteriors. Proper prep is what makes paint last 10 years instead of 2 — caulk, sand, seal, then paint. Not the other way around.',
        },
        {
            num: '05', cat: 'STRUCTURAL', name: 'Structural Repairs & Dry Rot',
            desc: 'Post replacement, beam repair, dry rot remediation, and structural framing repairs. We assess the actual load path, repair what needs it, and document everything — important for both safety and resale.',
        },
        {
            num: '06', cat: 'REPAIRS', name: 'General Repairs & Carpentry',
            desc: 'Deck repair and replacement, door and window installation, interior trim work, drywall patches, fence repair. The list of things that need attention in any home is long — we work through it systematically.',
        },
    ],

    faqs: [
        {
            cat: 'New Builds', q: 'Do you fix issues in newer Hillsboro production homes?',
            a: "Yes — including warranty-period issues that builders are slow to address and post-warranty problems that show up after you've owned the home a few years. Builder-grade finishes, inadequate flashing, and skipped insulation are common in Hillsboro's growth corridors. We fix it properly.",
        },
        {
            cat: 'Scheduling', q: 'How far in advance should I book for a Hillsboro project?',
            a: "For planned remodels, 2–4 weeks advance notice gives us time to scope accurately and schedule your project properly. Emergency water damage response is same-day — call (503) 998-2340 directly. Don't wait on water damage.",
        },
        {
            cat: 'Permits', q: 'Are you familiar with Hillsboro building permit requirements?',
            a: "Yes. We work with Washington County and the City of Hillsboro regularly. Permit requirements in Hillsboro differ from Portland in some areas — we know which projects require permits here, and we pull them. Unpermitted work creates problems at resale.",
        },
        {
            cat: 'Project Size', q: 'Do you take smaller repair jobs in Hillsboro, or only full remodels?',
            a: "We take both. No project minimum. That said, full remodels and restoration projects get priority scheduling. Small repairs — a leaking window, rotted deck boards, a bathroom tile repair — we handle those too, usually within a week or two.",
        },
        {
            cat: 'Insurance', q: 'Do you work with insurance for water damage in Hillsboro?',
            a: "Yes. We document damage with photos and written scope, coordinate directly with your adjuster, and provide the line-item documentation insurers require. We've worked with most major carriers. The goal is to get your home restored correctly, not just quickly.",
        },
    ],
};

export default function GeneralContractorHillsboro() {
    return <CityLandingPage data={PAGE_DATA} />;
}
