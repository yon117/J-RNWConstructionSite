import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

const STATUS_OPTIONS = [
    { value: 'new', label: 'New', color: '#4CAF50' },
    { value: 'viewed', label: 'Viewed', color: '#2196F3' },
    { value: 'contacted', label: 'Contacted', color: '#FF9800' },
    { value: 'pending', label: 'Pending', color: '#FFC107' },
    { value: 'not_interested', label: 'Not Interested', color: '#9E9E9E' }
];

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filter, setFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);

        // Mark as viewed if new
        if (message.status === 'new') {
            await updateMessageStatus(message.id, 'viewed');
        }
    };

    const updateMessageStatus = async (id, status) => {
        try {
            await fetch('/api/messages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });

            // Update local state
            setMessages(messages.map(m =>
                m.id === id ? { ...m, status, is_read: 1 } : m
            ));

            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, status, is_read: 1 });
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            const res = await fetch('/api/messages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
                setDeleteConfirm(null);
                if (selectedMessage && selectedMessage.id === id) {
                    setSelectedMessage(null);
                }
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const getFilteredMessages = () => {
        if (filter === 'all') return messages;
        if (filter === 'unread') return messages.filter(m => m.status === 'new');
        if (filter === 'read') return messages.filter(m => m.status !== 'new');
        return messages.filter(m => m.status === filter);
    };

    const getStatusColor = (status) => {
        const option = STATUS_OPTIONS.find(opt => opt.value === status);
        return option ? option.color : '#999';
    };

    const getStatusLabel = (status) => {
        const option = STATUS_OPTIONS.find(opt => opt.value === status);
        return option ? option.label : status;
    };

    // Calculate counters
    const totalMessages = messages.length;
    const newMessages = messages.filter(m => m.status === 'new').length;
    const readMessages = messages.filter(m => m.status !== 'new').length;

    const filteredMessages = getFilteredMessages();

    if (loading) {
        return <AdminLayout title="Messages"><div>Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout title="Messages">
            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--primary)',
                        padding: '30px',
                        borderRadius: '8px',
                        border: '2px solid #ff6b6b',
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#ff6b6b', marginBottom: '20px', fontSize: '1.3rem' }}>
                            ⚠️ Delete Message?
                        </h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '30px', lineHeight: '1.6' }}>
                            Are you sure you want to delete this message from <strong>{deleteConfirm.full_name}</strong>?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button
                                onClick={() => handleDeleteMessage(deleteConfirm.id)}
                                style={{
                                    background: '#ff6b6b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'var(--text-light)',
                                    border: '1px solid #555',
                                    padding: '12px 30px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}
                            >
                                No, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className={styles.statCard}>
                    <h3>Total Messages</h3>
                    <div className={styles.statNumber}>{totalMessages}</div>
                </div>
                <div className={styles.statCard} style={{ borderColor: '#4CAF50' }}>
                    <h3>New Messages</h3>
                    <div className={styles.statNumber} style={{ color: '#4CAF50' }}>{newMessages}</div>
                </div>
                <div className={styles.statCard} style={{ borderColor: '#2196F3' }}>
                    <h3>Read Messages</h3>
                    <div className={styles.statNumber} style={{ color: '#2196F3' }}>{readMessages}</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setFilter('all')}
                    className={styles.actionBtn}
                    style={{ background: filter === 'all' ? 'var(--accent)' : 'rgba(255,255,255,0.1)', color: filter === 'all' ? 'var(--primary)' : 'var(--text-light)' }}
                >
                    All ({totalMessages})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={styles.actionBtn}
                    style={{ background: filter === 'unread' ? '#4CAF50' : 'rgba(255,255,255,0.1)', color: 'white' }}
                >
                    New ({newMessages})
                </button>
                <button
                    onClick={() => setFilter('read')}
                    className={styles.actionBtn}
                    style={{ background: filter === 'read' ? '#2196F3' : 'rgba(255,255,255,0.1)', color: 'white' }}
                >
                    Read ({readMessages})
                </button>
                {STATUS_OPTIONS.filter(opt => opt.value !== 'new').map(option => {
                    const count = messages.filter(m => m.status === option.value).length;
                    return (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={styles.actionBtn}
                            style={{ background: filter === option.value ? option.color : 'rgba(255,255,255,0.1)', color: 'white' }}
                        >
                            {option.label} ({count})
                        </button>
                    );
                })}
            </div>

            {selectedMessage ? (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '30px',
                    borderRadius: '8px',
                    border: '1px solid var(--accent)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className={styles.actionBtn}
                        >
                            ← Back to Messages
                        </button>
                        <button
                            onClick={() => setDeleteConfirm(selectedMessage)}
                            className={styles.actionBtn + ' ' + styles.deleteBtn}
                        >
                            🗑️ Delete Message
                        </button>
                    </div>

                    <h2 style={{ color: 'var(--accent)', marginBottom: '20px' }}>Message Details</h2>

                    <div style={{ display: 'grid', gap: '15px', color: 'var(--text-light)' }}>
                        <div>
                            <strong style={{ color: 'var(--accent)' }}>From:</strong> {selectedMessage.full_name}
                        </div>
                        <div>
                            <strong style={{ color: 'var(--accent)' }}>Email:</strong> {selectedMessage.email}
                        </div>
                        <div>
                            <strong style={{ color: 'var(--accent)' }}>Phone:</strong> {selectedMessage.phone || 'N/A'}
                        </div>
                        <div>
                            <strong style={{ color: 'var(--accent)' }}>Service Type:</strong> {selectedMessage.service_type || 'Not specified'}
                        </div>

                        <div>
                            <strong style={{ color: 'var(--accent)' }}>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
                        </div>
                        <div>
                            <strong style={{ color: 'var(--accent)' }}>Status:</strong>
                            <select
                                value={selectedMessage.status}
                                onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                                style={{
                                    marginLeft: '10px',
                                    padding: '8px 12px',
                                    background: getStatusColor(selectedMessage.status),
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '10px' }}>Message:</strong>
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '20px',
                                borderRadius: '6px',
                                lineHeight: '1.6'
                            }}>
                                {selectedMessage.message}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.dataTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Service Type</th>
                                <th>Preview</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                                        No messages found
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr key={msg.id}>
                                        <td>
                                            <span style={{
                                                background: getStatusColor(msg.status),
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                display: 'inline-block'
                                            }}>
                                                {getStatusLabel(msg.status)}
                                            </span>
                                        </td>
                                        <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                                        <td>{msg.full_name}</td>
                                        <td>{msg.email}</td>
                                        <td>{msg.phone || 'N/A'}</td>
                                        <td>{msg.service_type || 'Not specified'}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {msg.message}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleViewMessage(msg)}
                                                className={styles.actionBtn + ' ' + styles.editBtn}
                                            >
                                                View
                                            </button>
                                            <select
                                                value={msg.status}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    updateMessageStatus(msg.id, e.target.value);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className={styles.actionBtn}
                                                style={{
                                                    background: getStatusColor(msg.status),
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {STATUS_OPTIONS.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => setDeleteConfirm(msg)}
                                                className={styles.actionBtn + ' ' + styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
