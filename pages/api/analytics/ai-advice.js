import Anthropic from '@anthropic-ai/sdk';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';

export default async function handler(req, res) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    if (req.method !== 'POST') return res.status(405).end();

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { metrics } = req.body;
    if (!metrics) return res.status(400).json({ error: 'No metrics provided' });

    try {
        const prompt = `You are a business growth advisor for J&R NW Construction, a construction company in the Pacific Northwest.
Analyze these lead/sales metrics and give 4-6 specific, actionable recommendations to improve conversions and grow the business.

Metrics:
- Total leads: ${metrics.total}
- New (unread): ${metrics.new}
- Contacted: ${metrics.contacted}
- Pending: ${metrics.pending}
- Not interested: ${metrics.notInterested}
- Conversion rate (contacted/total): ${metrics.convRate}%
- Top service by leads: ${metrics.topService}
- Best month: ${metrics.bestMonth}
- Services breakdown: ${JSON.stringify(metrics.byService)}
- Pipeline breakdown: ${JSON.stringify(metrics.byStatus)}

Give concrete recommendations. Each should include:
1. What to do (specific action)
2. Why it matters (business impact)
3. How to do it (tactical step)

Format as JSON array: [{ "title": "...", "why": "...", "action": "...", "priority": "high|medium|low" }]
Only return the JSON array, no other text.`;

        const message = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
        });

        const raw = message.content[0].text.trim();
        const text = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        const advice = JSON.parse(text);
        res.status(200).json({ advice });
    } catch (error) {
        console.error('AI advice error:', error);
        res.status(500).json({ error: 'Failed to generate advice' });
    }
}
