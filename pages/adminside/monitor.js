import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import styles from '../../styles/Monitor.module.css';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../lib/auth';

const CHART_COLORS = ['#D4AF37', '#4CAF50', '#2196F3', '#FF9800', '#E91E63'];
const RATING_COLOR = { good: '#4CAF50', 'needs-improvement': '#FF9800', poor: '#ef5350', unknown: '#666' };
const RANGES = [
    { label: '7d',  days: 7 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
    { label: 'All', days: null },
];
const VITAL_RANGES = {
    LCP:  { max: 5000, good: 2500, poor: 4000 },
    CLS:  { max: 0.40, good: 0.1,  poor: 0.25 },
    INP:  { max: 600,  good: 200,  poor: 500  },
    FID:  { max: 600,  good: 200,  poor: 500  },
    FCP:  { max: 4000, good: 1800, poor: 3000 },
    TTFB: { max: 2500, good: 800,  poor: 1800 },
};

function VitalGauge({ name, value }) {
    const range = VITAL_RANGES[name];
    if (!range || value === null || value === undefined) return null;
    const { max, good, poor } = range;
    const goodPct  = (good / max) * 100;
    const needsPct = ((poor - good) / max) * 100;
    const poorPct  = 100 - goodPct - needsPct;
    const markerPct = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
        <div className={styles.vitalGauge}>
            <div className={styles.gaugeGood}  style={{ width: `${goodPct}%` }} />
            <div className={styles.gaugeNeeds} style={{ width: `${needsPct}%` }} />
            <div className={styles.gaugePoor}  style={{ width: `${poorPct}%` }} />
            <div className={styles.gaugeMarker} style={{ left: `${markerPct}%` }} />
        </div>
    );
}

const VITAL_DESCS = {
    LCP:  'Largest Contentful Paint — loading speed',
    CLS:  'Cumulative Layout Shift — visual stability',
    INP:  'Interaction to Next Paint — responsiveness',
    FID:  'First Input Delay — interactivity',
    FCP:  'First Contentful Paint — perceived load',
    TTFB: 'Time to First Byte — server speed',
};
const VITAL_ORDER = ['LCP', 'CLS', 'INP', 'FID', 'FCP', 'TTFB'];

function vitalRating(name, value) {
    if (value === null || value === undefined) return 'unknown';
    if (name === 'LCP')  return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
    if (name === 'CLS')  return value < 0.1  ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
    if (name === 'INP' || name === 'FID') return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
    if (name === 'FCP')  return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
    if (name === 'TTFB') return value < 800  ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
    return 'unknown';
}

function REAL_VITAL_COLOR(name) {
    return VITAL_ORDER.includes(name) ? '#4CAF50' : '#D4AF37';
}

function SEO_PRIORITY_COLOR(priority) {
    if (priority === 'high') return '#ef5350';
    if (priority === 'medium') return '#FF9800';
    if (priority === 'low') return '#2196F3';
    return '#4CAF50';
}

function StatCard({ label, value, sub, color, delay }) {
    return (
        <div className={styles.statCard} style={{ animationDelay: `${delay || 0}ms`, borderColor: color }}>
            <div className={styles.statValue} style={{ color }}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
            {sub && <div className={styles.statSub}>{sub}</div>}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className={styles.tooltip}>
            {label && <div className={styles.tooltipLabel}>{label}</div>}
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color || '#D4AF37' }}>
                    {p.name}: <strong>{p.value}</strong>
                </div>
            ))}
        </div>
    );
};

export default function Monitor() {
    const [range, setRange] = useState(RANGES[1]);
    const [stats, setStats]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [deps, setDeps]         = useState(null);
    const [depsLoading, setDepsLoading] = useState(false);
    const [depsError, setDepsError]     = useState('');
    const [sc, setSc]             = useState(null);
    const [scLoading, setScLoading] = useState(false);
    const [scError, setScError]     = useState('');
    const [ga4, setGa4]             = useState(null);
    const [ga4Loading, setGa4Loading] = useState(false);
    const [ga4Error, setGa4Error]     = useState('');
    const [clicks, setClicks]         = useState(null);
    const [seo, setSeo]               = useState(null);
    const [seoLoading, setSeoLoading] = useState(false);
    const [seoError, setSeoError]     = useState('');

    const renderGoogleReconnect = (color = '#4285F4') => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className={styles.aiError}>
                Google connection expired or revoked. Reconnect account.
            </div>
            <a href="/api/auth/google-sc-connect" className={styles.depBtn}
                style={{ borderColor: color, color, textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>
                Reconnect Google Account
            </a>
        </div>
    );

    useEffect(() => {
        setLoading(true);
        setFetchError('');
        const params = range.days ? `?days=${range.days}` : '';
        fetch(`/api/monitor/stats${params}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) setFetchError(data.error);
                else setStats(data);
            })
            .catch(() => setFetchError('Failed to load stats'))
            .finally(() => setLoading(false));

        fetch(`/api/monitor/click${params}`)
            .then(r => r.json())
            .then(data => { if (!data.error) setClicks(data.clicks); })
            .catch(() => {});
    }, [range]);

    const loadSC = () => {
        setScLoading(true);
        setScError('');
        const params = range.days ? `?days=${range.days}` : '?days=28';
        fetch(`/api/monitor/searchconsole${params}`)
            .then(r => r.json())
            .then(data => {
                if (data.reconnectRequired) setScError('RECONNECT_REQUIRED');
                else if (data.notConnected) setScError('NOT_CONNECTED');
                else if (data.error === 'invalid_grant') setScError('RECONNECT_REQUIRED');
                else if (data.error) setScError(data.error);
                else setSc(data);
            })
            .catch(() => setScError('Failed to load Search Console data'))
            .finally(() => setScLoading(false));
    };

    const loadGA4 = () => {
        setGa4Loading(true);
        setGa4Error('');
        const params = range.days ? `?days=${range.days}` : '?days=30';
        fetch(`/api/monitor/ga4${params}`)
            .then(r => r.json())
            .then(data => {
                if (data.reconnectRequired) setGa4Error('RECONNECT_REQUIRED');
                else if (data.notConnected) setGa4Error('NOT_CONNECTED');
                else if (data.error === 'invalid_grant') setGa4Error('RECONNECT_REQUIRED');
                else if (data.error) setGa4Error(data.error);
                else setGa4(data);
            })
            .catch(() => setGa4Error('Failed to load GA4 data'))
            .finally(() => setGa4Loading(false));
    };

    const runDepsCheck = () => {
        setDepsLoading(true);
        setDepsError('');
        fetch('/api/monitor/deps')
            .then(r => r.json())
            .then(data => {
                if (data.error) setDepsError(data.error);
                else setDeps(data);
            })
            .catch(() => setDepsError('Failed to run check'))
            .finally(() => setDepsLoading(false));
    };

    const loadSEO = () => {
        setSeoLoading(true);
        setSeoError('');
        const params = range.days ? `?days=${range.days}` : '?days=30';
        fetch(`/api/monitor/seo${params}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) setSeoError(data.error);
                else setSeo(data);
            })
            .catch(() => setSeoError('Failed to load SEO diagnostics'))
            .finally(() => setSeoLoading(false));
    };

    const exportSeoCsv = () => {
        if (!seo?.checks?.length || typeof window === 'undefined') return;
        const rows = [
            ['severity', 'priority', 'title', 'detail', 'next_step', 'local_hits', 'search_console_impressions', 'search_console_clicks'],
            ...seo.checks.map((check) => [
                check.severity,
                check.priority,
                check.title,
                (check.detail || '').replace(/\s+/g, ' ').trim(),
                (check.action || '').replace(/\s+/g, ' ').trim(),
                String(check.localHits || 0),
                String(check.searchConsoleImpressions || 0),
                String(check.searchConsoleClicks || 0),
            ]),
        ];
        const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `seo-diagnostics-${range.label}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) return <AdminLayout title="Monitor"><div className={styles.loading}>Loading monitor data...</div></AdminLayout>;
    if (fetchError) return <AdminLayout title="Monitor"><div className={styles.error}>{fetchError}</div></AdminLayout>;

    const vitalsMap = {};
    (stats?.vitals || []).forEach(v => { vitalsMap[v.name] = v; });
    const displayedVitals = VITAL_ORDER.filter(n => vitalsMap[n]);

    const deviceData = (stats?.deviceSplit || []).map(d => ({
        name: d.device_type || 'unknown',
        value: Number(d.count),
    }));

    const totalViews  = Number(stats?.totalViews  || 0);
    const uniquePages = Number(stats?.uniquePages || 0);
    const errorCount  = Number(stats?.errorCount  || 0);

    const lcpV    = vitalsMap['LCP'];
    const lcpVal  = lcpV ? Math.round(lcpV.avg_value) : null;
    const lcpRate = vitalRating('LCP', lcpVal);

    const clsV    = vitalsMap['CLS'];
    const clsVal  = clsV ? Number(clsV.avg_value).toFixed(3) : null;
    const clsRate = vitalRating('CLS', clsVal ? Number(clsVal) : null);

    return (
        <AdminLayout title="Monitor">
            <div className={styles.container}>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.rangeGroup}>
                        {RANGES.map(r => (
                            <button
                                key={r.label}
                                className={`${styles.rangeBtn} ${range.label === r.label ? styles.rangeBtnActive : ''}`}
                                onClick={() => setRange(r)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.liveIndicator}>
                        <span className={styles.liveDot} /> Live Tracking Active
                    </div>
                </div>

                {/* Stat Cards */}
                <div className={styles.statsGrid}>
                    <StatCard label="Total Page Views" value={totalViews.toLocaleString()} color="#D4AF37" delay={0} />
                    <StatCard label="Unique Pages"     value={uniquePages}                  color="#4CAF50" delay={80} />
                    <StatCard label="Avg LCP"          value={lcpVal ? `${lcpVal}ms` : '—'} color={RATING_COLOR[lcpRate]} delay={160} sub={lcpVal ? lcpRate.replace('-', ' ') : 'no data'} />
                    <StatCard label="Avg CLS"          value={clsVal || '—'}                color={RATING_COLOR[clsRate]} delay={240} sub={clsVal ? clsRate.replace('-', ' ') : 'no data'} />
                    <StatCard label="JS Errors"        value={errorCount}                   color={errorCount > 0 ? '#ef5350' : '#4CAF50'} delay={320} />
                </div>

                {/* Conversion Clicks */}
                {clicks !== null && (() => {
                    const clickMap = {};
                    clicks.forEach(c => { clickMap[c.event] = Number(c.count); });
                    return (
                        <div className={styles.chartCard}>
                            <h2 className={styles.sectionTitle}>Conversion Clicks</h2>
                            <div className={styles.statsGrid}>
                                <StatCard label="Phone Clicks"      value={clickMap['phone_click']      || 0} color="#4CAF50" delay={0} sub="(503) 998-2340" />
                                <StatCard label="Email Clicks"      value={clickMap['email_click']      || 0} color="#2196F3" delay={80} sub="topbar email" />
                                <StatCard label="Estimate Submits"  value={clickMap['form_submit_click'] || 0} color="#D4AF37" delay={160} sub="free estimate form" />
                            </div>
                        </div>
                    );
                })()}

                {/* Traffic over time */}
                <div className={styles.chartCard}>
                    <h2 className={styles.sectionTitle}>Traffic Over Time</h2>
                    {stats?.byDay?.length > 1 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={stats.byDay} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="day" tick={{ fill: '#aaa', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#aaa', fontSize: 11 }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="views" name="Views" stroke="#D4AF37"
                                    strokeWidth={2.5} fill="url(#trafficGrad)"
                                    dot={{ fill: '#D4AF37', r: 4 }} activeDot={{ r: 7 }} animationDuration={900} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className={styles.empty}>
                            No traffic data yet. Visitors are tracked automatically when they browse the site.
                        </div>
                    )}
                </div>

                {/* Top Pages + Device Split */}
                <div className={styles.chartsRow}>
                    <div className={styles.chartCard}>
                        <h2 className={styles.sectionTitle}>Top Pages</h2>
                        {stats?.topPages?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={Math.max(180, stats.topPages.length * 36)}>
                                <BarChart
                                    layout="vertical"
                                    data={stats.topPages.slice(0, 8).map(p => ({
                                        path: p.path.length > 28 ? p.path.slice(0, 28) + '…' : p.path,
                                        views: Number(p.views),
                                    }))}
                                    margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: '#aaa', fontSize: 11 }} allowDecimals={false} />
                                    <YAxis type="category" dataKey="path" tick={{ fill: '#aaa', fontSize: 11 }} width={130} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="views" name="Views" fill="#D4AF37" radius={[0, 4, 4, 0]} animationDuration={800} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className={styles.empty}>No page view data yet</div>}
                    </div>

                    <div className={styles.chartCard}>
                        <h2 className={styles.sectionTitle}>Device Split</h2>
                        {deviceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie data={deviceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" animationDuration={800}>
                                        {deviceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend formatter={val => <span style={{ color: '#ccc', textTransform: 'capitalize' }}>{val}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className={styles.empty}>No device data yet</div>}
                    </div>
                </div>

                {/* Core Web Vitals */}
                <div className={styles.chartCard} style={{ marginTop: 24 }}>
                    <h2 className={styles.sectionTitle}>Core Web Vitals</h2>
                    {displayedVitals.length > 0 ? (
                        <div className={styles.vitalsGrid}>
                            {displayedVitals.map(name => {
                                const v      = vitalsMap[name];
                                const avg    = Number(v.avg_value);
                                const rating = vitalRating(name, avg);
                                const color  = RATING_COLOR[rating];
                                const fmt    = name === 'CLS' ? avg.toFixed(3) : `${Math.round(avg)}ms`;
                                const goodPct = Number(v.samples) > 0 ? Math.round((Number(v.good_count) / Number(v.samples)) * 100) : 0;
                                return (
                                    <div key={name} className={styles.vitalCard} style={{ borderColor: color }}>
                                        <div className={styles.vitalName}>{name}</div>
                                        <div className={styles.vitalValue} style={{ color }}>{fmt}</div>
                                        <div className={styles.vitalRating} style={{ color }}>{rating.replace(/-/g, ' ')}</div>
                                        <VitalGauge name={name} value={avg} />
                                        <div className={styles.vitalMeta}>{Number(v.samples).toLocaleString()} samples · {goodPct}% good</div>
                                        <div className={styles.vitalDesc}>{VITAL_DESCS[name]}</div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            No vitals data yet. Will populate once real visitors use the site.
                        </div>
                    )}
                </div>

                {/* Top Referrers */}
                <div className={styles.chartCard} style={{ marginTop: 24 }}>
                    <h2 className={styles.sectionTitle}>Top Referrers</h2>
                    {stats?.referrers?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={Math.max(180, stats.referrers.length * 36)}>
                            <BarChart
                                layout="vertical"
                                data={stats.referrers.filter(r => {
                                    const h = (r.referrer || '').replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
                                    return !/^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(h);
                                }).slice(0, 8).map(r => ({
                                    source: (r.referrer || 'Direct').replace(/^https?:\/\/(www\.)?/, '').split('/')[0].slice(0, 30),
                                    visits: Number(r.count),
                                }))}
                                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#aaa', fontSize: 11 }} allowDecimals={false} />
                                <YAxis type="category" dataKey="source" tick={{ fill: '#aaa', fontSize: 11 }} width={130} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="visits" name="Visits" fill="#4CAF50" radius={[0, 4, 4, 0]} animationDuration={800} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <div className={styles.empty}>No referrer data yet</div>}
                </div>

                {/* JS Errors */}
                <div className={styles.chartCard} style={{ marginTop: 24 }}>
                    <h2 className={styles.sectionTitle}>JavaScript Errors</h2>
                    {stats?.errors?.length > 0 ? (
                        <table className={styles.table}>
                            <thead><tr><th>Error</th><th>Page</th><th>Count</th></tr></thead>
                            <tbody>
                                {stats.errors.map((e, i) => (
                                    <tr key={i}>
                                        <td style={{ fontSize: '0.8rem', color: '#ef9090', maxWidth: 400, wordBreak: 'break-word' }}>{e.message}</td>
                                        <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{e.path}</td>
                                        <td style={{ color: '#ef5350', fontWeight: 700 }}>{Number(e.occurrences).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className={styles.empty} style={{ color: '#4CAF50' }}>No JavaScript errors detected</div>}
                </div>

                {/* Google Analytics 4 */}
                <div className={styles.chartCard} style={{ marginTop: 24, borderColor: 'rgba(66,133,244,0.3)' }}>
                    <h2 className={styles.sectionTitle}>Google Analytics 4</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <span style={{ background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.35)', borderRadius: 6, padding: '3px 10px', color: '#4CAF50', fontSize: '0.78rem', fontWeight: 600 }}>
                            TRACKING ACTIVE — G-8GM4CDHB35
                        </span>
                    </div>
                    {!ga4 && !ga4Loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button className={styles.depBtn} style={{ borderColor: '#4285F4', color: '#4285F4' }} onClick={loadGA4}>
                                Load GA4 Data
                            </button>
                            {ga4Error === 'RECONNECT_REQUIRED' ? (
                                renderGoogleReconnect('#4285F4')
                            ) : ga4Error === 'NOT_CONNECTED' ? (
                                <a href="/api/auth/google-sc-connect" className={styles.depBtn}
                                    style={{ borderColor: '#4285F4', color: '#4285F4', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>
                                    Connect Google Account
                                </a>
                            ) : ga4Error ? (
                                <div className={styles.aiError}>{ga4Error}</div>
                            ) : null}
                        </div>
                    )}
                    {ga4Loading && <div className={styles.depScanning}>Fetching GA4 data...</div>}
                    {ga4 && (
                        <div>
                            {/* Summary cards */}
                            <div className={styles.scTotals}>
                                {[
                                    { label: 'Active Users',   value: Number(ga4.summary.activeUsers).toLocaleString(),  color: '#4285F4' },
                                    { label: 'Sessions',       value: Number(ga4.summary.sessions).toLocaleString(),      color: '#D4AF37' },
                                    { label: 'Page Views',     value: Number(ga4.summary.pageViews).toLocaleString(),     color: '#4CAF50' },
                                    { label: 'Bounce Rate',    value: `${ga4.summary.bounceRate}%`,                       color: '#FF9800' },
                                    { label: 'Avg Session',    value: `${Math.floor(ga4.summary.avgSession / 60)}m ${ga4.summary.avgSession % 60}s`, color: '#9C27B0' },
                                    { label: 'New Users',      value: Number(ga4.summary.newUsers).toLocaleString(),      color: '#00BCD4' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className={styles.scCard} style={{ borderColor: `${color}40` }}>
                                        <div className={styles.vulnCount} style={{ color, fontSize: '1.5rem' }}>{value}</div>
                                        <div className={styles.vulnLabel}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Users over time */}
                            {ga4.byDay?.length > 1 && (
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Users Over Time</div>
                                    <ResponsiveContainer width="100%" height={190}>
                                        <AreaChart data={ga4.byDay.map(d => ({
                                            date: d.date.replace(/^(\d{4})(\d{2})(\d{2})$/, '$2/$3'),
                                            users: d.users,
                                            sessions: d.sessions,
                                        }))} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="ga4Grad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%"  stopColor="#4285F4" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                            <XAxis dataKey="date" tick={{ fill: '#aaa', fontSize: 10 }} />
                                            <YAxis tick={{ fill: '#aaa', fontSize: 10 }} allowDecimals={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="users" name="Users" stroke="#4285F4" fill="url(#ga4Grad)" strokeWidth={2} animationDuration={900} />
                                            <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#D4AF37" fill="none" strokeWidth={1.5} strokeDasharray="4 2" animationDuration={900} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* Top pages + Traffic sources */}
                            <div className={styles.chartsRow} style={{ marginTop: 20 }}>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Top Pages</div>
                                    {ga4.topPages?.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={Math.max(160, ga4.topPages.length * 34)}>
                                            <BarChart layout="vertical"
                                                data={ga4.topPages.map(p => ({
                                                    page: p.page.length > 26 ? p.page.slice(0, 26) + '…' : p.page,
                                                    views: p.views,
                                                }))}
                                                margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                                                <XAxis type="number" tick={{ fill: '#aaa', fontSize: 10 }} allowDecimals={false} />
                                                <YAxis type="category" dataKey="page" tick={{ fill: '#aaa', fontSize: 10 }} width={120} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="views" name="Views" fill="#4285F4" radius={[0, 4, 4, 0]} animationDuration={800} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : <div className={styles.empty}>No page data</div>}
                                </div>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Traffic Sources</div>
                                    {ga4.sources?.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <PieChart>
                                                <Pie data={ga4.sources.map(s => ({ name: s.channel, value: s.sessions }))}
                                                    cx="50%" cy="50%" outerRadius={80} dataKey="value" animationDuration={800}>
                                                    {ga4.sources.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend formatter={val => <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{val}</span>} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : <div className={styles.empty}>No source data</div>}
                                </div>
                            </div>

                            <button className={styles.resetBtn} style={{ marginTop: 14 }} onClick={loadGA4}>Refresh</button>
                        </div>
                    )}
                </div>

                {/* Dependency Health */}
                <div className={styles.chartCard} style={{ marginTop: 24 }}>
                    <h2 className={styles.sectionTitle}>Dependency Health</h2>
                    <p style={{ color: '#777', fontSize: '0.85rem', margin: '0 0 14px' }}>
                        Runs npm audit + npm outdated on the server. Takes ~15 seconds.
                    </p>
                    <button className={styles.depBtn} onClick={runDepsCheck} disabled={depsLoading}>
                        {depsLoading ? 'Scanning...' : 'Run Dependency Check'}
                    </button>
                    {depsError && <div className={styles.aiError} style={{ marginTop: 10 }}>{depsError}</div>}
                    {depsLoading && <div className={styles.depScanning}>Scanning packages — this may take up to 30 seconds...</div>}
                    {deps && (
                        <div style={{ marginTop: 16 }}>
                            <div className={styles.vulnRow}>
                                {[
                                    { label: 'Critical', key: 'critical', color: '#ef5350' },
                                    { label: 'High',     key: 'high',     color: '#FF5722' },
                                    { label: 'Moderate', key: 'moderate', color: '#FF9800' },
                                    { label: 'Low',      key: 'low',      color: '#FFC107' },
                                ].map(({ label, key, color }) => {
                                    const count = deps.vulnerabilities?.[key] || 0;
                                    return (
                                        <div key={key} className={styles.vulnCard} style={{ borderColor: count > 0 ? color : 'rgba(255,255,255,0.08)' }}>
                                            <div className={styles.vulnCount} style={{ color: count > 0 ? color : '#4CAF50' }}>{count}</div>
                                            <div className={styles.vulnLabel}>{label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            {deps.totalVulns === 0 && (
                                <div style={{ color: '#4CAF50', fontSize: '0.85rem', margin: '10px 0' }}>No vulnerabilities found.</div>
                            )}
                            {deps.outdated?.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ color: '#D4AF37', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10 }}>
                                        {deps.outdated.length} outdated package{deps.outdated.length !== 1 ? 's' : ''}
                                    </div>
                                    <table className={styles.table}>
                                        <thead><tr><th>Package</th><th>Current</th><th>Wanted</th><th>Latest</th></tr></thead>
                                        <tbody>
                                            {deps.outdated.map((p, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#e0c97a' }}>{p.name}</td>
                                                    <td style={{ color: '#888' }}>{p.current || '—'}</td>
                                                    <td style={{ color: '#FF9800' }}>{p.wanted}</td>
                                                    <td style={{ color: '#4CAF50' }}>{p.latest}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {deps.outdated?.length === 0 && (
                                <div style={{ color: '#4CAF50', fontSize: '0.85rem', marginTop: 10 }}>All packages up to date.</div>
                            )}
                            <div style={{ color: '#555', fontSize: '0.72rem', marginTop: 12 }}>
                                Scanned at {new Date(deps.auditedAt).toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Token rotation reminder */}
                <div className={styles.chartCard} style={{ marginTop: 24, borderColor: 'rgba(239,83,80,0.35)' }}>
                    <h2 className={styles.sectionTitle}>Security Token Reminder</h2>
                    <div className={styles.tokenGrid}>
                        <div className={styles.tokenCard}>
                            <div className={styles.tokenName}>ADMIN_SESSION_SECRET</div>
                            <div className={styles.tokenDesc}>Controls admin login sessions. Rotate every 6 months — all existing sessions will be invalidated.</div>
                            <div className={styles.tokenSteps}>
                                <div className={styles.step}><span>1</span> Generate new secret: <code style={{ background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: 3, color: '#e0c97a' }}>openssl rand -hex 32</code></div>
                                <div className={styles.step}><span>2</span> Update in <code style={{ background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: 3, color: '#e0c97a' }}>.env.local</code> and <code style={{ background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: 3, color: '#e0c97a' }}>ecosystem.config.js</code></div>
                                <div className={styles.step}><span>3</span> Restart PM2: <code style={{ background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: 3, color: '#e0c97a' }}>pm2 restart all</code></div>
                            </div>
                        </div>
                        <div className={styles.tokenCard}>
                            <div className={styles.tokenName}>TURSO_AUTH_TOKEN</div>
                            <div className={styles.tokenDesc}>Database access token. Rotate every 6 months in Turso dashboard and update environment variables.</div>
                            <div className={styles.tokenSteps}>
                                <div className={styles.step}><span>1</span> Go to Turso dashboard → your DB → Tokens → Create new</div>
                                <div className={styles.step}><span>2</span> Update <code style={{ background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: 3, color: '#e0c97a' }}>TURSO_AUTH_TOKEN</code> in .env.local and ecosystem.config.js</div>
                                <div className={styles.step}><span>3</span> Restart PM2: <code style={{ background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: 3, color: '#e0c97a' }}>pm2 restart all</code></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance Checklist */}
                <div className={styles.chartCard} style={{ marginTop: 24 }}>
                    <h2 className={styles.sectionTitle}>Maintenance Checklist</h2>
                    <p style={{ color: '#777', fontSize: '0.85rem', margin: '0 0 16px' }}>
                        Click tasks to mark done. Dates saved in browser. Reset each group when starting a new cycle.
                    </p>
                    <MaintenanceChecklist />
                </div>

                {/* SEO Diagnostics */}
                <div className={styles.chartCard} style={{ marginTop: 24, borderColor: 'rgba(212,175,55,0.28)' }}>
                    <h2 className={styles.sectionTitle}>SEO Diagnostics</h2>
                    <p style={{ color: '#777', fontSize: '0.85rem', margin: '0 0 14px' }}>
                        Reads internal SEO signals only: sitemap, robots, service URL variants, preview traffic, tracked vitals, and Search Console connection state.
                    </p>
                    <button className={styles.depBtn} style={{ borderColor: '#D4AF37', color: '#D4AF37' }} onClick={loadSEO} disabled={seoLoading}>
                        {seoLoading ? 'Scanning SEO...' : 'Run SEO Diagnostics'}
                    </button>
                    {seoError && <div className={styles.aiError} style={{ marginTop: 10 }}>{seoError}</div>}
                    {seoLoading && <div className={styles.depScanning}>Checking sitemap, robots, traffic variants, and monitor telemetry...</div>}
                    {seo && (
                        <div style={{ marginTop: 16 }}>
                            <div className={styles.scTotals}>
                                {[
                                    { label: 'SEO Score', value: `${seo.score || 0}/100`, color: seo.score >= 85 ? '#4CAF50' : seo.score >= 65 ? '#FF9800' : '#ef5350' },
                                    { label: 'Warnings', value: seo.summary.warning || 0, color: '#FF9800' },
                                    { label: 'High Priority', value: seo.summary.priority?.high || 0, color: '#ef5350' },
                                    { label: 'Medium Priority', value: seo.summary.priority?.medium || 0, color: '#2196F3' },
                                    { label: 'Good', value: seo.summary.good || 0, color: '#4CAF50' },
                                    { label: 'Preview Hits', value: Number(seo.traffic.previewHits || 0).toLocaleString(), color: '#E91E63' },
                                    { label: 'Numeric URL Hits', value: Number(seo.traffic.numericServiceHits || 0).toLocaleString(), color: '#2196F3' },
                                    { label: 'Legacy URL Hits', value: Number(seo.traffic.legacyServiceHits || 0).toLocaleString(), color: '#D4AF37' },
                                    { label: 'Querystring Hits', value: Number(seo.traffic.queryStringHits || 0).toLocaleString(), color: '#9C27B0' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className={styles.scCard} style={{ borderColor: `${color}40` }}>
                                        <div className={styles.vulnCount} style={{ color, fontSize: '1.5rem' }}>{value}</div>
                                        <div className={styles.vulnLabel}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                                <div style={{ color: '#888', fontSize: '0.78rem' }}>
                                    Search Console linked pages in diagnostics: {Number(seo.searchConsole?.pageMetricsCount || 0).toLocaleString()}
                                </div>
                                <button className={styles.resetBtn} onClick={exportSeoCsv}>Export CSV</button>
                            </div>

                            {seo.priorityQueue?.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                        Priority Queue
                                    </div>
                                    <table className={styles.table}>
                                        <thead><tr><th>Priority</th><th>Check</th><th>Local Hits</th><th>SC Impressions</th><th>Why It Matters</th></tr></thead>
                                        <tbody>
                                            {seo.priorityQueue.map((check, i) => (
                                                <tr key={`${check.title}-${i}`}>
                                                    <td style={{ color: SEO_PRIORITY_COLOR(check.priority), fontWeight: 700, textTransform: 'uppercase', fontSize: '0.76rem' }}>{check.priority}</td>
                                                    <td style={{ fontSize: '0.82rem', color: '#f3ead2' }}>{check.title}</td>
                                                    <td style={{ color: '#D4AF37', fontWeight: 700 }}>{Number(check.localHits || 0).toLocaleString()}</td>
                                                    <td style={{ color: '#4CAF50', fontWeight: 700 }}>{Number(check.searchConsoleImpressions || 0).toLocaleString()}</td>
                                                    <td style={{ fontSize: '0.8rem', color: '#cfcfcf' }}>{check.detail}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div style={{ marginTop: 18 }}>
                                <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                    Findings
                                </div>
                                <table className={styles.table}>
                                    <thead><tr><th>Severity</th><th>Priority</th><th>Check</th><th>Evidence</th><th>Recommended Next Step</th></tr></thead>
                                    <tbody>
                                        {seo.checks.map((check, i) => {
                                            const color = check.severity === 'good'
                                                ? '#4CAF50'
                                                : check.severity === 'info'
                                                    ? '#2196F3'
                                                    : check.severity === 'critical'
                                                        ? '#ef5350'
                                                        : '#FF9800';
                                            return (
                                                <tr key={i}>
                                                    <td style={{ color, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.76rem' }}>{check.severity}</td>
                                                    <td style={{ color: SEO_PRIORITY_COLOR(check.priority), fontWeight: 700, textTransform: 'uppercase', fontSize: '0.76rem' }}>{check.priority}</td>
                                                    <td style={{ fontSize: '0.82rem', color: '#f3ead2' }}>{check.title}</td>
                                                    <td style={{ fontSize: '0.8rem', color: '#cfcfcf' }}>
                                                        <div>{check.detail}</div>
                                                        {(check.localHits > 0 || check.searchConsoleImpressions > 0) && (
                                                            <div style={{ color: '#8f8f8f', marginTop: 4 }}>
                                                                Local hits: {Number(check.localHits || 0).toLocaleString()} · SC impressions: {Number(check.searchConsoleImpressions || 0).toLocaleString()} · SC clicks: {Number(check.searchConsoleClicks || 0).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ fontSize: '0.8rem', color: '#9a9a9a' }}>{check.action}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {seo.traffic.servicePathVariants?.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                        Service URL Variants Seen In Traffic
                                    </div>
                                    <table className={styles.table}>
                                        <thead><tr><th>Service</th><th>Slug</th><th>Variants</th><th>Total Hits</th></tr></thead>
                                        <tbody>
                                            {seo.traffic.servicePathVariants.map((item) => (
                                                <tr key={item.id}>
                                                    <td style={{ fontSize: '0.82rem', color: '#f3ead2' }}>{item.title}</td>
                                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#D4AF37' }}>{item.slug || 'â€”'}</td>
                                                    <td style={{ fontSize: '0.78rem', color: '#ccc', maxWidth: 420 }}>
                                                        {item.variants.map((variant) => `${variant.path} (${variant.views})`).join(', ')}
                                                    </td>
                                                    <td style={{ color: '#4CAF50', fontWeight: 700 }}>{Number(item.total).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {(seo.sitemap?.missingServiceSlugs?.length > 0 || seo.metrics?.trackedVitalNames?.length > 0 || seo.searchConsole?.impactedPages?.length > 0) && (
                                <div className={styles.chartsRow} style={{ marginTop: 20 }}>
                                    <div>
                                        <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                            Missing Sitemap Service Slugs
                                        </div>
                                        {seo.sitemap.missingServiceSlugs?.length > 0 ? (
                                            <table className={styles.table}>
                                                <thead><tr><th>Path</th></tr></thead>
                                                <tbody>
                                                    {seo.sitemap.missingServiceSlugs.map((slugPath) => (
                                                        <tr key={slugPath}>
                                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#FF9800' }}>{slugPath}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : <div className={styles.empty}>No sitemap slug gaps detected</div>}
                                    </div>
                                    <div>
                                        <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                            Tracked Vitals Metrics
                                        </div>
                                        {seo.metrics.trackedVitalNames?.length > 0 ? (
                                            <table className={styles.table}>
                                                <thead><tr><th>Metric</th></tr></thead>
                                                <tbody>
                                                    {seo.metrics.trackedVitalNames.map((metric) => (
                                                        <tr key={metric}>
                                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: REAL_VITAL_COLOR(metric) }}>{metric}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : <div className={styles.empty}>No vitals stored yet</div>}
                                    </div>
                                </div>
                            )}

                            {seo.searchConsole?.impactedPages?.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                        Problematic Pages With Search Console Visibility
                                    </div>
                                    <table className={styles.table}>
                                        <thead><tr><th>Page</th><th>Impressions</th><th>Clicks</th><th>Pos</th><th>Triggered Checks</th></tr></thead>
                                        <tbody>
                                            {seo.searchConsole.impactedPages.map((page) => (
                                                <tr key={page.path}>
                                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#f3ead2' }}>{page.path}</td>
                                                    <td style={{ color: '#4CAF50', fontWeight: 700 }}>{Number(page.impressions || 0).toLocaleString()}</td>
                                                    <td style={{ color: '#D4AF37', fontWeight: 700 }}>{Number(page.clicks || 0).toLocaleString()}</td>
                                                    <td style={{ color: '#FF9800' }}>{page.position}</td>
                                                    <td style={{ fontSize: '0.78rem', color: '#cfcfcf' }}>{page.checks.join(', ')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* SEO / Search Console */}
                <div className={styles.chartCard} style={{ marginTop: 24, borderColor: 'rgba(52,168,83,0.3)' }}>
                    <h2 className={styles.sectionTitle}>SEO & Search Console</h2>
                    {!sc && !scLoading && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button className={styles.depBtn} style={{ borderColor: '#4CAF50', color: '#4CAF50' }} onClick={loadSC}>
                                Load Search Console Data
                            </button>
                            {scError === 'RECONNECT_REQUIRED' ? (
                                renderGoogleReconnect('#4CAF50')
                            ) : scError === 'NOT_CONNECTED' || scError?.includes('NOT_CONNECTED') ? (
                                <a href="/api/auth/google-sc-connect" className={styles.depBtn}
                                    style={{ borderColor: '#4285F4', color: '#4285F4', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>
                                    Connect Google Account
                                </a>
                            ) : scError ? (
                                <div className={styles.aiError}>{scError}</div>
                            ) : null}
                        </div>
                    )}
                    {scLoading && <div className={styles.depScanning}>Fetching Search Console data...</div>}
                    {sc && (
                        <div>
                            {/* Totals */}
                            <div className={styles.scTotals}>
                                {[
                                    { label: 'Total Clicks',      value: sc.totals.clicks.toLocaleString(),      color: '#4CAF50' },
                                    { label: 'Total Impressions',  value: sc.totals.impressions.toLocaleString(), color: '#2196F3' },
                                    { label: 'Avg CTR',           value: `${sc.totals.ctr}%`,                    color: '#FF9800' },
                                    { label: 'Avg Position',      value: sc.totals.position,                     color: '#D4AF37' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className={styles.scCard} style={{ borderColor: `${color}40` }}>
                                        <div className={styles.vulnCount} style={{ color, fontSize: '1.6rem' }}>{value}</div>
                                        <div className={styles.vulnLabel}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Clicks over time */}
                            {sc.byDate?.length > 1 && (
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Clicks Over Time</div>
                                    <ResponsiveContainer width="100%" height={180}>
                                        <AreaChart data={sc.byDate} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="scGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%"  stopColor="#4CAF50" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                            <XAxis dataKey="date" tick={{ fill: '#aaa', fontSize: 10 }} />
                                            <YAxis tick={{ fill: '#aaa', fontSize: 10 }} allowDecimals={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#4CAF50" fill="url(#scGrad)" strokeWidth={2} animationDuration={900} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* Top queries + top pages */}
                            <div className={styles.chartsRow} style={{ marginTop: 20 }}>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Top Queries</div>
                                    <table className={styles.table}>
                                        <thead><tr><th>Query</th><th>Clicks</th><th>Pos</th></tr></thead>
                                        <tbody>
                                            {sc.topQueries.map((q, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontSize: '0.82rem' }}>{q.query}</td>
                                                    <td>{q.clicks}</td>
                                                    <td style={{ color: Number(q.position) <= 10 ? '#4CAF50' : '#FF9800' }}>{q.position}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Top Pages</div>
                                    <table className={styles.table}>
                                        <thead><tr><th>Page</th><th>Clicks</th><th>CTR</th></tr></thead>
                                        <tbody>
                                            {sc.topPages.map((p, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>{p.page}</td>
                                                    <td>{p.clicks}</td>
                                                    <td style={{ color: '#FF9800' }}>{p.ctr}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <button className={styles.resetBtn} style={{ marginTop: 14 }} onClick={loadSC}>Refresh</button>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}

const MAINTENANCE_TASKS = [
    {
        group: 'Monthly',
        color: '#4CAF50',
        tasks: [
            { id: 'm1', text: 'Check Monitor tab — errors, traffic trends, vitals' },
            { id: 'm2', text: 'Review Analytics — leads, conversion rate, follow up on not interested' },
            { id: 'm3', text: 'Check Hostinger hPanel — disk space and RAM' },
            { id: 'm4', text: 'Test contact form end-to-end (submit a real test lead)' },
        ],
    },
    {
        group: 'Every 3 Months',
        color: '#FF9800',
        tasks: [
            { id: 'q1', text: 'Run npm audit — check for security vulnerabilities in dependencies' },
            { id: 'q2', text: 'Update packages (npm update) — especially Next.js and @anthropic-ai/sdk' },
            { id: 'q3', text: 'Review Yelp reviews — update testimonials section if new good ones' },
            { id: 'q4', text: 'Update project gallery — add photos of recent completed jobs' },
        ],
    },
    {
        group: 'Every 6 Months',
        color: '#2196F3',
        tasks: [
            { id: 'h1', text: 'Rotate ADMIN_SESSION_SECRET — update in .env.local and ecosystem.config.js' },
            { id: 'h2', text: 'Rotate TURSO_AUTH_TOKEN — generate new token in Turso dashboard' },
            { id: 'h3', text: 'Check Google Search Console — fix crawl errors or ranking drops' },
            { id: 'h4', text: 'Test site on mobile — verify nothing broke on small screens' },
            { id: 'h5', text: 'Review services page — update pricing or offerings if changed' },
        ],
    },
];

function MaintenanceChecklist() {
    const [checks, setChecks] = useState({});

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('jandr_maintenance') || '{}');
            setChecks(saved);
        } catch {}
    }, []);

    const toggle = (id) => {
        setChecks(prev => {
            const next = { ...prev };
            if (next[id]) {
                delete next[id];
            } else {
                next[id] = Date.now();
            }
            try { localStorage.setItem('jandr_maintenance', JSON.stringify(next)); } catch {}
            return next;
        });
    };

    const resetGroup = (ids) => {
        setChecks(prev => {
            const next = { ...prev };
            ids.forEach(id => delete next[id]);
            try { localStorage.setItem('jandr_maintenance', JSON.stringify(next)); } catch {}
            return next;
        });
    };

    return (
        <div className={styles.maintenanceGrid}>
            {MAINTENANCE_TASKS.map(group => {
                const doneCount = group.tasks.filter(t => checks[t.id]).length;
                return (
                    <div key={group.group} className={styles.maintenanceGroup} style={{ borderColor: `${group.color}40` }}>
                        <div className={styles.maintenanceGroupHeader}>
                            <span className={styles.maintenanceGroupTitle} style={{ color: group.color }}>{group.group}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span className={styles.maintenanceCount} style={{ color: group.color }}>
                                    {doneCount}/{group.tasks.length}
                                </span>
                                {doneCount > 0 && (
                                    <button className={styles.resetBtn} onClick={() => resetGroup(group.tasks.map(t => t.id))}>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={styles.maintenanceProgress}>
                            <div className={styles.maintenanceProgressFill}
                                style={{ width: `${(doneCount / group.tasks.length) * 100}%`, background: group.color }} />
                        </div>
                        <ul className={styles.taskList}>
                            {group.tasks.map(task => {
                                const done = !!checks[task.id];
                                const ts   = checks[task.id];
                                return (
                                    <li key={task.id} className={`${styles.taskItem} ${done ? styles.taskDone : ''}`}
                                        onClick={() => toggle(task.id)}>
                                        <span className={styles.taskCheck} style={{ borderColor: group.color, background: done ? group.color : 'transparent' }}>
                                            {done && '✓'}
                                        </span>
                                        <span className={styles.taskText}>{task.text}</span>
                                        {done && ts && (
                                            <span className={styles.taskDate}>
                                                {new Date(ts).toLocaleDateString()}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

export async function getServerSideProps({ req }) {
    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return { redirect: { destination: '/adminside', permanent: false } };
    }
    return { props: {} };
}
