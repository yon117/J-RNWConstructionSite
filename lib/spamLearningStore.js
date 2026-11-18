import {
    EMPTY_SENDERS, addLearnedSender, removeLearnedSender, trainModel
} from './spamLearning.mjs';

const SENDERS_KEY = 'spam_learned_senders';
const CACHE_MS = 60_000; // PM2 runs several processes; each refreshes its own copy at most this late
const TRAINING_LIMIT = 500;

let cache = { at: 0, value: null };

async function ensureSettingsTable(db) {
    await db.execute(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )`);
}

async function readSenders(db) {
    await ensureSettingsTable(db);
    const result = await db.execute({ sql: 'SELECT value FROM settings WHERE key = ?', args: [SENDERS_KEY] });
    if (!result.rows[0]) return EMPTY_SENDERS;
    try {
        const parsed = JSON.parse(result.rows[0].value);
        return { emails: parsed.emails || [], domains: parsed.domains || [] };
    } catch {
        return EMPTY_SENDERS;
    }
}

async function writeSenders(db, list) {
    await ensureSettingsTable(db);
    await db.execute({
        sql: `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, strftime('%s', 'now'))`,
        args: [SENDERS_KEY, JSON.stringify(list)]
    });
}

/** Learned senders + text model, cached for CACHE_MS. Returns null if the DB read fails. */
export async function loadLearning(db) {
    if (cache.value && Date.now() - cache.at < CACHE_MS) return cache.value;
    try {
        const [senders, spamRows, hamRows] = await Promise.all([
            readSenders(db),
            // Spam = the Spam tab. Legit = leads that were actually followed up (not 'not_interested': that bucket mixes in vendors).
            db.execute({ sql: `SELECT message FROM messages WHERE status = 'spam' ORDER BY created_at DESC LIMIT ?`, args: [TRAINING_LIMIT] }),
            db.execute({ sql: `SELECT message FROM messages WHERE status IN ('contacted', 'pending') ORDER BY created_at DESC LIMIT ?`, args: [TRAINING_LIMIT] })
        ]);
        const value = {
            senders,
            model: trainModel(spamRows.rows.map((r) => r.message), hamRows.rows.map((r) => r.message))
        };
        cache = { at: Date.now(), value };
        return value;
    } catch (error) {
        console.error('[spam-learning] could not load:', error.message);
        return null;
    }
}

export function invalidateLearning() {
    cache = { at: 0, value: null };
}

/** A message was marked as spam: remember its sender. */
export async function learnSender(db, email) {
    await writeSenders(db, addLearnedSender(await readSenders(db), email));
    invalidateLearning();
}

/** A message was restored with "Not spam": stop blocking its sender. */
export async function forgetSender(db, email) {
    await writeSenders(db, removeLearnedSender(await readSenders(db), email));
    invalidateLearning();
}
