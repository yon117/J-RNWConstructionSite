import { serialize } from 'cookie';

export default function handler(req, res) {
    const token = serialize('admin_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: -1,
        path: '/'
    });
    res.setHeader('Set-Cookie', token);
    res.status(200).json({ success: true });
}
