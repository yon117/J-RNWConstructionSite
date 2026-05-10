import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';

export default function handler(req, res) {
    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const params = new URLSearchParams({
        client_id:     process.env.GOOGLE_OAUTH_CLIENT_ID,
        redirect_uri:  'http://localhost:3000/api/auth/google-sc-callback',
        response_type: 'code',
        scope:         [
            'https://www.googleapis.com/auth/webmasters.readonly',
            'https://www.googleapis.com/auth/analytics.readonly',
        ].join(' '),
        access_type:   'offline',
        prompt:        'consent',
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
