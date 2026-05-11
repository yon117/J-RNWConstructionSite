// API endpoint to fetch reviews from Yelp
// Implements caching to reduce API calls

// Simple in-memory cache
let reviewsCache = {
    data: null,
    timestamp: null,
    ttl: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

// Helper function to get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Helper function to format relative time
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp * 1000; // Convert to milliseconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    return 'Recently';
}

// Fetch reviews from Yelp Fusion API
async function fetchYelpReviews() {
    const apiKey = process.env.YELP_API_KEY;
    const businessId = process.env.YELP_BUSINESS_ID;

    if (!apiKey || !businessId) {
        console.log('Yelp API credentials not configured');
        return [];
    }

    try {
        const url = `https://api.yelp.com/v3/businesses/${businessId}/reviews`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const data = await response.json();

        if (!data.reviews) {
            console.error('Yelp API error:', data.error);
            return [];
        }

        // Transform Yelp reviews to our format
        return data.reviews.map((review, index) => ({
            id: `yelp-${index}`,
            name: review.user.name,
            platform: 'Yelp',
            rating: review.rating,
            date: getRelativeTime(new Date(review.time_created).getTime() / 1000),
            text: review.text,
            avatar: getInitials(review.user.name)
        }));
    } catch (error) {
        console.error('Error fetching Yelp reviews:', error);
        return [];
    }
}

// Sample fallback reviews (Yelp Only)
const sampleReviews = [
    {
        id: "real-stefan",
        name: "Stefan N.",
        platform: "Yelp",
        rating: 5,
        date: "3/14/26",
        text: "Highly recommended. Professional, timely, good quality, and competitive pricing. We had a basement water leak after heavy rains. We scanned through Yelp and took a chance with J&R NW Construction based on recent positive reviews. Julio immediately picked up our phone call and was at our place in 30 minutes. After an assessment, he followed up with a contract and got his team scheduled for later in the day. The crew did a quality job. J&R is going into our contacts list for future home improvement/repair projects!",
        avatar: "SN"
    },
    {
        id: "real-jeff",
        name: "Jeff F.",
        platform: "Yelp",
        rating: 5,
        date: "1/31/26",
        text: "I can confidently recommend J&R NW Construction for your next project. Our family engaged Julio's team (a family affair) to remediate water that was entering our home and resulting in mold growth behind our walls. They came the same day we called them, gave us a report on the issues and a detailed estimate of what it would take to bring it back to normal. Their team communicated every day about status of arrivals, even notifying us if they were going to be late. The quality of their work has been exceptional. Overall the best people, very professional, quality work and deep expertise in codes and construction practices. Having worked most of my life with contractors, they stand out as one of the best we've worked with. We'll be using them again for sure!",
        avatar: "JF"
    },
    {
        id: "real-marcia",
        name: "Marcia M.",
        platform: "Yelp",
        rating: 5,
        date: "1/23/26",
        text: "We began by hiring Julio and his crew to replace siding on our garage. When they finished, we mentioned that we needed the exterior of our house painted. After completing that, they repaired and replaced posts on our patio cover, power washed and painted the woodwork and fiberglass cover. It looks like new and we have far more light than before. Julio and his team were courteous, professional and hard working. They consulted with me about each step of the tasks and their workmanship was excellent. In spite of having several jobs at the same time, they kept in close contact and finished each of our tasks on schedule. We intend to hire them again for any work we need in the future.",
        avatar: "MM"
    },
    {
        id: "real-1",
        name: "John J.",
        platform: "Yelp",
        rating: 5,
        date: "1/8/26",
        text: "Very happy with the bathroom project remodel. Minor communication issues early but I would recommend them for a good job and reasonable cost. Did a good job recommending options where appropriate. Definitely would recommend to others and we would gladly use again.",
        avatar: "JJ"
    },
    {
        id: "real-2",
        name: "Kamran M.",
        platform: "Yelp",
        rating: 5,
        date: "12/14/25",
        text: "Great quality work, communication as well as reasonable rates. Would use them again. Julio and his were also very fast in getting the job done. Thank you",
        avatar: "KM"
    },
    {
        id: "real-3",
        name: "Tyler Z.",
        platform: "Yelp",
        rating: 5,
        date: "12/5/25",
        text: "Couldn't recommend J&R NW Construction enough! We hired J&R NW Construction to work on our aging detached garage. We had been noticing an increase in water intrusion as well as the structure not being sealed from pests. Julio, the business owner, came out to the property to get...",
        avatar: "TZ"
    },
    {
        id: "real-4",
        name: "Jeremy B.",
        platform: "Yelp",
        rating: 5,
        date: "11/18/25",
        text: "Recently hired the team for some investigation and remediation on an external wall that looked to be leaking. After a quick walk through, they got to work. They finished the work in half the time estimated and, when they discovered mold as well, we were able to work out a good deal for remediation on that as well...",
        avatar: "JB"
    },
    {
        id: "real-5",
        name: "Adrian R.",
        platform: "Yelp",
        rating: 5,
        date: "11/13/25",
        text: "We hired J&R NW Construction, and Julio and his team were incredibly knowledgeable based on what we needed done. Julio and his team are professional and friendly. I definitely recommend working with them for your next project. They were able to fix our roof flashing and resolve our leak issue. Thank you, J&R NW Construction!",
        avatar: "AR"
    },
    {
        id: "real-6",
        name: "Fred K.",
        platform: "Yelp",
        rating: 5,
        date: "10/4/25",
        text: "We first contacted J&R NW Construction for an estimate while we were looking for contractors to assist us with several of our home renovation projects. We had three different major projects to get bids upon and Julio was one of the several construction company representatives who responded to our calls. He was on time for our in home meeting and impressed...",
        avatar: "FK"
    },
    {
        id: "real-7",
        name: "John Z.",
        platform: "Yelp",
        rating: 5,
        date: "8/25/25",
        text: "Provided high quality reconstruction of my garage after an electrical fire. Scope included wood repair, door replacement, insulation, Sheetrock, and painting. Work completed on a tight schedule and at the agreed on, very reasonable cost. Would not hesitate to recommend J & R NW and to use them on future projects.",
        avatar: "JZ"
    },
    {
        id: "real-8",
        name: "R J.",
        platform: "Yelp",
        rating: 5,
        date: "8/7/25",
        text: "So recently had two bathrooms tiled, Julio and his whole team were amazing!! Everyone was so nice and respectful. Super fast, and in contact with me the whole time. I highly recommend this company! My bathrooms look amazing!!",
        avatar: "RJ"
    },
    {
        id: "real-9",
        name: "Cynthia L.",
        platform: "Yelp",
        rating: 5,
        date: "3/24/25",
        text: "I recommend J&R NW Construction based on their high quality of work and craftsmanship, as well as their willingness to work with me collaboratively in a warm and friendly manner and providing excellent work at a fair price. I hired J&R NW Construction for an extensive exterior...",
        avatar: "CL"
    },
    {
        id: "real-10",
        name: "Rebecca Smith",
        platform: "Google",
        rating: 5,
        date: "2 months ago",
        text: "Very professional, hard working, personable, caring crew. Made sure to protect all the areas around the work site while they worked. Our house is 31 years old and we will be using them for all our additional face lifts! Quality work for a fair price!",
        avatar: "RS"
    },
    {
        id: "real-11",
        name: "Rachel Johnson",
        platform: "Google",
        rating: 5,
        date: "4 months ago",
        text: "Good price. I recently had two bathrooms tiled, Julio and his whole team were amazing! Everyone was super nice and respectful. Super fast and in contact with me the whole time. I highly recommend this company. My bathrooms look amazing. I would hire them again.",
        avatar: "RJ"
    },
    {
        id: "real-12",
        name: "CALVARY",
        platform: "Google",
        rating: 5,
        date: "1 month ago",
        text: "Good price. Real deal!",
        avatar: "C"
    },
    {
        id: "real-britta",
        name: "Britta Blucher",
        platform: "Google",
        rating: 5,
        date: "2 weeks ago",
        text: "I had a squirrel infestation that had eaten through the majority of a support beam on my house. I called J&R NW Construction and they responded right away. The price was fair, the work was expedient, and Julio and his staff displayed the utmost professionalism. The repairs they made were a great improvement upon the original construction. I am confident that no more squirrels will be able to make it through to the new support beam. Also the appearance of the new column surrounding the support beam looks way better than the original construction.",
        avatar: "BB"
    },
    {
        id: "real-barb",
        name: "Barb Troxel",
        platform: "Google",
        rating: 5,
        date: "4 weeks ago",
        text: "If I could, I would give J&R NW Construction a 10 out of 5 rating, because their crew is not only exceptional, they are outstanding! Julio was exceptional in communicating with me when his crew would be here and what the plan of the day was. He is highly ethical, as well as being respectful, and I cannot say enough good things about his crew. Viktor is very talented, highly dedicated, and has great pride in producing highest quality results. The work done included installing exterior waterproofing, a French drain trench, framing a new interior wall, replacing insulation and sheathing, repairing drywall, painting the entire room, and installing subfloor and wall-to-wall carpeting. Julio's plan and estimate far surpassed all others. I am so thankful I found J&R NW Construction and will definitely use them again!",
        avatar: "BT"
    },
    {
        id: "real-rebecca-a",
        name: "Rebecca Abramson",
        platform: "Google",
        rating: 5,
        date: "7 weeks ago",
        text: "I highly recommend J&R NW Construction! Julio and his team recently repaired our kitchen sink pipe that was leaking. Julio was very responsive — he got us a quote and scheduled our repair quickly. His team did a great job and we will definitely be hiring them again for future projects!",
        avatar: "RA"
    },
    {
        id: "real-mayvis",
        name: "Mayvis Martin",
        platform: "Google",
        rating: 5,
        date: "8 weeks ago",
        text: "J&R NW Construction did an outstanding house repair job for me. The right side garage door support post was pushed in about 6 inches by an accidental car crash. The garage door was inoperable and there was other structural damage. The estimator and manager, Julio, worked with the insurance company and got the job done quickly and professionally. Julio and the workers were friendly, fast and professional.",
        avatar: "MM"
    }
];

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check if we have cached data that's still valid
        const now = Date.now();
        if (reviewsCache.data && reviewsCache.timestamp && (now - reviewsCache.timestamp < reviewsCache.ttl)) {
            console.log('Returning cached reviews');
            return res.status(200).json({ reviews: reviewsCache.data, cached: true });
        }

        // Fetch fresh reviews from Yelp API
        console.log('Fetching fresh reviews from Yelp API...');
        const yelpReviews = await fetchYelpReviews();

        // Always start with static reviews, merge in Yelp API results (dedup by name)
        const staticNames = new Set(sampleReviews.map(r => r.name.toLowerCase()));
        const newYelpReviews = yelpReviews.filter(r => !staticNames.has(r.name.toLowerCase()));
        let allReviews = [...newYelpReviews, ...sampleReviews];
        allReviews.sort((a, b) => b.rating - a.rating);

        // Update cache
        reviewsCache.data = allReviews;
        reviewsCache.timestamp = now;

        return res.status(200).json({ reviews: allReviews, cached: false });
    } catch (error) {
        console.error('Error in reviews API:', error);
        // Return sample reviews on error
        return res.status(200).json({ reviews: sampleReviews, error: true });
    }
}

