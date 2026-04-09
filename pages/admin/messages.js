import { useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Admin.module.css';
import { parse } from 'cookie';
import { getDb } from '../../lib/db';
import { Trash2 } from 'lucide-react';

export default function Messages({ messages }) {
    const [messageList, setMessageList] = useState(messages);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this message?')) {
            const res = await fetch('/api/messages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setMessageList(messageList.filter(m => m.id !== id));
            }
        }
    };

    return (
        <Layout title="View Messages">
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Client Messages</h2>
                    <a href="/admin/dashboard" className="btn btn-primary">Back to Dashboard</a>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Message</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messageList.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No messages found.</td></tr>
                            ) : (
                                messageList.map(msg => (
                                    <tr key={msg.id}>
                                        <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                                        <td>{msg.first_name} {msg.last_name}</td>
                                        <td><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
                                        <td>{msg.phone}</td>
                                        <td>{msg.message}</td>
                                        <td>
                                            <button onClick={() => handleDelete(msg.id)} className={styles.deleteBtn}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const cookies = parse(context.req.headers.cookie || '');
    if (!cookies.admin_token) {
        return { redirect: { destination: '/admin/login', permanent: false } };
    }

    const db = await getDb();
    const messages = await db.all('SELECT * FROM messages ORDER BY created_at DESC');

    // Serialize dates for Next.js
    const serializedMessages = messages.map(m => ({
        ...m,
        created_at: m.created_at // SQLite stores as string or number, should be fine
    }));

    return { props: { messages: serializedMessages } };
}
