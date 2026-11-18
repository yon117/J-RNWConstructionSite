// Pure learning helpers for the contact-form spam filter (no DB access; see spamLearningStore.js).
//  1. Learned senders: once a message is marked as spam, its sender is blocked next time.
//  2. Naive-Bayes text model trained on the site's own messages (spam tab vs. leads already contacted).

import { analyzeMessage } from './spamFilter.mjs';

// Never block these as a whole domain: spammers use them, but so do real customers.
export const FREE_MAIL_DOMAINS = new Set([
    'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'outlook.com', 'hotmail.com', 'live.com',
    'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com',
    'gmx.com', 'mail.com', 'comcast.net', 'att.net', 'sbcglobal.net', 'verizon.net', 'zoho.com'
]);

export const EMPTY_SENDERS = Object.freeze({ emails: [], domains: [] });

// Gmail ignores dots and +tags, so normalize before comparing.
export function normalizeEmail(email) {
    const [local = '', domain = ''] = String(email || '').trim().toLowerCase().split('@');
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        return `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
    }
    return `${local}@${domain}`;
}

function domainOf(email) {
    return String(email || '').trim().toLowerCase().split('@')[1] || '';
}

/** Returns a new list with the sender added: exact email for free providers, whole domain otherwise. */
export function addLearnedSender(list, email) {
    const normalized = normalizeEmail(email);
    const domain = domainOf(email);
    if (!normalized.includes('@') || !domain) return list;

    if (FREE_MAIL_DOMAINS.has(domain)) {
        return list.emails.includes(normalized) ? list : { ...list, emails: [...list.emails, normalized] };
    }
    return list.domains.includes(domain) ? list : { ...list, domains: [...list.domains, domain] };
}

/** Returns a new list without that sender (used when a message is restored with "Not spam"). */
export function removeLearnedSender(list, email) {
    const normalized = normalizeEmail(email);
    const domain = domainOf(email);
    return {
        emails: list.emails.filter((e) => e !== normalized),
        domains: list.domains.filter((d) => d !== domain)
    };
}

export function isLearnedSender(list, email) {
    return list.emails.includes(normalizeEmail(email)) || list.domains.includes(domainOf(email));
}

// ---- Naive Bayes ----

const MIN_SPAM_SAMPLES = 8;
const MIN_HAM_SAMPLES = 20;
const MIN_TOKEN_SEEN = 3; // ignore words seen fewer times in total
const TOP_TOKENS = 15;
const SPAM_THRESHOLD = 0.97;

export function tokenize(text) {
    const cleaned = String(text || '')
        .toLowerCase()
        .replace(/https?:\/\/\S+|www\.\S+/g, ' urltoken ')
        .replace(/\d+/g, ' ');
    return [...new Set(cleaned.match(/[a-z][a-z'-]{2,}/g) || [])];
}

/** @param {string[]} spamTexts @param {string[]} hamTexts */
export function trainModel(spamTexts, hamTexts) {
    const count = (texts) => {
        const map = new Map();
        for (const text of texts) for (const t of tokenize(text)) map.set(t, (map.get(t) || 0) + 1);
        return map;
    };
    return {
        spamCount: spamTexts.length,
        hamCount: hamTexts.length,
        spamTokens: count(spamTexts),
        hamTokens: count(hamTexts)
    };
}

/** Probability (0-1) that the text is spam, or null when there is not enough training data. */
export function spamProbability(model, text) {
    if (!model || model.spamCount < MIN_SPAM_SAMPLES || model.hamCount < MIN_HAM_SAMPLES) return null;

    const scored = [];
    for (const token of tokenize(text)) {
        const s = model.spamTokens.get(token) || 0;
        const h = model.hamTokens.get(token) || 0;
        if (s + h < MIN_TOKEN_SEEN) continue;
        const ps = (s + 0.5) / (model.spamCount + 1);
        const ph = (h + 0.5) / (model.hamCount + 1);
        const p = Math.min(0.99, Math.max(0.01, ps / (ps + ph)));
        scored.push(p);
    }
    if (scored.length === 0) return null;

    const strongest = scored.sort((a, b) => Math.abs(b - 0.5) - Math.abs(a - 0.5)).slice(0, TOP_TOKENS);
    const logSpam = strongest.reduce((acc, p) => acc + Math.log(p), 0);
    const logHam = strongest.reduce((acc, p) => acc + Math.log(1 - p), 0);
    return 1 / (1 + Math.exp(logHam - logSpam));
}

/** True when the model is confident AND the message shows no sign of a real customer request. */
export function isLearnedSpam(model, message) {
    if (analyzeMessage(message).hasIntent) return false;
    const p = spamProbability(model, message);
    return p !== null && p >= SPAM_THRESHOLD;
}
