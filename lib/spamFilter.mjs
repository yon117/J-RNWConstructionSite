// Scores a contact-form message for cold-outreach / vendor spam.
// Each sales signal adds points; signs of a real customer (asking for an estimate,
// describing a job they need done) raise the bar for rejecting.

const SALES_SIGNALS = [
    // [regex, points, label]
    [/\b(this is a )?sales (message|pitch)\b/i, 4, 'admits-sales'],
    [/\b(delete (it|this)|ignore (and delete )?(it|this)) if you want\b|before you (ignore|delete)/i, 4, 'pre-empts-deletion'],
    [/\bnot interested\?|\bunsub(scribe)?\b/i, 4, 'unsubscribe'],
    [/\b(lead gen(eration)?|lead[- ]generation)\b/i, 3, 'lead-gen'],
    [/\b(google|facebook|yelp)\s+(review|reputation)|reputation manage|bad review remove|\b(trustpilot|tripadvisor|sitejabber|houzz)\b/i, 4, 'reputation-spam'],
    [/\bgrow your (business|revenue|sales)\b|\bmore (leads|clients|customers|calls) (for you|to your)\b|\bguaranteed (leads|results)\b/i, 3, 'growth-pitch'],
    [/\b(ai|virtual)\s+(agent|receptionist|assistant)\b|\breceptionist\b|\bai implementation\b/i, 3, 'ai-receptionist'],
    [/\b(free|quick|short)\s+\d+[- ]?(min(ute)?s?)\s+(video|call|demo|chat)\b|\b\d+[- ]?(min(ute)?s?)\s+(video|call|demo)\b/i, 3, 'minute-video-call'],
    [/\b(do you have|are you open to|would you be open to|got)\b.{0,40}\b\d+\s*(min(ute)?s?)\b/is, 3, 'asks-for-minutes'],
    [/\bsend (you )?a (quick |short )?(video|demo|loom)\b/i, 3, 'send-video'],
    [/\bjust (checking|following) (in|up)\b/i, 2, 'checking-in'],
    [/\b(set (it|this) up|setup)\b.{0,30}\bfor (you|free)\b/is, 3, 'set-it-up'],
    [/\b(money[- ]back|full refund|you only pay|you just don'?t pay|don'?t pay)\b/i, 3, 'risk-reversal'],
    [/\b(open google maps|call the top 3|top 3|your competitors|get(ting)? stolen)\b/i, 2, 'competitor-fear'],
    [/\bmissed calls?|unanswered|go(es)? unanswered|voicemail\b/i, 2, 'missed-calls'],
    [/\b(i was looking at|i came across|i found) your (business|website|company|profile)\b/i, 2, 'looked-at-you'],
    [/\b(i'?m|my name is) \w+,? (out of|from|with) [A-Z]\w+/i, 2, 'intro-from-city'],
    [/\bwhatsapp\b|\btext or email\?/i, 2, 'contact-channel-push'],
    [/\b(book|schedule|grab) a (time|call|demo|meeting)\b|\bgrab a time\b/i, 2, 'booking-link'],
    [/\b(seo|web(site)? design|marketing) (services|agency|company)\b/i, 3, 'agency'],
    [/\b(contact us|visit us online)\b/i, 2, 'contact-us']
];

// Real-customer intent. Needs a first-person need or an estimate/quote request.
const LEGIT_SIGNALS = [
    /\b(free )?(estimate|quote|bid)\b/i,
    /\b(i|we)\s+(need|want|would like|am looking|are looking|'?m looking|have|got)\b.{0,80}\b(repair|remodel|paint|install|replace|fix|build|roof|floor|kitchen|bath|deck|fence|siding|window|door|drywall|leak|flood|mold|damage|cabinet)/is,
    /\b(my|our) (house|home|kitchen|bathroom|basement|roof|deck|fence|garage|property|apartment|rental)\b/i
];

const STAR_EMOJI = /[⭐🌟]/g; // ⭐ 🌟
const URL_RE = /https?:\/\/|www\.|\b[a-z0-9-]+\.(rocks|ly|io|co|xyz|top|click)\/\S*/gi;

const REJECT_THRESHOLD = 4; // no sign of a real customer
const REJECT_THRESHOLD_WITH_INTENT = 8; // even if they mention an estimate, heavy pitching still loses

/**
 * @param {string} message
 * @returns {{ score: number, hasIntent: boolean, signals: string[], isSpam: boolean }}
 */
export function analyzeMessage(message) {
    const text = String(message || '');
    const signals = [];
    let score = 0;

    for (const [re, points, label] of SALES_SIGNALS) {
        if (re.test(text)) {
            score += points;
            signals.push(label);
        }
    }

    if ((text.match(STAR_EMOJI) || []).length >= 3) {
        score += 3;
        signals.push('star-emoji');
    }
    const links = (text.match(URL_RE) || []).length;
    if (links >= 1) {
        score += links >= 2 ? 2 : 1;
        signals.push('links');
    }

    const hasIntent = LEGIT_SIGNALS.some((re) => re.test(text));
    const threshold = hasIntent ? REJECT_THRESHOLD_WITH_INTENT : REJECT_THRESHOLD;

    return { score, hasIntent, signals, isSpam: score >= threshold };
}
