import { getDb } from '../../lib/db';
import { rateLimit } from '../../lib/rateLimit';
import { analyzeMessage } from '../../lib/spamFilter.mjs';
import { notifyN8n } from '../../lib/notifyN8n';
import { readCrmDeliveryConfig } from '../../lib/crm-delivery/config.mjs';
import { recordContactMessage, resolveSubmissionId } from '../../lib/crm-delivery/intake.mjs';

const contactRateLimit = rateLimit({ windowMs: 60_000, max: 5 });


// Extra entries via env: BLOCKED_EMAILS="a@x.com,b@y.com"
const BLOCKED_EMAILS = new Set(
    ['bruce.f.griffin@gmail.com', ...(process.env.BLOCKED_EMAILS || '').split(',')]
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
);
// Gmail ignores dots and +tags, so normalize before comparing
function normalizeEmail(email) {
    const [local = '', domain = ''] = email.trim().toLowerCase().split('@');
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        return `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
    }
    return `${local}@${domain}`;
}
const BLOCKED_NORMALIZED = new Set([...BLOCKED_EMAILS].map(normalizeEmail));

// Whole sender domains (agencies that cold-pitch through the form). Extra via env: BLOCKED_DOMAINS="a.com,b.com"
const BLOCKED_DOMAINS = new Set(
    ['automaxrevenue.com', ...(process.env.BLOCKED_DOMAINS || '').split(',')]
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean)
);

const SPAM_PATTERNS = [
    /forsale\.godaddy\.com/i,
    /\b\w+(water|damage|cleaning|restoration|roofing|plumbing)\w*\.com\b.*\b(for sale|secured|referrals)\b/i,
    /(secured|domain).{0,60}(referrals|new .* jobs).{0,200}https?:\/\//is,
    // Cold outreach / agency pitches ("can I send a quick video", "set it up for free", ...)
    /\b(send|share)\b.{0,30}\b(quick\s+)?\d*-?\s*(minute|min)\s+(video|demo|loom)\b/is,
    /\bjust (checking|following) (in|up)\b.{0,80}\b(offer|proposal|my (last )?(email|message))\b/is,
    /\b(set (it|this) up|setup)\b.{0,20}\bfor free\b.{0,120}\b(test|try)\b/is,
    /\b(lead generation|lead gen|seo (services|agency)|web(site)? design (services|agency)|grow your (business|revenue)|guaranteed (leads|results)|more (leads|clients|customers) for you)\b/i,
    /\b(book|schedule) a (quick )?(call|demo|meeting)\b.{0,80}\b(our (team|agency|services)|we (help|offer|specialize))\b/is
];

const MIN_FILL_MS = 3000; // humans take longer than this to fill the form
const MAX_LINKS = 2;

const SPAM_RETENTION_DAYS = 30;

// Returns null for a normal message, or { quarantine } for spam.
// quarantine=false: obvious bot (honeypot / instant submit) — dropped, never stored.
// quarantine=true: stored with status 'spam' so it can be reviewed and restored from the admin.
function classifySpam({ email, message, honeypot, startedAt }) {
    if (honeypot) return { quarantine: false };
    if (startedAt && Date.now() - Number(startedAt) < MIN_FILL_MS) return { quarantine: false };

    if (BLOCKED_NORMALIZED.has(normalizeEmail(email))) return { quarantine: true };
    const domain = email.split('@')[1]?.trim().toLowerCase();
    if (domain && BLOCKED_DOMAINS.has(domain)) return { quarantine: true };

    if ((message.match(/https?:\/\/|www\./gi) || []).length > MAX_LINKS) return { quarantine: true };
    if (SPAM_PATTERNS.some((re) => re.test(message))) return { quarantine: true };

    const verdict = analyzeMessage(message);
    if (verdict.isSpam) console.warn('[spam-filter] score', verdict.score, verdict.signals.join(','));
    return verdict.isSpam ? { quarantine: true } : null;
}

async function quarantineMessage(fields) {
    try {
        const db = await getDb();
        await db.batch([
            {
                sql: `INSERT INTO messages (name, full_name, email, phone, message, service_type, status, is_read)
                      VALUES (?, ?, ?, ?, ?, ?, 'spam', 1)`,
                args: [fields.name, fields.name, fields.email, fields.phone, fields.message, fields.serviceType]
            },
            {
                sql: `DELETE FROM messages WHERE status = 'spam' AND created_at < datetime('now', ?)`,
                args: [`-${SPAM_RETENTION_DAYS} days`]
            }
        ], 'write');
    } catch (error) {
        // Never let quarantine failures change what the sender sees.
        console.error('Failed to quarantine spam message:', error.message);
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
        if (!contactRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many requests. Please wait before submitting again.' });
        }

        // Support both new (fullName) and legacy (firstName+lastName) field names
        const { firstName, lastName, fullName, email, phone, message, serviceType } = req.body;

        const name = (fullName || `${firstName || ''} ${lastName || ''}`.trim()).slice(0, 200);
        const safeEmail = (email || '').slice(0, 254);
        const safePhone = (phone || '').slice(0, 30);
        const safeMessage = (message || '').slice(0, 5000);
        const safeServiceType = (serviceType || '').slice(0, 200);

        if (!name || !safeEmail || !safeMessage || !safeServiceType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(safeEmail)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Fake success: no CRM row, no n8n notification, spammer sees nothing to adapt to
        const spam = classifySpam({ email: safeEmail, message: safeMessage, honeypot: req.body.website, startedAt: req.body.formStartedAt });
        if (spam) {
            console.warn('Blocked spam submission from', ip);
            if (spam.quarantine) {
                await quarantineMessage({ name, email: safeEmail, phone: safePhone, message: safeMessage, serviceType: safeServiceType });
            }
            return res.status(200).json({ success: true });
        }

        try {
            const db = await getDb();

            // Delivery to OPS CRM is opt-in (JRNW_OPS_CRM_ENABLED). When on, the message and a pending
            // delivery are saved in one transaction; the separate worker sends it later.
            const crm = readCrmDeliveryConfig(process.env);
            if (!crm.enabled && crm.reason !== 'disabled') {
                console.warn('[crm-delivery] misconfigured, not queueing:', crm.reason);
            }
            const submissionId = resolveSubmissionId(req.body.submissionId);

            const { duplicate } = await recordContactMessage(
                db,
                { name, email: safeEmail, phone: safePhone, message: safeMessage, serviceType: safeServiceType },
                { crmEnabled: crm.enabled, submissionId }
            );

            // Browser retry of an already-saved submission: already handled (and n8n already notified).
            if (duplicate) {
                return res.status(200).json({ success: true });
            }

            await notifyN8n({
                nombre: name,
                email: safeEmail,
                phone: safePhone,
                mensaje: safeMessage,
                serviceType: safeServiceType
            });

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Contact form error:', error);
            res.status(500).json({ error: 'Failed to submit message. Please try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
