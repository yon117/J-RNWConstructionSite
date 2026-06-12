import { Fragment, useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';
import { parse } from 'cookie';
import { isValidSessionToken } from '../../lib/auth';
import { ArrowDown, ArrowUp, Check, Download, Edit3, GripVertical, RotateCcw, Save, X } from 'lucide-react';
import { imageUrl } from '../../utils/imageUrl';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', details: '', category: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', details: '', category: '', images: [] });
    const [managingImagesId, setManagingImagesId] = useState(null);
    const [projectImages, setProjectImages] = useState([]);
    const [originalImages, setOriginalImages] = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [pendingImages, setPendingImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [creatingProject, setCreatingProject] = useState(false);
    const [savingProjectOrder, setSavingProjectOrder] = useState(false);
    const [savedProjects, setSavedProjects] = useState([]);
    const [projectOrderDirty, setProjectOrderDirty] = useState(false);
    const [draggedProjectIndex, setDraggedProjectIndex] = useState(null);
    const [projectOrderMessage, setProjectOrderMessage] = useState('');
    const [editingImageNameId, setEditingImageNameId] = useState(null);
    const [imageNameDraft, setImageNameDraft] = useState('');
    const [renamingImageId, setRenamingImageId] = useState(null);
    const [seoRenamePreviewProjectId, setSeoRenamePreviewProjectId] = useState(null);
    const [seoRenameSuggestions, setSeoRenameSuggestions] = useState([]);
    const [applyingSeoRenames, setApplyingSeoRenames] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
            setSavedProjects(JSON.parse(JSON.stringify(data)));
            setProjectOrderDirty(false);
            setProjectOrderMessage('');
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
            details: project.details || '',
            category: project.category || ''
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
                    category: newProject.category || '',
                    image_url: '/assets/placeholder.jpg'
                })
            });

            if (!createRes.ok) {
                throw new Error('Failed to create project');
            }

            setUploadProgress(10);

            const createData = await createRes.json();
            const newProjectId = createData.project?.id;

            if (!newProjectId) {
                throw new Error('Project was created, but its ID was not returned');
            }

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
            for (const [index, file] of pendingImages.entries()) {
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
                            display_order: projectImages.length + index + 1
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
                await fetchProjectImages(projectId);
                await fetchProjects();
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

    const reorderProjects = (fromIndex, toIndex) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= projects.length || toIndex >= projects.length) return;

        const nextProjects = [...projects];
        const [movedProject] = nextProjects.splice(fromIndex, 1);
        nextProjects.splice(toIndex, 0, movedProject);
        setProjects(nextProjects);
        setProjectOrderDirty(true);
        setProjectOrderMessage('');
    };

    const saveProjectOrder = async () => {
        setSavingProjectOrder(true);
        setProjectOrderMessage('');

        try {
            const orderedProjects = projects.map((project, index) => ({
                id: project.id,
                display_order: index + 1
            }));

            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projects: orderedProjects })
            });

            if (!res.ok) throw new Error('Failed to save project order');

            const nextSavedProjects = projects.map((project, index) => ({
                ...project,
                display_order: index + 1
            }));
            setProjects(nextSavedProjects);
            setSavedProjects(JSON.parse(JSON.stringify(nextSavedProjects)));
            setProjectOrderDirty(false);
            setProjectOrderMessage('Order saved');
        } catch (error) {
            console.error('Failed to save project order:', error);
            alert('Failed to save project order');
            fetchProjects();
        } finally {
            setSavingProjectOrder(false);
        }
    };

    const getProjectImagePath = (img) => img.image_path || img.image_url || img.image || '';

    const getImageDownloadName = (img) => {
        const imagePath = getProjectImagePath(img);
        const filename = imagePath.split('/').pop();
        return filename || `project-image-${img.id}.jpg`;
    };

    const getImageSeoName = (img) => {
        const filename = getImageDownloadName(img);
        return filename.replace(/\.[a-z0-9]+$/i, '');
    };

    const handleEditImageName = (img) => {
        setEditingImageNameId(img.id);
        setImageNameDraft(getImageSeoName(img));
    };

    const handleCancelImageNameEdit = () => {
        setEditingImageNameId(null);
        setImageNameDraft('');
    };

    const handleSaveImageName = async (img, projectId) => {
        setRenamingImageId(img.id);

        try {
            const res = await fetch(`/api/projects/${projectId}/images`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageId: img.id, seoName: imageNameDraft })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to rename image');
            }

            setProjectImages(projectImages.map(image => (
                image.id === img.id
                    ? { ...image, image_path: data.image_path, image_url: data.image_path }
                    : image
            )));
            setOriginalImages(originalImages.map(image => (
                image.id === img.id
                    ? { ...image, image_path: data.image_path, image_url: data.image_path }
                    : image
            )));
            handleCancelImageNameEdit();
            await fetchProjects();
        } catch (error) {
            console.error('Failed to rename image:', error);
            alert(error.message);
        } finally {
            setRenamingImageId(null);
        }
    };

    const seoSlug = (value) => String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/i, '')
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 70);

    const categorySeoLabel = (category) => {
        const labels = {
            remodeling: 'remodeling',
            siding: 'siding',
            restoration: 'restoration',
            drywall: 'drywall',
            emergency: 'emergency-restoration',
            painting: 'painting',
            waterproofing: 'waterproofing',
            mitigation: 'damage-mitigation',
            deck: 'deck-repair',
            mold: 'mold-mitigation',
            ceiling: 'ceiling-repair',
            'structural-repair': 'structural-support-repair'
        };
        return labels[category] || category || 'construction-project';
    };

    const buildSeoImageBase = (project) => {
        const parts = [
            project.title,
            categorySeoLabel(project.category),
            project.location || 'portland-oregon',
            'jr-nw-construction'
        ];
        return seoSlug(parts.filter(Boolean).join(' ')) || `project-${project.id}`;
    };

    const buildSeoRenameSuggestions = (project) => {
        const base = buildSeoImageBase(project);
        const localImages = projectImages.filter(img => getProjectImagePath(img).startsWith('/uploads/'));
        const nonLocalImages = projectImages.filter(img => !getProjectImagePath(img).startsWith('/uploads/'));

        return {
            suggestions: localImages.map((img, index) => ({
                imageId: img.id,
                oldName: getImageDownloadName(img),
                seoName: `${base}-${String(index + 1).padStart(2, '0')}`
            })),
            skipped: nonLocalImages.map(img => ({
                imageId: img.id,
                oldName: getImageDownloadName(img),
                reason: 'Not a local /uploads image'
            }))
        };
    };

    const handlePreviewSeoRenames = (project) => {
        const { suggestions, skipped } = buildSeoRenameSuggestions(project);
        setSeoRenamePreviewProjectId(project.id);
        setSeoRenameSuggestions([...suggestions, ...skipped]);
    };

    const handleCancelSeoRenamePreview = () => {
        setSeoRenamePreviewProjectId(null);
        setSeoRenameSuggestions([]);
    };

    const handleApplySeoRenames = async (projectId) => {
        const renames = seoRenameSuggestions
            .filter(suggestion => suggestion.seoName)
            .map(suggestion => ({
                imageId: suggestion.imageId,
                seoName: suggestion.seoName
            }));

        if (renames.length === 0) {
            alert('No local uploaded images can be renamed.');
            return;
        }

        setApplyingSeoRenames(true);

        try {
            const res = await fetch(`/api/projects/${projectId}/images`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ renames })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to apply SEO names');
            }

            const successful = (data.results || []).filter(result => result.success);
            const failed = (data.results || []).filter(result => !result.success);
            const pathMap = new Map(successful.map(result => [result.imageId, result.image_path]));

            setProjectImages(projectImages.map(img => (
                pathMap.has(img.id)
                    ? { ...img, image_path: pathMap.get(img.id), image_url: pathMap.get(img.id) }
                    : img
            )));
            setOriginalImages(originalImages.map(img => (
                pathMap.has(img.id)
                    ? { ...img, image_path: pathMap.get(img.id), image_url: pathMap.get(img.id) }
                    : img
            )));
            await fetchProjects();
            handleCancelSeoRenamePreview();

            if (failed.length > 0) {
                alert(`${successful.length} image(s) renamed. ${failed.length} skipped or failed.`);
            } else {
                alert(`${successful.length} image(s) renamed for SEO.`);
            }
        } catch (error) {
            console.error('Failed to apply SEO names:', error);
            alert(error.message);
        } finally {
            setApplyingSeoRenames(false);
        }
    };

    const handleMoveProject = (index, direction) => {
        const nextIndex = index + direction;
        if (savingProjectOrder) return;
        reorderProjects(index, nextIndex);
    };

    const handleProjectDragStart = (e, index) => {
        if (editingId || savingProjectOrder) return;
        setDraggedProjectIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
    };

    const handleProjectDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = draggedProjectIndex ?? parseInt(e.dataTransfer.getData('text/plain'), 10);
        setDraggedProjectIndex(null);
        if (Number.isNaN(dragIndex) || savingProjectOrder) return;
        reorderProjects(dragIndex, dropIndex);
    };

    const handleCancelProjectOrder = () => {
        setProjects(JSON.parse(JSON.stringify(savedProjects)));
        setProjectOrderDirty(false);
        setProjectOrderMessage('');
    };

    if (loading) {
        return <AdminLayout title="Projects"><div>Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout title="Manage Projects">
            <button onClick={() => setShowAddForm(!showAddForm)} className={styles.addBtn}>
                {showAddForm ? 'Cancel' : '+ Add New Project'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <button
                    type="button"
                    onClick={saveProjectOrder}
                    className={styles.addBtn}
                    disabled={!projectOrderDirty || savingProjectOrder}
                    style={{ marginBottom: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <Save size={16} /> {savingProjectOrder ? 'Saving order...' : 'Save Order'}
                </button>
                <button
                    type="button"
                    onClick={handleCancelProjectOrder}
                    className={styles.actionBtn}
                    disabled={!projectOrderDirty || savingProjectOrder}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <RotateCcw size={16} /> Reset Order
                </button>
                {(projectOrderDirty || projectOrderMessage) && (
                    <span style={{ color: projectOrderDirty ? 'var(--accent)' : '#4CAF50', fontSize: '0.9rem' }}>
                        {projectOrderDirty ? 'Unsaved order changes' : projectOrderMessage}
                    </span>
                )}
            </div>

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
                            <label>Category</label>
                            <select
                                value={newProject.category}
                                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: 'var(--text-light)', borderRadius: '4px' }}
                            >
                                <option value="">-- No Category --</option>
                                <option value="remodeling">Remodeling</option>
                                <option value="siding">Siding</option>
                                <option value="restoration">Restoration</option>
                                <option value="drywall">Drywall</option>
                                <option value="emergency">Emergency</option>
                                <option value="deck">Deck</option>
                                <option value="mold">Mold</option>
                                <option value="ceiling">Ceiling</option>
                                <option value="structural-repair">Structural Support/Repair</option>
                            </select>
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
                            <th>Order</th>
                            <th>Thumbnail</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Details</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <Fragment key={project.id}>
                                <tr
                                    key={project.id}
                                    draggable={editingId !== project.id && !savingProjectOrder}
                                    onDragStart={(e) => handleProjectDragStart(e, index)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleProjectDrop(e, index)}
                                    onDragEnd={() => setDraggedProjectIndex(null)}
                                    style={{
                                        opacity: draggedProjectIndex === index ? 0.55 : 1,
                                        cursor: editingId === project.id ? 'default' : 'grab'
                                    }}
                                >
                                    {editingId === project.id ? (
                                        <>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={imageUrl(project.image || project.image_url)}
                                                    alt={project.title}
                                                    style={{ width: '88px', height: '58px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.45)' }}
                                                />
                                            </td>
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
                                                <select
                                                    value={editForm.category}
                                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                    style={{ width: '100%', padding: '8px', background: '#2a2a2a', border: '1px solid #555', color: '#fff', borderRadius: '4px' }}
                                                >
                                                    <option value="" style={{background:'#2a2a2a',color:'#fff'}}>-- No Category --</option>
                                                    <option value="remodeling" style={{background:'#2a2a2a',color:'#fff'}}>Remodeling</option>
                                                    <option value="siding" style={{background:'#2a2a2a',color:'#fff'}}>Siding</option>
                                                    <option value="restoration" style={{background:'#2a2a2a',color:'#fff'}}>Restoration</option>
                                                    <option value="drywall" style={{background:'#2a2a2a',color:'#fff'}}>Drywall</option>
                                                    <option value="emergency" style={{background:'#2a2a2a',color:'#fff'}}>Emergency</option>
                                                    <option value="painting" style={{background:'#2a2a2a',color:'#fff'}}>Painting</option>
                                                    <option value="waterproofing" style={{background:'#2a2a2a',color:'#fff'}}>Waterproofing</option>
                                                    <option value="mitigation" style={{background:'#2a2a2a',color:'#fff'}}>Mitigation</option>
                                                    <option value="deck" style={{background:'#2a2a2a',color:'#fff'}}>Deck</option>
                                                    <option value="mold" style={{background:'#2a2a2a',color:'#fff'}}>Mold</option>
                                                    <option value="ceiling" style={{background:'#2a2a2a',color:'#fff'}}>Ceiling</option>
                                                    <option value="structural-repair" style={{background:'#2a2a2a',color:'#fff'}}>Structural Support/Repair</option>
                                                </select>
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
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <GripVertical size={16} aria-hidden="true" />
                                                    <span>{index + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveProject(index, -1)}
                                                        className={styles.actionBtn}
                                                        disabled={index === 0 || savingProjectOrder}
                                                        title="Move up"
                                                        aria-label={`Move ${project.title} up`}
                                                        style={{ padding: '6px', marginRight: 0 }}
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveProject(index, 1)}
                                                        className={styles.actionBtn}
                                                        disabled={index === projects.length - 1 || savingProjectOrder}
                                                        title="Move down"
                                                        aria-label={`Move ${project.title} down`}
                                                        style={{ padding: '6px', marginRight: 0 }}
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <img
                                                    src={imageUrl(project.image || project.image_url)}
                                                    alt={project.title}
                                                    loading="lazy"
                                                    style={{ width: '88px', height: '58px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.45)' }}
                                                />
                                            </td>
                                            <td>{project.title}</td>
                                            <td>{project.description}</td>
                                            <td>{project.details || 'N/A'}</td>
                                            <td>{project.category || '—'}</td>
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
                                        <td colSpan="7" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px' }}>
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
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handlePreviewSeoRenames(project)}
                                                    className={styles.actionBtn + ' ' + styles.editBtn}
                                                    disabled={projectImages.length === 0 || applyingSeoRenames}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                                                >
                                                    <Edit3 size={14} /> Auto SEO Names
                                                </button>
                                                <span style={{ color: 'var(--text-light)', opacity: 0.75, fontSize: '0.85rem' }}>
                                                    Preview names from project title, category, Portland Oregon, and image order.
                                                </span>
                                            </div>
                                            {seoRenamePreviewProjectId === project.id && (
                                                <div style={{ marginBottom: '15px', padding: '14px', border: '1px solid var(--accent)', borderRadius: '6px', background: 'rgba(0,0,0,0.18)' }}>
                                                    <h5 style={{ color: 'var(--accent)', marginBottom: '10px', fontSize: '1rem' }}>SEO rename preview</h5>
                                                    <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                                                        {seoRenameSuggestions.map((suggestion, suggestionIndex) => (
                                                            <div
                                                                key={suggestion.imageId}
                                                                style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'minmax(170px, 1fr) minmax(220px, 1.2fr)',
                                                                    gap: '10px',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <div style={{ color: 'var(--text-light)', fontSize: '0.82rem', wordBreak: 'break-word', opacity: suggestion.seoName ? 1 : 0.6 }}>
                                                                    {suggestion.oldName}
                                                                </div>
                                                                {suggestion.seoName ? (
                                                                    <input
                                                                        type="text"
                                                                        value={suggestion.seoName}
                                                                        onChange={(e) => {
                                                                            const nextSuggestions = [...seoRenameSuggestions];
                                                                            nextSuggestions[suggestionIndex] = {
                                                                                ...suggestion,
                                                                                seoName: e.target.value
                                                                            };
                                                                            setSeoRenameSuggestions(nextSuggestions);
                                                                        }}
                                                                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: 'var(--text-light)', borderRadius: '4px', fontSize: '0.82rem' }}
                                                                    />
                                                                ) : (
                                                                    <div style={{ color: '#ffb3b3', fontSize: '0.82rem' }}>
                                                                        Skipped: {suggestion.reason}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApplySeoRenames(project.id)}
                                                            className={styles.actionBtn + ' ' + styles.editBtn}
                                                            disabled={applyingSeoRenames}
                                                            style={{ background: '#4CAF50', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                                                        >
                                                            <Check size={14} /> {applyingSeoRenames ? 'Applying...' : 'Apply SEO Names'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelSeoRenamePreview}
                                                            className={styles.actionBtn}
                                                            disabled={applyingSeoRenames}
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            <X size={14} /> Cancel Preview
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
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
                                                        <img
                                                            src={imageUrl(getProjectImagePath(img))}
                                                            alt={getImageSeoName(img)}
                                                            style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                                                        />
                                                        <div style={{ padding: '8px', background: 'rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            {editingImageNameId === img.id ? (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={imageNameDraft}
                                                                        onChange={(e) => setImageNameDraft(e.target.value)}
                                                                        onMouseDown={(e) => e.stopPropagation()}
                                                                        placeholder="seo-photo-name"
                                                                        style={{ width: '100%', padding: '7px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--accent)', color: 'var(--text-light)', borderRadius: '4px', fontSize: '0.8rem' }}
                                                                    />
                                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleSaveImageName(img, project.id)}
                                                                            className={styles.actionBtn + ' ' + styles.editBtn}
                                                                            disabled={renamingImageId === img.id}
                                                                            style={{ marginRight: 0, padding: '6px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                                        >
                                                                            <Check size={13} /> {renamingImageId === img.id ? 'Saving' : 'Save'}
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={handleCancelImageNameEdit}
                                                                            className={styles.actionBtn}
                                                                            disabled={renamingImageId === img.id}
                                                                            style={{ marginRight: 0, padding: '6px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                                        >
                                                                            <X size={13} /> Cancel
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div title={getImageDownloadName(img)} style={{ color: 'var(--text-light)', fontSize: '0.78rem', lineHeight: 1.35, wordBreak: 'break-word' }}>
                                                                        {getImageDownloadName(img)}
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleEditImageName(img)}
                                                                            className={styles.actionBtn + ' ' + styles.editBtn}
                                                                            style={{ marginRight: 0, padding: '6px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                                        >
                                                                            <Edit3 size={13} /> SEO
                                                                        </button>
                                                                        <a
                                                                            href={imageUrl(getProjectImagePath(img))}
                                                                            download={getImageDownloadName(img)}
                                                                            className={styles.actionBtn}
                                                                            style={{ marginRight: 0, padding: '6px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-light)' }}
                                                                        >
                                                                            <Download size={13} /> Download
                                                                        </a>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
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
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export async function getServerSideProps(context) {
    const cookies = parse(context.req.headers.cookie || '');
    if (!isValidSessionToken(cookies.admin_token)) {
        return { redirect: { destination: '/adminside', permanent: false } };
    }
    return { props: {} };
}
