import { google } from 'googleapis';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { getGoogleOAuthRedirectUri, getSearchConsoleSiteUrl } from '../../../lib/site-url';

function assertGoogleConfig() {
    if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
        throw new Error('GOOGLE_OAUTH_CONFIG_MISSING');
    }
}

async function getAuth(req) {
    assertGoogleConfig();
    const db = await getDb();
    await db.execute(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )`);
    const result = await db.execute({
        sql: 'SELECT value FROM settings WHERE key = ?',
        args: ['google_sc_refresh_token'],
    });

    const refreshToken = result.rows[0]?.value;
    if (!refreshToken) throw new Error('NOT_CONNECTED');

    const oauth2 = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        getGoogleOAuthRedirectUri(req)
    );
    oauth2.setCredentials({ refresh_token: refreshToken });
    return oauth2;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const days = parseInt(req.query.days) || 28;
    const endDate   = new Date();
    const startDate = new Date(Date.now() - days * 86400000);
    const fmt = d => d.toISOString().slice(0, 10);
    const siteUrl = getSearchConsoleSiteUrl(req);

    try {
        const auth = await getAuth(req);
        const sc   = google.searchconsole({ version: 'v1', auth });

        const [overviewRes, pagesRes, queriesRes] = await Promise.all([
            sc.searchanalytics.query({
                siteUrl,
                requestBody: {
                    startDate: fmt(startDate),
                    endDate:   fmt(endDate),
                    dimensions: ['date'],
                    rowLimit: 90,
                },
            }),
            sc.searchanalytics.query({
                siteUrl,
                requestBody: {
                    startDate: fmt(startDate),
                    endDate:   fmt(endDate),
                    dimensions: ['page'],
                    rowLimit: 10,
                },
            }),
            sc.searchanalytics.query({
                siteUrl,
                requestBody: {
                    startDate: fmt(startDate),
                    endDate:   fmt(endDate),
                    dimensions: ['query'],
                    rowLimit: 10,
                },
            }),
        ]);

        const rows = overviewRes.data.rows || [];
        const totals = rows.reduce((acc, r) => ({
            clicks:      acc.clicks      + (r.clicks      || 0),
            impressions: acc.impressions + (r.impressions || 0),
            position:    acc.position    + (r.position    || 0),
        }), { clicks: 0, impressions: 0, position: 0 });

        const avgCTR      = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(1) : '0.0';
        const avgPosition = rows.length > 0 ? (totals.position / rows.length).toFixed(1) : '—';

        res.status(200).json({
            totals: {
                clicks:      totals.clicks,
                impressions: totals.impressions,
                ctr:         avgCTR,
                position:    avgPosition,
            },
            byDate:   rows.map(r => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions })),
            topPages: (pagesRes.data.rows || []).map(r => ({
                page:        siteUrl.startsWith('sc-domain:') ? r.keys[0] : r.keys[0].replace(siteUrl, '/'),
                clicks:      r.clicks,
                impressions: r.impressions,
                ctr:         (r.ctr * 100).toFixed(1),
                position:    r.position.toFixed(1),
            })),
            topQueries: (queriesRes.data.rows || []).map(r => ({
                query:       r.keys[0],
                clicks:      r.clicks,
                impressions: r.impressions,
                ctr:         (r.ctr * 100).toFixed(1),
                position:    r.position.toFixed(1),
            })),
        });
    } catch (err) {
        if (err.message === 'NOT_CONNECTED') {
            return res.status(200).json({ notConnected: true });
        }
        if (err.message === 'GOOGLE_OAUTH_CONFIG_MISSING') {
            return res.status(500).json({ error: 'Google OAuth env vars missing' });
        }
        console.error('Search Console error:', err.message);
        res.status(500).json({ error: err.message });
    }
}
