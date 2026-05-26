import { getDb } from '../../../lib/db';
import { getGoogleOAuthRedirectUri } from '../../../lib/site-url';

export default async function handler(req, res) {
    const { code, error } = req.query;

    if (error) {
        return res.redirect('/adminside/monitor?sc_error=' + encodeURIComponent(error));
    }
    if (!code) {
        return res.redirect('/adminside/monitor?sc_error=no_code');
    }
    if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
        return res.redirect('/adminside/monitor?sc_error=google_oauth_config_missing');
    }

    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id:     process.env.GOOGLE_OAUTH_CLIENT_ID,
                client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                redirect_uri:  getGoogleOAuthRedirectUri(req),
                grant_type:    'authorization_code',
            }),
        });

        const tokens = await tokenRes.json();
        if (!tokenRes.ok) {
            const message = tokens.error_description || tokens.error || 'token_exchange_failed';
            return res.redirect('/adminside/monitor?sc_error=' + encodeURIComponent(message));
        }
        if (!tokens.refresh_token) {
            return res.redirect('/adminside/monitor?sc_error=no_refresh_token');
        }

        const db = await getDb();
        await db.execute(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at INTEGER DEFAULT (strftime('%s', 'now'))
        )`);
        await db.execute({
            sql: 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, strftime(\'%s\', \'now\'))',
            args: ['google_sc_refresh_token', tokens.refresh_token],
        });

        res.redirect('/adminside/monitor?sc_connected=1');
    } catch (err) {
        console.error('Google SC callback error:', err);
        res.redirect('/adminside/monitor?sc_error=' + encodeURIComponent(err.message));
    }
}
