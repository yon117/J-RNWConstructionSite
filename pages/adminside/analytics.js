import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line, CartesianGrid,
} from 'recharts';
import styles from '../../styles/Analytics.module.css';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../lib/auth';

const STATUS_COLORS = {
    new: '#4CAF50',
    viewed: '#2196F3',
    contacted: '#FF9800',
    pending: '#FFC107',
    not_interested: '#9E9E9E',
};
const CHART_COLORS = ['#D4AF37', '#4CAF50', '#2196F3', '#FF9800', '#FFC107', '#E91E63', '#9C27B0'];
const RANGES = [
    { label: '7d',   days: 7 },
    { label: '30d',  days: 30 },
    { label: '90d',  days: 90 },
    { label: 'All',  days: null },
];
const PRIORITY_COLOR = { high: '#ef5350', medium: '#FF9800', low: '#4CAF50' };

function StatCard({ label, value, sub, color, delay }) {
    return (
        <div className={styles.statCard} style={{ animationDelay: `${delay}ms`, borderColor: color }}>
            <div className={styles.statValue} style={{ color }}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
            {sub && <div className={styles.statSub}>{sub}</div>}
        </div>
    );
}

function SectionTitle({ children }) {
    return <h2 className={styles.sectionTitle}>{children}</h2>;
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

function filterByRange(messages, days) {
    if (!days) return messages;
    const cutoff = Date.now() - days * 86400000;
    return messages.filter(m => {
        const ts = m.created_at
            ? (typeof m.created_at === 'number' ? m.created_at * 1000 : new Date(m.created_at).getTime())
            : null;
        return ts && ts >= cutoff;
    });
}

function exportCSV(messages) {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service Type', 'Status', 'Date', 'Message'];
    const rows = messages.map(m => [
        m.id,
        m.name || m.full_name || '',
        m.email || '',
        m.phone || '',
        m.service_type || '',
        m.status || '',
        m.created_at ? new Date(typeof m.created_at === 'number' ? m.created_at * 1000 : m.created_at).toLocaleDateString() : '',
        (m.message || '').replace(/,/g, ';').replace(/\n/g, ' '),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jandr-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportPDF() {
    window.print();
}

export default function Analytics() {
    const [allMessages, setAllMessages] = useState([]);
    const [range, setRange]   = useState(RANGES[3]);
    const [loading, setLoading]     = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [advice, setAdvice]       = useState(null);
    const [aiError, setAiError]     = useState('');

    useEffect(() => {
        fetch('/api/messages')
            .then(r => r.json())
            .then(data => setAllMessages(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const messages = filterByRange(allMessages, range.days);

    // Derived metrics
    const total = messages.length;
    const byStatus = messages.reduce((acc, m) => {
        const s = m.status || 'new';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});
    const contacted   = (byStatus.contacted || 0) + (byStatus.pending || 0);
    const convRate    = total > 0 ? Math.round((contacted / total) * 100) : 0;

    const byService = messages.reduce((acc, m) => {
        const svc = m.service_type || 'Unspecified';
        acc[svc] = (acc[svc] || 0) + 1;
        return acc;
    }, {});
    const serviceData = Object.entries(byService)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([name, count]) => ({ name: name.length > 22 ? name.slice(0, 22) + '…' : name, count }));
    const topService = serviceData[0]?.name || '—';

    const byMonth = messages.reduce((acc, m) => {
        const d = m.created_at
            ? new Date(typeof m.created_at === 'number' ? m.created_at * 1000 : m.created_at)
            : null;
        if (!d || isNaN(d)) return acc;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const timeData = Object.entries(byMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, count]) => ({ month, count }));
    const bestMonth = timeData.length > 0
        ? timeData.reduce((best, d) => d.count > best.count ? d : best, timeData[0]).month
        : '—';

    const pipelineData = Object.entries(byStatus).map(([status, count]) => ({
        name: status.replace('_', ' '),
        value: count,
    }));

    const getAdvice = useCallback(async () => {
        setAiLoading(true);
        setAiError('');
        setAdvice(null);
        try {
            const res = await fetch('/api/analytics/ai-advice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metrics: {
                        total,
                        new: byStatus.new || 0,
                        contacted,
                        pending: byStatus.pending || 0,
                        notInterested: byStatus.not_interested || 0,
                        convRate,
                        topService,
                        bestMonth,
                        byService,
                        byStatus,
                    },
                }),
            });
            const data = await res.json();
            if (data.advice) setAdvice(data.advice);
            else setAiError(data.error || 'Failed to generate advice');
        } catch {
            setAiError('Network error. Try again.');
        } finally {
            setAiLoading(false);
        }
    }, [total, contacted, convRate, topService, bestMonth, byService, byStatus]);

    if (loading) {
        return (
            <AdminLayout title="Analytics">
                <div className={styles.loading}>Loading analytics...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Analytics">
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
                    <div className={styles.exportGroup}>
                        <button className={styles.exportBtn} onClick={() => exportCSV(messages)}>
                            Export CSV
                        </button>
                        <button className={styles.exportBtn} onClick={exportPDF}>
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Callout cards */}
                <div className={styles.calloutRow}>
                    <div className={styles.callout}>
                        <div className={styles.calloutIcon}>★</div>
                        <div>
                            <div className={styles.calloutLabel}>Top Service</div>
                            <div className={styles.calloutValue}>{topService}</div>
                        </div>
                    </div>
                    <div className={styles.callout}>
                        <div className={styles.calloutIcon}>📈</div>
                        <div>
                            <div className={styles.calloutLabel}>Best Month</div>
                            <div className={styles.calloutValue}>{bestMonth}</div>
                        </div>
                    </div>
                    <div className={styles.callout}>
                        <div className={styles.calloutIcon}>🎯</div>
                        <div>
                            <div className={styles.calloutLabel}>Conversion Rate</div>
                            <div className={styles.calloutValue}>{convRate}%</div>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className={styles.statsGrid}>
                    <StatCard label="Total Leads"     value={total}                    color="#D4AF37" delay={0} />
                    <StatCard label="New"             value={byStatus.new || 0}        color="#4CAF50" delay={80} />
                    <StatCard label="Viewed"          value={byStatus.viewed || 0}     color="#2196F3" delay={160} />
                    <StatCard label="Contacted"       value={contacted}                color="#FF9800" delay={240} />
                    <StatCard label="Not Interested"  value={byStatus.not_interested || 0} color="#9E9E9E" delay={320} />
                </div>

                {/* Charts row */}
                <div className={styles.chartsRow}>
                    <div className={styles.chartCard}>
                        <SectionTitle>Lead Pipeline</SectionTitle>
                        {pipelineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                                        paddingAngle={3} dataKey="value" animationBegin={200} animationDuration={800}>
                                        {pipelineData.map((entry, i) => (
                                            <Cell key={i} fill={STATUS_COLORS[entry.name.replace(' ', '_')] || CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend formatter={val => <span style={{ color: '#ccc', textTransform: 'capitalize' }}>{val}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className={styles.empty}>No data yet</div>}
                    </div>

                    <div className={styles.chartCard}>
                        <SectionTitle>Leads by Service</SectionTitle>
                        {serviceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={serviceData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                                    <YAxis tick={{ fill: '#aaa', fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" name="Leads" fill="#D4AF37" radius={[4, 4, 0, 0]} animationDuration={900} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className={styles.empty}>No data yet</div>}
                    </div>
                </div>

                {/* Timeline */}
                <div className={styles.chartCard} style={{ marginTop: 24 }}>
                    <SectionTitle>Leads Over Time</SectionTitle>
                    {timeData.length > 1 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={timeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="month" tick={{ fill: '#aaa', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#aaa', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="count" name="Leads" stroke="#D4AF37"
                                    strokeWidth={2.5} dot={{ fill: '#D4AF37', r: 5 }} activeDot={{ r: 7 }} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <div className={styles.empty}>Need more data to show trend</div>}
                </div>

                {/* Status table */}
                <div className={styles.chartCard} style={{ marginTop: 24 }}>
                    <SectionTitle>Status Breakdown</SectionTitle>
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Status</th><th>Count</th><th>Share</th><th>Progress</th></tr>
                        </thead>
                        <tbody>
                            {Object.entries(byStatus).map(([status, count]) => {
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                const color = STATUS_COLORS[status] || '#D4AF37';
                                return (
                                    <tr key={status}>
                                        <td><span className={styles.dot} style={{ background: color }} />{status.replace('_', ' ')}</td>
                                        <td>{count}</td>
                                        <td>{pct}%</td>
                                        <td>
                                            <div className={styles.bar}>
                                                <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>


                {/* AI Advisor */}
                <div className={`${styles.chartCard} ${styles.aiCard}`} style={{ marginTop: 24 }}>
                    <SectionTitle>AI Business Advisor</SectionTitle>
                    <p className={styles.aiDesc}>
                        Analyzes your current metrics and generates specific recommendations to grow leads and improve conversions.
                    </p>
                    <button
                        className={styles.aiBtn}
                        onClick={getAdvice}
                        disabled={aiLoading || total === 0}
                    >
                        {aiLoading ? 'Analyzing...' : 'Get Recommendations'}
                    </button>
                    {total === 0 && <div className={styles.aiDesc} style={{ color: '#666', marginTop: 8 }}>Need at least 1 lead to analyze.</div>}
                    {aiError && <div className={styles.aiError}>{aiError}</div>}
                    {aiLoading && (
                        <div className={styles.aiLoadingBar}>
                            <div className={styles.aiLoadingFill} />
                        </div>
                    )}
                    {advice && (
                        <div className={styles.adviceGrid}>
                            {advice.map((item, i) => (
                                <div key={i} className={styles.adviceCard} style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className={styles.adviceHeader}>
                                        <span className={styles.adviceTitle}>{item.title}</span>
                                        <span className={styles.priority} style={{ background: PRIORITY_COLOR[item.priority] || '#888' }}>
                                            {item.priority}
                                        </span>
                                    </div>
                                    <div className={styles.adviceWhy}>{item.why}</div>
                                    <div className={styles.adviceAction}>
                                        <strong>Action:</strong> {item.action}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}

export async function getServerSideProps({ req }) {
    const cookies = parse(req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return { redirect: { destination: '/adminside', permanent: false } };
    }
    return { props: {} };
}
