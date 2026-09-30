import { getDb } from '../../lib/db';
import { rateLimit } from '../../lib/rateLimit';

const contactRateLimit = rateLimit({ windowMs: 60_000, max: 5 });

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://127.0.0.1:5678/webhook/formulario-contacto';
const N8N_TIMEOUT_MS = 5000;

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

const SPAM_PATTERNS = [
    /forsale\.godaddy\.com/i,
    /\b\w+(water|damage|cleaning|restoration|roofing|plumbing)\w*\.com\b.*\b(for sale|secured|referrals)\b/i,
    /(secured|domain).{0,60}(referrals|new .* jobs).{0,200}https?:\/\//is
];

function isSpam(email, message) {
    if (BLOCKED_NORMALIZED.has(normalizeEmail(email))) return true;
    return SPAM_PATTERNS.some((re) => re.test(message));
}

async function notifyN8n(payload) {
    try {
        const res = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(N8N_TIMEOUT_MS)
        });
        if (!res.ok) console.error('n8n webhook responded with status', res.status);
    } catch (error) {
        console.error('n8n webhook failed:', error.message);
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

        // Fake success: no DB row, no n8n notification, spammer sees nothing to adapt to
        if (isSpam(safeEmail, safeMessage)) {
            console.warn('Blocked spam submission from', ip);
            return res.status(200).json({ success: true });
        }

        try {
            console.log('Getting database connection...');
            const db = await getDb();
            console.log('Database connected successfully');

            console.log('Inserting message into database...', { name, email, phone, serviceType });

            await db.execute({
                sql: 'INSERT INTO messages (name, full_name, email, phone, message, service_type) VALUES (?, ?, ?, ?, ?, ?)',
                args: [name, name, safeEmail, safePhone, safeMessage, safeServiceType]
            });

            console.log('Message saved to database successfully');

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
