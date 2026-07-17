import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'General Contractor Tigard OR | Remodeling, Repairs & Renovation | J&R NW Construction',
    description: 'General contractor in Tigard, OR. Kitchen and bathroom remodels, water damage repair, structural work & home improvements. Serving Bull Mountain, Metzger, Summerfield & all Tigard neighborhoods. CCB #232708. Call (503) 998-2340.',
    canonical: '/general-contractor-tigard',

    h1: 'General Contractor',
    h1Em: 'Tigard, OR',
    subtitle: "Tigard is one of the most active renovation markets in the Portland metro — diverse housing stock, established neighborhoods, and homeowners who are investing in properties they plan to stay in. J&R NW works throughout Tigard.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.7712!3d45.4312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950a9e5b786ddf%3A0x60f23b7f3a8e62c!2sTigard%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Tigard Renovation — From 1960s Ranch Homes to Bull Mountain New Construction",
    whyPoints: [
        "Tigard's housing ranges from 1960s ranch homes in Metzger and Summerfield to larger Bull Mountain homes from the 1990s and 2000s. Both segments are active renovation markets — older homes being upgraded before sale or for long-term ownership, and newer homes being customized.",
        "Tigard sits at the junction of Washington County and the City of Tigard permitting jurisdictions. We know which department your project falls under and handle permitting without pushing that research onto you.",
        "We're close. Jobs in Tigard aren't a long haul for us — faster response for estimates, faster starts, and no hour-minimum travel charges built into your quote.",
    ],

    neighborhoods: [
        'Bull Mountain', 'Metzger', 'Summerfield',
        'Walnut Grove', 'Durham', 'Tigard Triangle',
        'Progress Ridge', 'King City', 'Tualatin border',
    ],

    services: [
        {
            num: '01', cat: 'KITCHEN', name: 'Kitchen Remodel',
            desc: 'Kitchen updates and full renovations — layout changes, cabinet replacement, countertop installation, tile backsplash, and appliance rough-in. Structural modifications handled in-house when needed.',
        },
        {
            num: '02', cat: 'BATH', name: 'Bathroom Renovation',
            desc: 'Tile replacement, shower conversions, vanity work, and layout changes. Tigard homeowners adding second bathrooms or expanding primary suites — we scope and permit correctly.',
        },
        {
            num: '03', cat: 'WATER DAMAGE', name: 'Water Damage Repair',
            desc: 'Assess, remediate, and reconstruct after water damage — whether from plumbing failure, roof leaks, or crawl space moisture intrusion that reached living space.',
        },
        {
            num: '04', cat: 'STRUCTURAL', name: 'Structural Repairs',
            desc: 'Dry rot repair, post replacement, beam installation, cripple wall bracing. Common in Tigard\'s older housing stock — we find the structural cause, not just the cosmetic effect.',
        },
        {
            num: '05', cat: 'EXTERIOR', name: 'Siding & Exterior Improvements',
            desc: 'Siding replacement, exterior painting, and rot remediation. Many Tigard homes have original wood or T-111 siding approaching end of life — full replacement with modern materials and proper weather barrier.',
        },
        {
            num: '06', cat: 'GENERAL', name: 'General Repairs & Home Improvements',
            desc: 'Deck repairs, door and window replacements, drywall, finish carpentry, and everything else. One call for property owners who want a reliable contractor they can keep using.',
        },
    ],

    faqs: [
        {
            cat: 'Range', q: 'What size jobs do you take in Tigard — only large remodels or smaller repairs too?',
            a: "Both. We take kitchen and bathroom renovations, water damage repairs, structural work, and smaller repairs that don't require extensive permits. No minimum job size. If it's too small to be worth your time to find a specialist, it's worth a call to us.",
        },
        {
            cat: 'Permits', q: 'Tigard seems to have complicated permitting — is that true?',
            a: "Tigard has its own building department and Washington County jurisdiction can overlap depending on where in Tigard you are. It's manageable when you know the system. We determine which department is relevant, submit the application, and coordinate the inspections. Not your problem to figure out.",
        },
        {
            cat: 'Bull Mountain', q: 'I have a Bull Mountain home from the early 2000s — does it need structural work before a renovation?',
            a: "Probably not structural, but worth a crawl space check if you haven't done one in a while. 2000s construction is generally solid, but we see water intrusion issues in Bull Mountain homes from hillside drainage. Better to know before renovating than discover it when walls are open.",
        },
        {
            cat: 'Timeline', q: 'How quickly can you start work in Tigard?',
            a: "Estimates within 1–2 weeks of contact. Start dates depend on scope and permit timelines — small repairs can often start the same week. Permitted renovations typically start 3–5 weeks out.",
        },
        {
            cat: 'Insurance', q: 'Do you work with homeowner insurance for water damage claims?',
            a: "Yes. We document damage thoroughly, provide written estimates formatted for insurance adjusters, and can work directly with your insurer on scope and payment. We don't inflate scopes to chase insurance money — we fix what needs fixing.",
        },
    ],
};

export default function GeneralContractorTigard() {
    return <CityLandingPage data={PAGE_DATA} />;
}
