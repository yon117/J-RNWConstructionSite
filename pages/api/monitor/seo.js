import fs from 'node:fs/promises';
import path from 'node:path';
import { google } from 'googleapis';
import { parse } from 'cookie';
import { getDb } from '../../../lib/db';
import { isValidSessionToken } from '../../../lib/auth';
import { getGoogleOAuthRedirectUri, getSearchConsoleSiteUrl } from '../../../lib/site-url';
import { isGoogleReconnectRequiredError } from '../../../lib/google-oauth';

const LEGACY_SERVICE_PATHS = [
    '/services/interior-construction-and-remodeling',
    '/services/restoration-and-reconstruction',
    '/services/mitigation-and-emergency-services',
    '/services/paint',
];

const REAL_VITAL_NAMES = ['LCP', 'CLS', 'INP', 'FID', 'FCP', 'TTFB'];
const SEVERITY_BASE = { good: 0, info: 1, warning: 3, critical: 5 };
const SCORE_BASE = { good: 0, info: 2, warning: 8, critical: 15 };

function addCheck(checks, severity, title, detail, action, extra = {}) {
    checks.push({ severity, title, detail, action, ...extra });
}

function extractLocs(xml) {
    return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
}

function normalizeServiceSlug(service) {
    if (service.slug) return service.slug;
    return String(service.title || '')
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function safeReadFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch {
        return '';
    }
}

async function tableExists(db, name) {
    try {
        const result = await db.execute({
            sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
            args: [name],
        });
        return Boolean(result.rows?.length);
    } catch {
        return false;
    }
}

function assertGoogleConfig() {
    if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
        throw new Error('GOOGLE_OAUTH_CONFIG_MISSING');
    }
}

async function getSearchConsoleAuth(req, db) {
    assertGoogleConfig();
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

function normalizeSearchConsolePage(page, siteUrl) {
    const value = String(page || '');
    if (!value) return '';
    if (siteUrl.startsWith('sc-domain:')) {
        try {
            const parsed = new URL(value);
            return `${parsed.pathname}${parsed.search}`;
        } catch {
            return value;
        }
    }
    if (value.startsWith(siteUrl)) {
        return value.replace(siteUrl, '/');
    }
    try {
        const parsed = new URL(value);
        return `${parsed.pathname}${parsed.search}`;
    } catch {
        return value;
    }
}

function sumPageViews(pageViews, affectedPaths = []) {
    if (!affectedPaths.length) return 0;
    const normalized = affectedPaths.map((item) => String(item || '').split('?')[0]);
    return pageViews
        .filter((row) => normalized.some((pattern) => {
            const barePath = row.path.split('?')[0];
            return barePath === pattern || barePath.startsWith(`${pattern}/`) || row.path === pattern;
        }))
        .reduce((sum, row) => sum + row.views, 0);
}

function summarizeGscImpact(pageMetrics, affectedPaths = []) {
    if (!affectedPaths.length) return { rows: [], impressions: 0, clicks: 0 };
    const normalized = affectedPaths.map((item) => String(item || '').split('?')[0]);
    const rows = pageMetrics.filter((row) =>
        normalized.some((pattern) => row.path === pattern || row.path.startsWith(`${pattern}/`))
    );
    return {
        rows,
        impressions: rows.reduce((sum, row) => sum + Number(row.impressions || 0), 0),
        clicks: rows.reduce((sum, row) => sum + Number(row.clicks || 0), 0),
    };
}

function computePriority(check, localHits, impressions) {
    let score = SEVERITY_BASE[check.severity] || 0;
    if (localHits > 0 || impressions > 0) score += 1;
    if (localHits >= 25 || impressions >= 50) score += 1;
    if (localHits >= 75 || impressions >= 150) score += 1;
    if (/canonical|numeric service urls|sitemap|legacy service slugs/i.test(check.title)) score += 1;

    if (check.severity === 'good') return 'ok';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
}

function computeScoreImpact(check, localHits, impressions) {
    let impact = SCORE_BASE[check.severity] || 0;
    if (localHits > 0 || impressions > 0) impact += 2;
    if (localHits >= 25 || impressions >= 50) impact += 2;
    if (/canonical|numeric service urls|sitemap/i.test(check.title)) impact += 3;
    return Math.min(20, impact);
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const days = parseInt(req.query.days, 10) || 30;
    const cutoff = Math.floor(Date.now() / 1000) - days * 86400;
    const db = await getDb();

    try {
        const servicesResult = await db.execute('SELECT id, title, slug FROM services ORDER BY id');
        const services = (servicesResult.rows || []).map((row) => ({
            id: Number(row.id),
            title: row.title || '',
            slug: row.slug || '',
            normalizedSlug: normalizeServiceSlug(row),
        }));

        const hasPageViews = await tableExists(db, 'page_views');
        const hasVitals = await tableExists(db, 'web_vitals');
        const hasSettings = await tableExists(db, 'settings');

        const [
            pageViewRowsResult,
            vitalNamesResult,
            settingsResult,
            robotsTxt,
            sitemapXml,
            layoutSource,
            servicesPageSource,
            serviceDetailSource,
        ] = await Promise.all([
            hasPageViews
                ? db.execute({
                    sql: 'SELECT path, COUNT(*) as views FROM page_views WHERE created_at >= ? GROUP BY path ORDER BY views DESC',
                    args: [cutoff],
                })
                : Promise.resolve({ rows: [] }),
            hasVitals
                ? db.execute('SELECT DISTINCT name FROM web_vitals ORDER BY name')
                : Promise.resolve({ rows: [] }),
            hasSettings
                ? db.execute({
                    sql: 'SELECT key, value FROM settings WHERE key = ?',
                    args: ['google_sc_refresh_token'],
                })
                : Promise.resolve({ rows: [] }),
            safeReadFile(path.join(process.cwd(), 'public', 'robots.txt')),
            safeReadFile(path.join(process.cwd(), 'public', 'sitemap.xml')),
            safeReadFile(path.join(process.cwd(), 'components', 'Layout.js')),
            safeReadFile(path.join(process.cwd(), 'pages', 'services.js')),
            safeReadFile(path.join(process.cwd(), 'pages', 'services', '[id].js')),
        ]);

        const pageViewRows = pageViewRowsResult.rows || [];
        const pageViews = pageViewRows.map((row) => ({
            path: String(row.path || ''),
            views: Number(row.views || 0),
        }));

        const previewHits = pageViews
            .filter((row) => row.path.startsWith('/service-preview'))
            .reduce((sum, row) => sum + row.views, 0);

        const numericServiceHits = pageViews
            .filter((row) => /^\/services\/\d+(?:$|[/?])/.test(row.path))
            .reduce((sum, row) => sum + row.views, 0);

        const legacyServiceHits = pageViews
            .filter((row) => LEGACY_SERVICE_PATHS.some((legacy) => row.path.startsWith(legacy)))
            .reduce((sum, row) => sum + row.views, 0);

        const queryStringHits = pageViews
            .filter((row) => row.path.includes('?'))
            .reduce((sum, row) => sum + row.views, 0);

        const servicePathVariants = services.map((service) => {
            const variants = pageViews.filter((row) => {
                const barePath = row.path.split('?')[0];
                return (
                    barePath === `/services/${service.id}` ||
                    barePath === `/services/${service.slug}` ||
                    barePath === `/services/${service.normalizedSlug}`
                );
            });
            const total = variants.reduce((sum, row) => sum + row.views, 0);
            return {
                id: service.id,
                title: service.title,
                slug: service.slug,
                variants,
                total,
            };
        }).filter((item) => item.variants.length > 1 || item.variants.some((variant) => /^\/services\/\d+/.test(variant.path.split('?')[0])));

        const vitalNames = (vitalNamesResult.rows || []).map((row) => String(row.name || ''));
        const missingRealVitals = REAL_VITAL_NAMES.filter((name) => !vitalNames.includes(name));

        const scConnected = Boolean(settingsResult.rows?.[0]?.value);
        const sitemapLocs = extractLocs(sitemapXml);
        const sitemapHasNumericServices = sitemapLocs.some((loc) => /\/services\/\d+(?:$|\/)/.test(loc));
        const missingServiceSlugsInSitemap = services
            .map((service) => `/services/${service.slug}`)
            .filter(Boolean)
            .filter((slugPath) => !sitemapLocs.some((loc) => loc.endsWith(slugPath)));

        const previewBlockedInRobots = /Disallow:\s*\/service-preview\/?/i.test(robotsTxt);
        const layoutUsesLegacyLinks = LEGACY_SERVICE_PATHS.filter((legacyPath) => layoutSource.includes(`'${legacyPath}'`));
        const servicesSchemaUsesIds = servicesPageSource.includes('url: `https://jandrnw.com/services/${service.id}`');
        const serviceCanonicalUsesIds = serviceDetailSource.includes('canonical={`/services/${service.id}`}');
        const serviceDetailAcceptsIds = serviceDetailSource.includes('if (item.id.toString() === slug)');
        const suspiciousSlugs = services.filter((service) => /paiting/i.test(service.slug));
        const previewPaths = pageViews.filter((row) => row.path.startsWith('/service-preview')).map((row) => row.path);
        const numericServicePaths = pageViews.filter((row) => /^\/services\/\d+(?:$|[/?])/.test(row.path)).map((row) => row.path);
        const legacyServicePathsSeen = pageViews
            .filter((row) => LEGACY_SERVICE_PATHS.some((legacy) => row.path.startsWith(legacy)))
            .map((row) => row.path);
        const querystringPaths = pageViews.filter((row) => row.path.includes('?')).map((row) => row.path);

        let gscPageMetrics = [];
        let gscStatus = { connected: scConnected, reconnectRequired: false, error: '' };
        if (scConnected) {
            try {
                const auth = await getSearchConsoleAuth(req, db);
                const sc = google.searchconsole({ version: 'v1', auth });
                const siteUrl = getSearchConsoleSiteUrl(req);
                const endDate = new Date();
                const startDate = new Date(Date.now() - days * 86400000);
                const fmt = (date) => date.toISOString().slice(0, 10);
                const pagesRes = await sc.searchanalytics.query({
                    siteUrl,
                    requestBody: {
                        startDate: fmt(startDate),
                        endDate: fmt(endDate),
                        dimensions: ['page'],
                        rowLimit: 100,
                    },
                });
                gscPageMetrics = (pagesRes.data.rows || []).map((row) => ({
                    path: normalizeSearchConsolePage(row.keys?.[0], siteUrl),
                    clicks: Number(row.clicks || 0),
                    impressions: Number(row.impressions || 0),
                    ctr: Number(((row.ctr || 0) * 100).toFixed(1)),
                    position: Number((row.position || 0).toFixed(1)),
                }));
            } catch (err) {
                if (isGoogleReconnectRequiredError(err)) {
                    gscStatus = { connected: false, reconnectRequired: true, error: 'RECONNECT_REQUIRED' };
                } else if (err.message === 'GOOGLE_OAUTH_CONFIG_MISSING') {
                    gscStatus = { connected: false, reconnectRequired: false, error: 'Google OAuth env vars missing' };
                } else {
                    gscStatus = { connected: false, reconnectRequired: false, error: err.message || 'Search Console unavailable' };
                }
            }
        }

        const checks = [];

        if (!previewBlockedInRobots) {
            addCheck(
                checks,
                'warning',
                'Preview routes not blocked',
                'robots.txt does not block /service-preview, and preview traffic is already showing in analytics.',
                'Block preview routes later with noindex or robots rules after testing.',
                { affectedPaths: ['/service-preview', ...previewPaths.slice(0, 5)] }
            );
        } else {
            addCheck(checks, 'good', 'Preview robots rule present', 'robots.txt already contains a preview block rule.', 'Keep preview routes out of sitemap and internal links.');
        }

        if (previewHits > 0) {
            addCheck(
                checks,
                'warning',
                'Preview traffic detected',
                `${previewHits} pageviews reached preview URLs in last ${days} days.`,
                'Exclude preview traffic from SEO review and block indexing.',
                { affectedPaths: previewPaths.slice(0, 8) }
            );
        }

        if (numericServiceHits > 0) {
            addCheck(
                checks,
                'warning',
                'Numeric service URLs still receive traffic',
                `${numericServiceHits} pageviews hit /services/{id} style URLs in last ${days} days.`,
                'Plan redirects later so all service authority consolidates to one canonical format.',
                { affectedPaths: numericServicePaths.slice(0, 8) }
            );
        }

        if (legacyServiceHits > 0 || layoutUsesLegacyLinks.length > 0) {
            addCheck(
                checks,
                'warning',
                'Legacy service slugs still exist',
                `${legacyServiceHits} pageviews hit old service paths. Layout also still references ${layoutUsesLegacyLinks.length} legacy paths.`,
                'Add compatibility redirects or update internal links in a separate tested pass.',
                { legacyPaths: layoutUsesLegacyLinks, affectedPaths: [...LEGACY_SERVICE_PATHS, ...legacyServicePathsSeen.slice(0, 8)] }
            );
        }

        if (queryStringHits > 0) {
            addCheck(
                checks,
                'warning',
                'Tracked pageviews include querystrings',
                `${queryStringHits} pageviews were stored with query parameters, which fragments page-level analytics.`,
                'Strip tracking params from path before logging pageviews in a later analytics fix.',
                { affectedPaths: querystringPaths.slice(0, 8) }
            );
        }

        if (servicesSchemaUsesIds) {
            addCheck(
                checks,
                'warning',
                'Service schema URLs use numeric IDs',
                'Structured data on services page still points to /services/{id}.',
                'Switch schema URLs to the final service slug format in a later SEO pass.',
                { affectedPaths: services.map((service) => `/services/${service.id}`) }
            );
        }

        if (serviceCanonicalUsesIds && serviceDetailAcceptsIds) {
            addCheck(
                checks,
                'warning',
                'Service canonical points to ID path',
                'Service detail page accepts slug and ID variants, but canonical still uses /services/{id}.',
                'Consolidate to one URL format after testing redirects.',
                { affectedPaths: services.map((service) => `/services/${service.id}`) }
            );
        }

        if (sitemapHasNumericServices || missingServiceSlugsInSitemap.length > 0) {
            addCheck(
                checks,
                'warning',
                'Sitemap is out of sync with active service slugs',
                `Missing ${missingServiceSlugsInSitemap.length} active service slug URLs in sitemap. Numeric service URLs present: ${sitemapHasNumericServices ? 'yes' : 'no'}.`,
                'Regenerate sitemap from active service slugs in a dedicated update.',
                { affectedPaths: missingServiceSlugsInSitemap.slice(0, 12) }
            );
        }

        if (missingRealVitals.length > 0) {
            addCheck(
                checks,
                'info',
                'Real Core Web Vitals are not fully tracked',
                `Missing metrics: ${missingRealVitals.join(', ')}. Current monitor mainly stores custom Next.js metrics.`,
                'Add real CWV capture later if SEO performance monitoring becomes priority.'
            );
        } else {
            addCheck(checks, 'good', 'Core Web Vitals present', 'Real web vitals are stored in monitor tables.', 'Keep enough traffic volume to compare trends.');
        }

        if (scConnected) {
            addCheck(checks, 'good', 'Google Search Console token connected', 'Refresh token exists in settings table.', 'Use Search Console section for ranking/query checks.');
        } else {
            addCheck(checks, 'warning', 'Google Search Console not connected', 'No refresh token found in settings table.', 'Connect Google account to load Search Console data.');
        }

        if (suspiciousSlugs.length > 0) {
            addCheck(
                checks,
                'warning',
                'Suspicious service slug spelling detected',
                `Detected likely typo slugs: ${suspiciousSlugs.map((service) => service.slug).join(', ')}.`,
                'Do not rename blindly. Queue slug cleanup with redirects later.',
                { affectedPaths: suspiciousSlugs.map((service) => `/services/${service.slug}`) }
            );
        }

        const enrichedChecks = checks.map((check) => {
            const localHits = sumPageViews(pageViews, check.affectedPaths);
            const gscImpact = summarizeGscImpact(gscPageMetrics, check.affectedPaths);
            const priority = computePriority(check, localHits, gscImpact.impressions);
            const scoreImpact = computeScoreImpact(check, localHits, gscImpact.impressions);
            return {
                ...check,
                localHits,
                searchConsoleImpressions: gscImpact.impressions,
                searchConsoleClicks: gscImpact.clicks,
                impactedPages: gscImpact.rows.slice(0, 5),
                priority,
                scoreImpact,
            };
        });

        const score = Math.max(0, 100 - enrichedChecks.reduce((sum, check) => sum + check.scoreImpact, 0));

        const summary = enrichedChecks.reduce((acc, check) => {
            acc.total += 1;
            acc[check.severity] = (acc[check.severity] || 0) + 1;
            acc.priority[check.priority] = (acc.priority[check.priority] || 0) + 1;
            return acc;
        }, { total: 0, good: 0, info: 0, warning: 0, critical: 0, priority: { high: 0, medium: 0, low: 0, ok: 0 } });

        const priorityQueue = enrichedChecks
            .filter((check) => check.priority !== 'ok')
            .sort((a, b) => {
                const rank = { high: 3, medium: 2, low: 1, ok: 0 };
                if ((rank[b.priority] || 0) !== (rank[a.priority] || 0)) return (rank[b.priority] || 0) - (rank[a.priority] || 0);
                return b.scoreImpact - a.scoreImpact;
            })
            .slice(0, 8);

        const impactedPages = Object.values(
            enrichedChecks
                .flatMap((check) => check.impactedPages.map((row) => ({
                    ...row,
                    checkTitle: check.title,
                    checkPriority: check.priority,
                })))
                .reduce((acc, row) => {
                    const key = row.path;
                    if (!acc[key]) {
                        acc[key] = {
                            path: row.path,
                            clicks: row.clicks,
                            impressions: row.impressions,
                            ctr: row.ctr,
                            position: row.position,
                            priorities: new Set([row.checkPriority]),
                            checks: new Set([row.checkTitle]),
                        };
                    } else {
                        acc[key].clicks = Math.max(acc[key].clicks, row.clicks);
                        acc[key].impressions = Math.max(acc[key].impressions, row.impressions);
                        acc[key].ctr = Math.max(acc[key].ctr, row.ctr);
                        acc[key].position = Math.min(acc[key].position || row.position, row.position);
                        acc[key].priorities.add(row.checkPriority);
                        acc[key].checks.add(row.checkTitle);
                    }
                    return acc;
                }, {})
        ).map((row) => ({
            ...row,
            priorities: Array.from(row.priorities),
            checks: Array.from(row.checks),
        })).sort((a, b) => b.impressions - a.impressions).slice(0, 12);

        res.status(200).json({
            score,
            summary,
            checks: enrichedChecks,
            priorityQueue,
            traffic: {
                previewHits,
                numericServiceHits,
                legacyServiceHits,
                queryStringHits,
                servicePathVariants: servicePathVariants
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 8),
            },
            sitemap: {
                hasNumericServices: sitemapHasNumericServices,
                missingServiceSlugs: missingServiceSlugsInSitemap.slice(0, 12),
            },
            metrics: {
                trackedVitalNames: vitalNames,
                missingRealVitals,
            },
            searchConsole: {
                ...gscStatus,
                pageMetricsCount: gscPageMetrics.length,
                impactedPages,
            },
        });
    } catch (error) {
        console.error('SEO monitor error:', error);
        res.status(500).json({ error: 'Failed to load SEO diagnostics' });
    }
}
