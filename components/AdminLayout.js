import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';

export default function AdminLayout({ children, title }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/check');
                if (!res.ok) {
                    router.push('/adminside');
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                router.push('/adminside');
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/adminside');
    };

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.adminLayout}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    J&R Admin
                </div>
                <nav className={styles.sidebarNav}>
                    <Link href="/adminside/dashboard" className={router.pathname === '/adminside/dashboard' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
                        Dashboard
                    </Link>
                    <Link href="/adminside/services" className={router.pathname === '/adminside/services' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
                        Services
                    </Link>
                    <Link href="/adminside/projects" className={router.pathname === '/adminside/projects' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
                        Projects
                    </Link>
                    <Link href="/adminside/messages" className={router.pathname === '/adminside/messages' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
                        Messages
                    </Link>
                    <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                        Logout
                    </button>
                </nav>
            </div>
            <div className={styles.mainContent}>
                {title && (
                    <div className={styles.pageHeader}>
                        <h1>{title}</h1>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
