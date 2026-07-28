import { google } from 'googleapis';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { getGoogleOAuthRedirectUri } from '../../../lib/site-url';
import { isGoogleReconnectRequiredError } from '../../../lib/google-oauth';

const PROPERTY_ID = process.env.GOOGLE_GA4_PROPERTY_ID;

function assertGoogleConfig() {
    if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
        throw new Error('GOOGLE_OAUTH_CONFIG_MISSING');
    }
    if (!PROPERTY_ID) {
        throw new Error('GA4_PROPERTY_ID_MISSING');
    }
}

async function getAuth(req) {
    assertGoogleConfig();
    const db = await getDb();
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

    const days = parseInt(req.query.days) || 30;
    const startDate = `${days}daysAgo`;

    try {
        const auth = await getAuth(req);
        const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });

        const [summaryRes, byDayRes, topPagesRes, sourcesRes] = await Promise.all([
            analyticsdata.properties.runReport({
                property: `properties/${PROPERTY_ID}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate: 'today' }],
                    metrics: [
                        { name: 'activeUsers' },
                        { name: 'sessions' },
                        { name: 'screenPageViews' },
                        { name: 'bounceRate' },
                        { name: 'averageSessionDuration' },
                        { name: 'newUsers' },
                    ],
                },
            }),
            analyticsdata.properties.runReport({
                property: `properties/${PROPERTY_ID}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate: 'today' }],
                    dimensions: [{ name: 'date' }],
                    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
                    orderBys: [{ dimension: { dimensionName: 'date' } }],
                },
            }),
            analyticsdata.properties.runReport({
                property: `properties/${PROPERTY_ID}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate: 'today' }],
                    dimensions: [{ name: 'pagePath' }],
                    metrics: [{ name: 'screenPageViews' }],
                    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                    limit: 10,
                },
            }),
            analyticsdata.properties.runReport({
                property: `properties/${PROPERTY_ID}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate: 'today' }],
                    dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
                    metrics: [{ name: 'sessions' }],
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                    limit: 8,
                },
            }),
        ]);

        const s = summaryRes.data.rows?.[0]?.metricValues || [];
        const summary = {
            activeUsers:     Number(s[0]?.value || 0),
            sessions:        Number(s[1]?.value || 0),
            pageViews:       Number(s[2]?.value || 0),
            bounceRate:      (Number(s[3]?.value || 0) * 100).toFixed(1),
            avgSession:      Math.round(Number(s[4]?.value || 0)),
            newUsers:        Number(s[5]?.value || 0),
        };

        const byDay = (byDayRes.data.rows || []).map(r => ({
            date:    r.dimensionValues[0].value,
            users:   Number(r.metricValues[0].value),
            sessions: Number(r.metricValues[1].value),
        }));

        const topPages = (topPagesRes.data.rows || []).map(r => ({
            page:  r.dimensionValues[0].value,
            views: Number(r.metricValues[0].value),
        }));

        const sources = (sourcesRes.data.rows || []).map(r => ({
            channel:  r.dimensionValues[0].value,
            sessions: Number(r.metricValues[0].value),
        }));

        res.status(200).json({ summary, byDay, topPages, sources });
    } catch (err) {
        if (err.message === 'NOT_CONNECTED') {
            return res.status(200).json({ notConnected: true });
        }
        if (isGoogleReconnectRequiredError(err)) {
            return res.status(200).json({ reconnectRequired: true, error: 'RECONNECT_REQUIRED' });
        }
        if (err.message === 'GOOGLE_OAUTH_CONFIG_MISSING') {
            return res.status(500).json({ error: 'Google OAuth env vars missing' });
        }
        if (err.message === 'GA4_PROPERTY_ID_MISSING') {
            return res.status(500).json({ error: 'GOOGLE_GA4_PROPERTY_ID missing' });
        }
        console.error('GA4 error:', err.message, err.response?.data || '');
        res.status(500).json({ error: err.message });
    }
}
