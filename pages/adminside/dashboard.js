import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        services: 0,
        projects: 0,
        messages: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [servicesRes, projectsRes, messagesRes] = await Promise.all([
                fetch('/api/services'),
                fetch('/api/projects'),
                fetch('/api/messages')
            ]);

            const services = await servicesRes.json();
            const projects = await projectsRes.json();
            const messages = await messagesRes.json();

            setStats({
                services: services.length || 0,
                projects: projects.length || 0,
                messages: messages.length || 0
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    return (
        <AdminLayout title="Dashboard">
            <div className={styles.dashboardGrid}>
                <div className={styles.statCard}>
                    <h3>Total Services</h3>
                    <div className={styles.statNumber}>{stats.services}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Projects</h3>
                    <div className={styles.statNumber}>{stats.projects}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Messages</h3>
                    <div className={styles.statNumber}>{stats.messages}</div>
                </div>
            </div>
            <div style={{ marginTop: '40px' }}>
                <h2 style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <a href="/adminside/services" className={styles.addBtn}>Manage Services</a>
                    <a href="/adminside/projects" className={styles.addBtn}>Manage Projects</a>
                    <a href="/adminside/messages" className={styles.addBtn}>View Messages</a>
                </div>
            </div>
        </AdminLayout>
    );
}
