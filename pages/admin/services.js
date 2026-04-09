import { useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Admin.module.css';
import { parse } from 'cookie';
import { getDb } from '../../lib/db';
import { Edit, Image as ImageIcon } from 'lucide-react';

export default function Services({ services }) {
    const [serviceList, setServiceList] = useState(services);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ description: '', image_url: '' });
    const [image, setImage] = useState(null);

    const handleEdit = (service) => {
        setEditingId(service.id);
        setEditForm({ description: service.description, image_url: service.image_url });
        setImage(null);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        let imageUrl = editForm.image_url;
        if (image) {
            const formData = new FormData();
            formData.append('file', image);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            imageUrl = data.imageUrl;
        }

        const res = await fetch('/api/services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingId, description: editForm.description, image_url: imageUrl })
        });

        if (res.ok) {
            setServiceList(serviceList.map(s => s.id === editingId ? { ...s, description: editForm.description, image_url: imageUrl } : s));
            setEditingId(null);
        }
    };

    return (
        <Layout title="Manage Services">
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Manage Services</h2>
                    <a href="/admin/dashboard" className="btn btn-primary">Back to Dashboard</a>
                </div>

                <div className={styles.grid}>
                    {serviceList.map(service => (
                        <div key={service.id} className={styles.card} style={{ textAlign: 'left' }}>
                            {editingId === service.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <h3>{service.name}</h3>
                                    <textarea
                                        value={editForm.description}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                        rows={4}
                                        style={{ padding: '10px', width: '100%' }}
                                    />
                                    <input type="file" onChange={handleImageChange} accept="image/*" />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={handleSave} className="btn btn-accent">Save</button>
                                        <button onClick={() => setEditingId(null)} className="btn">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <img src={service.image_url} alt={service.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <h3>{service.name}</h3>
                                    <p>{service.description}</p>
                                    <button onClick={() => handleEdit(service)} className={styles.editBtn} style={{ marginTop: '10px', width: '100%' }}>
                                        <Edit size={16} /> Edit
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
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
    const services = await db.all('SELECT * FROM services');

    return { props: { services } };
}
