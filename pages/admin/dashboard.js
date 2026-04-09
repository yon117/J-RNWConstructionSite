import Layout from '../../components/Layout';
import Link from 'next/link';
import styles from '../../styles/Admin.module.css';
import { parse } from 'cookie';
import { Briefcase, Settings, MessageSquare, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    return (
        <Layout title="Admin Dashboard">
            <div className={styles.dashboard}>
                <div className={styles.dashboardHeader}>
                    <h2>Admin Dashboard</h2>
                    <button onClick={handleLogout} className={styles.actionBtn} style={{ backgroundColor: '#333', color: '#fff' }}>
                        <LogOut size={16} style={{ marginRight: '5px' }} /> Log Out
                    </button>
                </div>

                <div className={styles.dashboardGrid}>
                    <Link href="/admin/projects">
                        <div className={styles.card}>
                            <Briefcase size={48} color="#D4AF37" />
                            <h3>Manage Projects</h3>
                            <p>Add, edit, or remove projects from your portfolio.</p>
                        </div>
                    </Link>

                    <Link href="/admin/services">
                        <div className={styles.card}>
                            <Settings size={48} color="#D4AF37" />
                            <h3>Manage Services</h3>
                            <p>Update images and details for your services.</p>
                        </div>
                    </Link>

                    <Link href="/admin/messages">
                        <div className={styles.card}>
                            <MessageSquare size={48} color="#D4AF37" />
                            <h3>View Messages</h3>
                            <p>Read and respond to client inquiries.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const cookies = parse(context.req.headers.cookie || '');
    if (!cookies.admin_token) {
        return {
            redirect: {
                destination: '/admin/login',
                permanent: false,
            },
        };
    }
    return { props: {} };
}
