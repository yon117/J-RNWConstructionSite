import { getDb } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { createSessionToken } from '../../../lib/auth';
import { rateLimit } from '../../../lib/rateLimit';

const loginRateLimit = rateLimit({ windowMs: 15 * 60_000, max: 10 });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
        if (!loginRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
        }

        try {
            const { username, email, password } = req.body;
            const loginId = username || email;

            if (!loginId || !password) {
                return res.status(400).json({ error: 'Identity and password are required' });
            }

            const db = await getDb();
            let user = null;

            try {
                // 1. Try standard schema (username)
                const result = await db.execute({
                    sql: 'SELECT * FROM users WHERE username = ?',
                    args: [loginId]
                });
                user = result.rows[0];
            } catch (dbError) {
                // 2. Fallback to alternative schema (email) if username column doesn't exist
                if (dbError.message.includes('no such column: username') || dbError.message.includes('username')) {
                    const result = await db.execute({
                        sql: 'SELECT * FROM users WHERE email = ?',
                        args: [loginId]
                    });
                    user = result.rows[0];
                } else {
                    throw dbError; // Real connection error
                }
            }

            // Support both 'password' and 'password_hash' column names
            const storedPassword = user?.password || user?.password_hash;

            if (user && storedPassword && await bcrypt.compare(password, storedPassword)) {
                const sessionToken = createSessionToken();
                const token = serialize('admin_token', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/'
                });
                res.setHeader('Set-Cookie', token);
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Login Error:', error.message);
            res.status(500).json({
                error: 'An error occurred during login. Please ensure your database is correctly configured.'
            });
        }
    } else {
        res.status(405).end();
    }
}
