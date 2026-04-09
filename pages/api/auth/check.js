export default async function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.cookies.admin_token;
        if (token === 'authenticated') {
            res.status(200).json({ authenticated: true });
        } else {
            res.status(401).json({ authenticated: false });
        }
    } else {
        res.status(405).end();
    }
}
