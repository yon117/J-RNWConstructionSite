import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeMessage } from './spamFilter.mjs';

const SPAM = {
    automax: "Hi, just checking in one more time to see if you're interested in the offer. I could set it up for free, then you can test it out, close a few projects and decide if you want to keep it or not. Can I send a quick 5-minute video explaining how we can do it for you? Wyatt Tucker AutoMaxRevenue wyatt@automaxrevenue.com",
    zack: "Hi J&R NW Construction, wrong number. kidding. this is a sales message, delete it if you want. somebody in Portland needs what you do right now. they open google maps, call the top 3, done. 4th place never even knew they existed. i'm Zack, out of Bakersfield. free 2 min video showing who's getting those calls and how. text or email? Zack Zachary Jackson Rocks · 661-452-9600 Not interested? zacharyjackson.rocks/unsub",
    reputation: "🌐 Google Reputation Managemen Google Review 🌟🌟🌟🌟 Facebook Review 🌟🌟🌟🌟 Tripadvisor 🌟🌟🌟🌟 Trustpilot 🌟🌟🌟🌟 BBB 🌟🌟🌟🌟 Angi 🌟🌟🌟🌟 Houzz 🌟🌟🌟🌟 Sitejabber 🌟🌟🌟🌟 Bad Review Remove 🌟 📈 Grow Your Business Contact us ☎️WhatsApp: +8801752894131 💌Gmail: redoy.re2362@gmail.com",
    receptionist: "Hey, I was looking at your business, and I gotta say, you're providing an excellent service in your area. Before you ignore and delete this message: this is not some BS new lead gen method or service. I will provide you with a receptionist that works 24/7, handles every call. You only pay me for the JOBS I SAVE you. If I don't save you any, you just don't pay. Would you be open to a quick 10-minute call this week about this? Reply to me here: wyatt@automaxrevenue.com Thank you! Wyatt",
    ai: "Hi J&R NW Construction, Yesterday I spent a few hours making an AI agent for J&R NW Construction. I can set this up for you, and if you don't make at least three times your money back, I'll give you a full refund. Do you have 15 minutes today or tomorrow to show you? Grab a time to chat here: https://getdandy.com/ai-agent-new/ or reach me directly at (949) 313-2741. Jennifer O'Brien | AI Implementation Advisor GetDandy Visit us Online: https://getdandy.com/ai-agent-new/ Unsubscribe: https://bit.ly/42wnUsa"
};

const LEGIT = [
    'We have water damage in our basement, need an estimate for repair and drywall. Call me tomorrow.',
    'Looking to remodel our kitchen. I can send photos or a short video of the space if helpful.',
    'Hi, can I get a free estimate to replace 6 windows and repaint the exterior of my house? Available weekends.',
    'Mi techo tiene una gotera, necesito un presupuesto estimate para repararlo.',
    'Need a quote for a new deck. Please call me after 5 pm, I am usually busy during the week.',
    'Hello, we have a leak in the bathroom and the ceiling is stained. Can someone come take a look this week?'
];

for (const [name, msg] of Object.entries(SPAM)) {
    test(`rejects spam: ${name}`, () => {
        assert.equal(analyzeMessage(msg).isSpam, true, JSON.stringify(analyzeMessage(msg)));
    });
}

LEGIT.forEach((msg, i) => {
    test(`accepts legit message #${i + 1}`, () => {
        assert.equal(analyzeMessage(msg).isSpam, false, JSON.stringify(analyzeMessage(msg)));
    });
});
