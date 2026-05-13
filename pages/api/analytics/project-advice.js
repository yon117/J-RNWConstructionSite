import Anthropic from '@anthropic-ai/sdk';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { projectsByCategory, leadsByService, totalProjects } = req.body;
    if (!projectsByCategory) return res.status(400).json({ error: 'No data provided' });

    try {
        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const prompt = `You are a portfolio strategy advisor for J&R NW Construction, a construction company in the Pacific Northwest.

Analyze this data and recommend what types of projects to upload to their portfolio to attract more leads and balance their portfolio.

Projects currently uploaded by category:
${JSON.stringify(projectsByCategory)}

Total projects: ${totalProjects}

Leads/inquiries by service type (what clients are requesting):
${JSON.stringify(leadsByService)}

Based on this data:
1. Identify which categories are OVER-represented (too many projects, few leads)
2. Identify which categories are UNDER-represented (few projects, high lead demand)
3. Recommend specific project types to upload next

Give 3-5 specific, actionable recommendations.

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
        return res.status(200).json({ advice });
    } catch (error) {
        console.error('project-advice error:', error);
        return res.status(500).json({ error: 'Failed to generate advice' });
    }
}
