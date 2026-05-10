import { exec } from 'child_process';
import { promisify } from 'util';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../../lib/auth';
import path from 'path';

const execAsync = promisify(exec);
const PROJECT_DIR = path.join(process.cwd());

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const [auditResult, outdatedResult] = await Promise.allSettled([
            execAsync('npm audit --json', { cwd: PROJECT_DIR, timeout: 30000 }),
            execAsync('npm outdated --json', { cwd: PROJECT_DIR, timeout: 30000 }),
        ]);

        let audit = null;
        if (auditResult.status === 'fulfilled' || auditResult.reason?.stdout) {
            try {
                const raw = auditResult.status === 'fulfilled'
                    ? auditResult.value.stdout
                    : auditResult.reason.stdout;
                audit = JSON.parse(raw);
            } catch {}
        }

        let outdated = null;
        if (outdatedResult.status === 'fulfilled' || outdatedResult.reason?.stdout) {
            try {
                const raw = outdatedResult.status === 'fulfilled'
                    ? outdatedResult.value.stdout
                    : outdatedResult.reason.stdout;
                outdated = JSON.parse(raw);
            } catch {}
        }

        const vulns = audit?.metadata?.vulnerabilities || {};
        const totalVulns = (vulns.critical || 0) + (vulns.high || 0) + (vulns.moderate || 0) + (vulns.low || 0);

        const outdatedList = outdated
            ? Object.entries(outdated).map(([pkg, info]) => ({
                name: pkg,
                current: info.current,
                wanted: info.wanted,
                latest: info.latest,
            }))
            : [];

        res.status(200).json({
            vulnerabilities: vulns,
            totalVulns,
            outdated: outdatedList,
            auditedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Deps check error:', error);
        res.status(500).json({ error: 'Failed to run dependency check' });
    }
}
