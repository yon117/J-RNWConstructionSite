import { useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Admin.module.css';
import { parse } from 'cookie';
import { getDb } from '../../lib/db';
import { Trash2, Plus } from 'lucide-react';

export default function Projects({ projects }) {
    const [projectList, setProjectList] = useState(projects);
    const [newProject, setNewProject] = useState({ title: '', description: '', details: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let imageUrl = '/assets/placeholder.jpg';
        if (image) {
            const formData = new FormData();
            formData.append('file', image);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            imageUrl = data.imageUrl;
        }

        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newProject, image_url: imageUrl })
        });

        if (res.ok) {
            window.location.reload();
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            const res = await fetch('/api/projects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setProjectList(projectList.filter(p => p.id !== id));
            }
        }
    };

    return (
        <Layout title="Manage Projects">
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Manage Projects</h2>
                    <a href="/admin/dashboard" className="btn btn-primary">Back to Dashboard</a>
                </div>

                <div className={styles.formContainer} style={{ marginBottom: '40px', background: '#fff', padding: '20px', borderRadius: '8px' }}>
                    <h3>Add New Project</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Project Title"
                            required
                            value={newProject.title}
                            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                            style={{ padding: '10px' }}
                        />
                        <textarea
                            placeholder="Short Description"
                            required
                            value={newProject.description}
                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                            style={{ padding: '10px' }}
                        />
                        <textarea
                            placeholder="Full Details"
                            value={newProject.details}
                            onChange={e => setNewProject({ ...newProject, details: e.target.value })}
                            style={{ padding: '10px' }}
                        />
                        <input type="file" onChange={handleImageChange} accept="image/*" />
                        <button type="submit" className="btn btn-accent" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Project'}
                        </button>
                    </form>
                </div>

                <div className={styles.grid}>
                    {projectList.map(project => (
                        <div key={project.id} className={styles.card} style={{ textAlign: 'left' }}>
                            <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <button onClick={() => handleDelete(project.id)} className={styles.deleteBtn} style={{ marginTop: '10px', width: '100%' }}>
                                <Trash2 size={16} /> Delete
                            </button>
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
    const projects = await db.all('SELECT * FROM projects');

    return { props: { projects } };
}
