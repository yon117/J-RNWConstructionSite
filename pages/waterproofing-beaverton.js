import CityLandingPage from '../components/CityLandingPage';

const PAGE_DATA = {
    title: 'Waterproofing Services Beaverton OR | Crawl Space & Vapor Barrier | J&R NW Construction',
    description: 'Waterproofing contractor in Beaverton, OR. Crawl space encapsulation, vapor barrier replacement, sump pumps & drainage for Beaverton homes. Free estimates. CCB #232708. Call (503) 998-2340.',
    canonical: '/waterproofing-beaverton',

    h1: 'Waterproofing Services',
    h1Em: 'Beaverton, OR',
    subtitle: "Beaverton's 1960s–80s ranch homes were built with crawl spaces and minimal moisture protection. Forty years later, those original vapor barriers are failing — and wood rot follows. We replace, seal, and encapsulate properly.",

    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44739.0!2d-122.8037!3d45.4871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950e04e5a3e7cf%3A0x89d47c7501cf3a0a!2sBeaverton%2C%20OR!5e0!3m2!1sen!2sus',

    whyTitle: "Why Beaverton Crawl Spaces Fail After 30+ Years",
    whyPoints: [
        "Beaverton's post-war and 1970s tract housing was built with vapor barriers that were state-of-the-art for their time — thin poly sheeting laid loosely on dirt. After 40 years of Oregon winters, those barriers are torn, degraded, and no longer continuous. Ground moisture rises unimpeded into floor framing.",
        "The areas near Beaverton Creek and the low-lying sections of Raleigh Hills and Cedar Hills have seasonally elevated water tables. When soils saturate in November and stay wet through April, crawl spaces in these neighborhoods see persistent moisture intrusion regardless of how the home is graded.",
        "We don't patch failed barriers. We remove the old material, prep the substrate, and install a sealed encapsulation system — barrier fastened to walls, lapped and taped at seams, with drainage where the moisture load warrants it.",
    ],

    neighborhoods: [
        'Cedar Hills', 'Raleigh Hills', 'Greenway',
        'Murrayhill', 'Cooper Mountain', 'Sexton Mountain',
        'Aloha', 'Sunset', 'Progress Ridge',
    ],

    services: [
        {
            num: '01', cat: 'ENCAPSULATION', name: 'Full Crawl Space Encapsulation',
            desc: 'Reinforced vapor barrier installed continuously across the crawl space floor, lapped up foundation walls, sealed and fastened at the perimeter. No gaps, no floating edges — encapsulation as a closed system.',
        },
        {
            num: '02', cat: 'VAPOR', name: 'Vapor Barrier Replacement',
            desc: 'Remove degraded original poly sheeting and replace with properly overlapped, sealed, and fastened heavy-duty barrier. We clean the crawl space before installation — not just lay new material over old.',
        },
        {
            num: '03', cat: 'DRAINAGE', name: 'Interior Perimeter Drainage',
            desc: 'Perforated drain channel installed at footing level in crawl spaces with active water intrusion, directing infiltration to a sump pit rather than allowing it to pool under the floor system.',
        },
        {
            num: '04', cat: 'DRAINAGE', name: 'Sump Pump Installation',
            desc: 'Submersible sump pump with battery backup in a proper pit — so water collected by the drainage system is actively removed. Battery backup handles the storm power outages that coincide with peak water intrusion.',
        },
        {
            num: '05', cat: 'VENTILATION', name: 'Crawl Space Ventilation Assessment',
            desc: 'Inspect existing vents for blockage, damage, or inadequate coverage. Recommend whether the crawl space is better served by ventilation repair or full conditioned encapsulation — and explain the tradeoffs honestly.',
        },
        {
            num: '06', cat: 'MOLD', name: 'Mold Treatment & Prevention',
            desc: 'Treat mold on joists and framing using EPA-registered products before encapsulating. Encapsulation without treating existing mold traps the problem rather than solving it.',
        },
    ],

    faqs: [
        {
            cat: 'Age', q: 'My Beaverton home was built in the 1970s — is the original vapor barrier still okay?',
            a: "Almost certainly not. Standard 6-mil poly from the 1970s and 1980s has a functional life of 15–25 years under normal conditions. Most of that material is now degraded, torn at seams, and no longer sealed to walls. It's providing minimal protection. A replacement is overdue.",
        },
        {
            cat: 'Water Table', q: 'Why does water get into my crawl space even when I have a vapor barrier?',
            a: "A vapor barrier slows ground moisture evaporation but does not stop groundwater infiltration. If water is physically entering the crawl space through the foundation walls or along the footing, you need drainage — not just a barrier. We assess both sources and address them separately.",
        },
        {
            cat: 'Cost', q: 'How much does crawl space encapsulation cost in Beaverton?',
            a: "Beaverton homes typically run $3,500–$8,500 depending on square footage, access conditions, and whether drainage is needed. We give you a written estimate after a free on-site inspection — not a range off a website.",
        },
        {
            cat: 'DIY', q: 'Can I just lay a new poly sheet over the old one?',
            a: "You can, but it won't perform like a proper encapsulation. Old material under new creates air pockets, the new sheet won't seal to walls, and any existing mold is now trapped underneath. The right approach is removal, treatment if needed, then proper installation of new material.",
        },
        {
            cat: 'Timing', q: 'How long does waterproofing take in a Beaverton ranch home?',
            a: "Vapor barrier replacement alone is typically one day. Full encapsulation with drainage installation is 1.5–2 days. We schedule to minimize disruption and leave the crawl space access clean when we're done.",
        },
    ],
};

export default function WaterproofingBeaverton() {
    return <CityLandingPage data={PAGE_DATA} />;
}
