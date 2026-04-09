import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', details: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', details: '', images: [] });
    const [managingImagesId, setManagingImagesId] = useState(null);
    const [projectImages, setProjectImages] = useState([]);
    const [originalImages, setOriginalImages] = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [pendingImages, setPendingImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [creatingProject, setCreatingProject] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectImages = async (projectId) => {
        try {
            const res = await fetch(`/api/projects/${projectId}/images`);
            const data = await res.json();
            setProjectImages(data);
            setOriginalImages(JSON.parse(JSON.stringify(data))); // Deep copy
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to fetch project images:', error);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setEditForm({
            title: project.title,
            description: project.description,
            details: project.details || ''
        });
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingId, ...editForm })
            });

            if (res.ok) {
                fetchProjects();
                setEditingId(null);
            }
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const res = await fetch('/api/projects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                fetchProjects();
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setNewProject({ ...newProject, images: files });
            // Store file names to show user
            console.log('Images selected:', files.map(f => f.name));
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        setCreatingProject(true);
        setUploadProgress(0);

        try {
            console.log('Creating project with images:', newProject.images?.length || 0);

            // First, create the project
            const createRes = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newProject.title,
                    description: newProject.description,
                    details: newProject.details,
                    image_url: '/assets/placeholder.jpg'
                })
            });

            if (!createRes.ok) {
                throw new Error('Failed to create project');
            }

            setUploadProgress(10);

            // Fetch the newly created project to get its ID
            const projectsRes = await fetch('/api/projects');
            const projectsData = await projectsRes.json();
            const newProjectId = projectsData[projectsData.length - 1].id;

            console.log('New project ID:', newProjectId);

            // Upload images if any were selected
            if (newProject.images && newProject.images.length > 0) {
                console.log('Starting image upload for', newProject.images.length, 'images');
                let firstImageUrl = null;
                const totalImages = newProject.images.length;

                for (let i = 0; i < totalImages; i++) {
                    const file = newProject.images[i];
                    console.log(`Uploading image ${i + 1}/${totalImages}:`, file.name);

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                        // Upload image to server
                        const uploadRes = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                        });

                        if (!uploadRes.ok) {
                            const errorText = await uploadRes.text();
                            console.error('Upload failed:', errorText);
                            throw new Error('Upload failed: ' + errorText);
                        }

                        const uploadData = await uploadRes.json();
                        console.log('Image uploaded:', uploadData.imageUrl);

                        // Save first image URL
                        if (i === 0) {
                            firstImageUrl = uploadData.imageUrl;
                        }

                        // Save image to project_images table
                        const saveRes = await fetch(`/api/projects/${newProjectId}/images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                image_url: uploadData.imageUrl,
                                display_order: i + 1
                            })
                        });

                        if (!saveRes.ok) {
                            console.error('Failed to save image to database');
                        }

                        // Update progress
                        const progress = 10 + ((i + 1) / totalImages) * 80;
                        setUploadProgress(Math.round(progress));
                        console.log(`Progress: ${Math.round(progress)}%`);
                    } catch (error) {
                        console.error('Failed to upload image:', file.name, error);
                        alert(`❌ Failed to upload ${file.name}: ${error.message}`);
                    }
                }

                // Update project with first image as main image
                if (firstImageUrl) {
                    console.log('Setting main image:', firstImageUrl);
                    await fetch('/api/projects', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: newProjectId,
                            title: newProject.title,
                            description: newProject.description,
                            details: newProject.details,
                            image_url: firstImageUrl
                        })
                    });
                }
            }

            setUploadProgress(100);
            await fetchProjects();
            setShowAddForm(false);
            setNewProject({ title: '', description: '', details: '', images: [] });
            alert('✅ Project created successfully with ' + (newProject.images?.length || 0) + ' images!');
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('❌ Failed to create project: ' + error.message);
        } finally {
            setCreatingProject(false);
            setUploadProgress(0);
        }
    };

    const handleManageImages = async (projectId) => {
        setManagingImagesId(projectId);
        await fetchProjectImages(projectId);
    };

    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Add files to pending list
        setPendingImages([...pendingImages, ...files]);
    };

    const handleSaveImages = async (projectId) => {
        if (pendingImages.length === 0) {
            alert('No images selected');
            return;
        }

        setUploadingImages(true);
        let firstImageUrl = null;

        try {
            for (const file of pendingImages) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (!uploadRes.ok) {
                        throw new Error('Upload failed');
                    }

                    const uploadData = await uploadRes.json();

                    // Save first image URL
                    if (!firstImageUrl) {
                        firstImageUrl = uploadData.imageUrl;
                    }

                    const res = await fetch(`/api/projects/${projectId}/images`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image_url: uploadData.imageUrl,
                            display_order: projectImages.length + 1
                        })
                    });

                    if (!res.ok) {
                        throw new Error('Failed to save image');
                    }
                } catch (error) {
                    console.error('Failed to upload image:', error);
                    alert(`❌ Failed to upload ${file.name}. Error: ${error.message}`);
                }
            }

            // Update main project image if this is the first image
            if (firstImageUrl && projectImages.length === 0) {
                const currentProject = projects.find(p => p.id === projectId);
                await fetch('/api/projects', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: projectId,
                        image: firstImageUrl,
                        title: currentProject?.title,
                        description: currentProject?.description,
                        details: currentProject?.details || '' // PRESERVE DETAILS!
                    })
                });
            }

            // Clear pending images and refresh
            setPendingImages([]);
            await fetchProjectImages(projectId);
            await fetchProjects(); // Refresh projects list to show updated images
            alert('✅ Images uploaded successfully!');
        } catch (error) {
            console.error('Failed to save images:', error);
            alert('❌ Failed to save images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleDeleteImage = async (imageId, projectId) => {
        if (!confirm('Delete this image?')) return;

        try {
            const res = await fetch(`/api/projects/${projectId}/images`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageId })
            });

            if (res.ok) {
                fetchProjectImages(projectId);
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/html'));

        if (dragIndex === dropIndex) return;

        const newImages = [...projectImages];
        const [draggedImage] = newImages.splice(dragIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);

        setProjectImages(newImages);
        setHasUnsavedChanges(true);
    };

    const handleSaveImageOrder = async (projectId) => {
        const updatedImages = projectImages.map((img, idx) => ({
            id: img.id,
            display_order: idx + 1
        }));

        try {
            const res = await fetch(`/api/projects/${projectId}/images`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: updatedImages })
            });

            if (res.ok) {
                // Update project main image to first image
                if (projectImages.length > 0) {
                    const currentProject = projects.find(p => p.id === projectId);
                    await fetch('/api/projects', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: projectId,
                            // project_images.image_path is the correct DB column name
                            image_url: projectImages[0].image_path,
                            title: currentProject?.title,
                            description: currentProject?.description,
                            details: currentProject?.details
                        })
                    });
                }

                setOriginalImages(JSON.parse(JSON.stringify(projectImages)));
                setHasUnsavedChanges(false);
                fetchProjects();
                alert('✅ Image order saved successfully! The first image is now the project thumbnail.');
            }
        } catch (error) {
            console.error('Failed to update image order:', error);
            alert('❌ Failed to save image order');
        }
    };

    const handleCancelImageOrder = () => {
        setProjectImages(JSON.parse(JSON.stringify(originalImages)));
        setHasUnsavedChanges(false);
    };

    if (loading) {
        return <AdminLayout title="Projects"><div>Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout title="Manage Projects">
            <button onClick={() => setShowAddForm(!showAddForm)} className={styles.addBtn}>
                {showAddForm ? 'Cancel' : '+ Add New Project'}
            </button>

            {showAddForm && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid var(--accent)'
                }}>
                    <h3 style={{ color: 'var(--accent)', marginBottom: '20px' }}>Add New Project</h3>
                    <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className={styles.formGroup}>
                            <label>Project Title</label>
                            <input
                                type="text"
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                required
                                style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: 'var(--text-light)', borderRadius: '4px' }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                required
                                rows="3"
                                style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: 'var(--text-light)', borderRadius: '4px' }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Details</label>
                            <textarea
                                value={newProject.details}
                                onChange={(e) => setNewProject({ ...newProject, details: e.target.value })}
                                required
                                rows="4"
                                style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: 'var(--text-light)', borderRadius: '4px' }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Images (Multiple)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: 'var(--text-light)', borderRadius: '4px' }}
                            />
                            {newProject.images && newProject.images.length > 0 && (
                                <p style={{ color: 'var(--accent)', marginTop: '8px', fontSize: '0.9rem' }}>
                                    📁 {newProject.images.length} image(s) selected
                                </p>
                            )}
                        </div>
                        {creatingProject && (
                            <div style={{ marginTop: '10px' }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    height: '30px',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(90deg, var(--accent), #FFD700)',
                                        height: '100%',
                                        width: `${uploadProgress}%`,
                                        transition: 'width 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}>
                                        {uploadProgress}%
                                    </div>
                                </div>
                                <p style={{ color: 'var(--accent)', marginTop: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                                    {uploadProgress < 10 ? 'Creating project...' :
                                        uploadProgress < 90 ? `Uploading images... (${Math.round((uploadProgress - 10) / 80 * newProject.images.length)}/${newProject.images.length})` :
                                            uploadProgress < 100 ? 'Finalizing...' : 'Complete!'}
                                </p>
                            </div>
                        )}
                        <button
                            type="submit"
                            className={styles.addBtn}
                            style={{ width: 'fit-content' }}
                            disabled={creatingProject}
                        >
                            {creatingProject ? 'Creating...' : 'Create Project'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.dataTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <>
                                <tr key={project.id}>
                                    {editingId === project.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    style={{ width: '100%', padding: '8px' }}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    style={{ width: '100%', padding: '8px' }}
                                                    rows="3"
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    value={editForm.details}
                                                    onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                                                    style={{ width: '100%', padding: '8px' }}
                                                    rows="3"
                                                />
                                            </td>
                                            <td>
                                                <button onClick={handleSave} className={styles.actionBtn + ' ' + styles.editBtn}>
                                                    Save
                                                </button>
                                                <button onClick={() => setEditingId(null)} className={styles.actionBtn}>
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{project.title}</td>
                                            <td>{project.description}</td>
                                            <td>{project.details || 'N/A'}</td>
                                            <td>
                                                <button onClick={() => handleEdit(project)} className={styles.actionBtn + ' ' + styles.editBtn}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleManageImages(project.id)} className={styles.actionBtn + ' ' + styles.editBtn}>
                                                    Images
                                                </button>
                                                <button onClick={() => handleDelete(project.id)} className={styles.actionBtn + ' ' + styles.deleteBtn}>
                                                    Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                                {managingImagesId === project.id && (
                                    <tr>
                                        <td colSpan="4" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px' }}>
                                            <h4 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Manage Images for: {project.title}</h4>
                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ color: 'var(--text-light)', marginRight: '10px', display: 'block', marginBottom: '8px' }}>Add New Image(s):</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleAddImage}
                                                    disabled={uploadingImages}
                                                    style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: 'var(--text-light)', borderRadius: '4px', marginBottom: '10px' }}
                                                />
                                                {pendingImages.length > 0 && (
                                                    <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4CAF50', borderRadius: '4px' }}>
                                                        <p style={{ color: '#4CAF50', margin: 0, fontSize: '0.9rem' }}>
                                                            📁 {pendingImages.length} image(s) selected. Click "Save Images" to upload.
                                                        </p>
                                                    </div>
                                                )}
                                                {uploadingImages && (
                                                    <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(33, 150, 243, 0.1)', border: '1px solid #2196F3', borderRadius: '4px' }}>
                                                        <p style={{ color: '#2196F3', margin: 0, fontSize: '0.9rem' }}>
                                                            ⏳ Uploading images... Please wait.
                                                        </p>
                                                    </div>
                                                )}
                                                {pendingImages.length > 0 && !uploadingImages && (
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                        <button
                                                            onClick={() => handleSaveImages(project.id)}
                                                            className={styles.actionBtn + ' ' + styles.editBtn}
                                                            style={{ background: '#4CAF50', fontWeight: 'bold' }}
                                                        >
                                                            💾 Save Images
                                                        </button>
                                                        <button
                                                            onClick={() => setPendingImages([])}
                                                            className={styles.actionBtn}
                                                            style={{ background: '#ff6b6b' }}
                                                        >
                                                            ✕ Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p style={{ color: 'var(--accent)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                                💡 Tip: Drag and drop images to reorder. The first image will be the project thumbnail.
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                                                {projectImages.map((img, index) => (
                                                    <div
                                                        key={img.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, index)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, index)}
                                                        style={{
                                                            position: 'relative',
                                                            border: index === 0 ? '3px solid #4CAF50' : '2px solid var(--accent)',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden',
                                                            cursor: 'move',
                                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.05)';
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            left: '5px',
                                                            background: index === 0 ? '#4CAF50' : 'var(--accent)',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            borderRadius: '50%',
                                                            width: '25px',
                                                            height: '25px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.85rem',
                                                            zIndex: 1
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                        {index === 0 && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                bottom: '5px',
                                                                left: '5px',
                                                                background: '#4CAF50',
                                                                color: 'white',
                                                                padding: '3px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 'bold',
                                                                zIndex: 1
                                                            }}>
                                                                MAIN
                                                            </div>
                                                        )}
                                                        <img src={img.image_path || img.image_url || img.image} alt="Project" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                                        <button
                                                            onClick={() => handleDeleteImage(img.id, project.id)}
                                                            style={{ position: 'absolute', top: '5px', right: '5px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', zIndex: 1 }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                                {hasUnsavedChanges && (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveImageOrder(project.id)}
                                                            className={styles.actionBtn + ' ' + styles.editBtn}
                                                            style={{ background: '#4CAF50' }}
                                                        >
                                                            💾 Save Order
                                                        </button>
                                                        <button
                                                            onClick={handleCancelImageOrder}
                                                            className={styles.actionBtn}
                                                            style={{ background: '#ff6b6b' }}
                                                        >
                                                            ✕ Cancel
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => setManagingImagesId(null)} className={styles.actionBtn}>
                                                    Close
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
