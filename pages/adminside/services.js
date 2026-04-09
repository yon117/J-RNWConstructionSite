import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

const EMPTY_SERVICE = {
    name: '',
    page_title: '',
    subtitle: '',
    slug: '',
    description: '',
    header_desc: '',
    details: '',
    process_desc: '',
    ksp_title_1: '', ksp_desc_1: '',
    ksp_title_2: '', ksp_desc_2: '',
    ksp_title_3: '', ksp_desc_3: '',
    ksp_title_4: '', ksp_desc_4: '',
    faq_q_1: '', faq_a_1: '',
    faq_q_2: '', faq_a_2: '',
    faq_q_3: '', faq_a_3: '',
    faq_q_4: '', faq_a_4: '',
    faq_q_5: '', faq_a_5: '',
    image: null,
    image_url: '',
};

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ ...EMPTY_SERVICE });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newService, setNewService] = useState({ ...EMPTY_SERVICE });
    const [editingImage, setEditingImage] = useState(null);
    const [managingImagesId, setManagingImagesId] = useState(null);
    const [serviceImages, setServiceImages] = useState([]);
    const [originalImages, setOriginalImages] = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [pendingImages, setPendingImages] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceImages = async (serviceId) => {
        try {
            const res = await fetch(`/api/services/${serviceId}/images`);
            const data = await res.json();
            setServiceImages(data);
            setOriginalImages(JSON.parse(JSON.stringify(data)));
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to fetch service images:', error);
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setEditForm({
            name:         service.title || service.name || '',
            page_title:   service.page_title   || '',
            subtitle:     service.subtitle     || '',
            slug:         service.slug         || '',
            description:  service.description  || '',
            header_desc:  service.header_desc  || '',
            details:      service.details      || '',
            process_desc: service.process_desc || '',
            ksp_title_1:  service.ksp_title_1  || '',
            ksp_desc_1:   service.ksp_desc_1   || '',
            ksp_title_2:  service.ksp_title_2  || '',
            ksp_desc_2:   service.ksp_desc_2   || '',
            ksp_title_3:  service.ksp_title_3  || '',
            ksp_desc_3:   service.ksp_desc_3   || '',
            ksp_title_4:  service.ksp_title_4  || '',
            ksp_desc_4:   service.ksp_desc_4   || '',
            faq_q_1:      service.faq_q_1      || '',
            faq_a_1:      service.faq_a_1      || '',
            faq_q_2:      service.faq_q_2      || '',
            faq_a_2:      service.faq_a_2      || '',
            faq_q_3:      service.faq_q_3      || '',
            faq_a_3:      service.faq_a_3      || '',
            faq_q_4:      service.faq_q_4      || '',
            faq_a_4:      service.faq_a_4      || '',
            faq_q_5:      service.faq_q_5      || '',
            faq_a_5:      service.faq_a_5      || '',
            image_url:    service.image_url || service.image || service.image_path || '',
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ ...EMPTY_SERVICE });
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id:           editingId,
                    title:        editForm.name,
                    page_title:   editForm.page_title,
                    subtitle:     editForm.subtitle,
                    slug:         editForm.slug,
                    description:  editForm.description,
                    header_desc:  editForm.header_desc,
                    details:      editForm.details,
                    process_desc: editForm.process_desc,
                    ksp_title_1:  editForm.ksp_title_1,
                    ksp_desc_1:   editForm.ksp_desc_1,
                    ksp_title_2:  editForm.ksp_title_2,
                    ksp_desc_2:   editForm.ksp_desc_2,
                    ksp_title_3:  editForm.ksp_title_3,
                    ksp_desc_3:   editForm.ksp_desc_3,
                    ksp_title_4:  editForm.ksp_title_4,
                    ksp_desc_4:   editForm.ksp_desc_4,
                    faq_q_1:      editForm.faq_q_1,
                    faq_a_1:      editForm.faq_a_1,
                    faq_q_2:      editForm.faq_q_2,
                    faq_a_2:      editForm.faq_a_2,
                    faq_q_3:      editForm.faq_q_3,
                    faq_a_3:      editForm.faq_a_3,
                    faq_q_4:      editForm.faq_q_4,
                    faq_a_4:      editForm.faq_a_4,
                    faq_q_5:      editForm.faq_q_5,
                    faq_a_5:      editForm.faq_a_5,
                    image_url:    editForm.image_url,
                })
            });

            if (res.ok) {
                fetchServices();
                setEditingId(null);
            } else {
                console.error('Failed to save service:', await res.text());
            }
        } catch (error) {
            console.error('Failed to update service:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const res = await fetch('/api/services', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                fetchServices();
            }
        } catch (error) {
            console.error('Failed to delete service:', error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewService({ ...newService, image: e.target.files[0] });
        }
    };

    const handleEditImageChange = async (e, serviceId) => {
        const file = e.target.files[0];
        if (!file) return;

        setEditingImage(serviceId);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            const res = await fetch('/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: serviceId,
                    image_url: uploadData.imageUrl
                })
            });

            if (res.ok) {
                fetchServices();
            }
        } catch (error) {
            console.error('Failed to update image:', error);
        } finally {
            setEditingImage(null);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();

        let imageUrl = '/assets/placeholder.jpg';

        if (newService.image) {
            const formData = new FormData();
            formData.append('file', newService.image);

            try {
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.imageUrl;
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        }

        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title:        newService.name,
                    page_title:   newService.page_title,
                    subtitle:     newService.subtitle,
                    slug:         newService.slug,
                    description:  newService.description,
                    header_desc:  newService.header_desc,
                    details:      newService.details,
                    process_desc: newService.process_desc,
                    ksp_title_1:  newService.ksp_title_1,
                    ksp_desc_1:   newService.ksp_desc_1,
                    ksp_title_2:  newService.ksp_title_2,
                    ksp_desc_2:   newService.ksp_desc_2,
                    ksp_title_3:  newService.ksp_title_3,
                    ksp_desc_3:   newService.ksp_desc_3,
                    ksp_title_4:  newService.ksp_title_4,
                    ksp_desc_4:   newService.ksp_desc_4,
                    faq_q_1:      newService.faq_q_1,
                    faq_a_1:      newService.faq_a_1,
                    faq_q_2:      newService.faq_q_2,
                    faq_a_2:      newService.faq_a_2,
                    faq_q_3:      newService.faq_q_3,
                    faq_a_3:      newService.faq_a_3,
                    faq_q_4:      newService.faq_q_4,
                    faq_a_4:      newService.faq_a_4,
                    faq_q_5:      newService.faq_q_5,
                    faq_a_5:      newService.faq_a_5,
                    image_url:    imageUrl,
                })
            });

            if (res.ok) {
                fetchServices();
                setShowAddForm(false);
                setNewService({ ...EMPTY_SERVICE });
            } else {
                console.error('Failed to create service:', await res.text());
            }
        } catch (error) {
            console.error('Failed to create service:', error);
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setNewService({ ...EMPTY_SERVICE });
    };

    const handleManageImages = async (serviceId) => {
        setManagingImagesId(serviceId);
        await fetchServiceImages(serviceId);
    };

    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setPendingImages([...pendingImages, ...files]);
    };

    const handleSaveImages = async (serviceId) => {
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

                    // Read body once — it can only be consumed once
                    let uploadData;
                    try { uploadData = await uploadRes.json(); } catch { uploadData = {}; }

                    if (!uploadRes.ok) {
                        const errMsg = uploadData.details || uploadData.error || 'Upload failed';
                        throw new Error(errMsg);
                    }


                    if (!firstImageUrl) {
                        firstImageUrl = uploadData.imageUrl;
                    }

                    const res = await fetch(`/api/services/${serviceId}/images`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image_url: uploadData.imageUrl,
                            display_order: serviceImages.length + 1
                        })
                    });

                    if (!res.ok) {
                        let saveErr = 'Failed to save image';
                        try { const d = await res.json(); saveErr = d.details || d.error || saveErr; } catch {}
                        throw new Error(saveErr);
                    }
                } catch (error) {
                    console.error('Failed to upload image:', error);
                    alert(`❌ Failed to upload ${file.name}. Error: ${error.message}`);
                }
            }

            // Always update the service thumbnail to the first uploaded image
            if (firstImageUrl) {
                await fetch('/api/services', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: serviceId,
                        image_url: firstImageUrl,
                    })
                });
                fetchServices();
            }

            setPendingImages([]);
            await fetchServiceImages(serviceId);
            alert('✅ Images uploaded successfully!');
        } catch (error) {
            console.error('Failed to save images:', error);
            alert('❌ Failed to save images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleDeleteImage = async (imageId, serviceId) => {
        if (!window.confirm('¿Delete this image?')) return;

        try {
            const res = await fetch(`/api/services/${serviceId}/images`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageId })
            });

            if (res.ok) {
                await fetchServiceImages(serviceId);
            } else {
                let errMsg = 'Failed to delete image';
                try { const d = await res.json(); errMsg = d.details || d.error || errMsg; } catch {}
                alert('❌ ' + errMsg);
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
            alert('❌ Error: ' + error.message);
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

        const newImages = [...serviceImages];
        const [draggedImage] = newImages.splice(dragIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);

        setServiceImages(newImages);
        setHasUnsavedChanges(true);
    };

    const handleSaveImageOrder = async (serviceId) => {
        const updatedImages = serviceImages.map((img, idx) => ({
            id: img.id,
            display_order: idx + 1
        }));

        try {
            const res = await fetch(`/api/services/${serviceId}/images`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: updatedImages })
            });

            if (res.ok) {
                if (serviceImages.length > 0) {
                    // Send ONLY id + image_url so the image-only code path fires
                    // and doesn't accidentally wipe KSPs, FAQs, etc.
                    await fetch('/api/services', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: serviceId,
                            image_url: serviceImages[0].image_path || serviceImages[0].image_url,
                        })
                    });
                }

                setOriginalImages(JSON.parse(JSON.stringify(serviceImages)));
                setHasUnsavedChanges(false);
                fetchServices();
                alert('✅ Image order saved successfully! The first image is now the service thumbnail.');
            }
        } catch (error) {
            console.error('Failed to update image order:', error);
            alert('❌ Failed to save image order');
        }
    };

    const handleCancelImageOrder = () => {
        setServiceImages(JSON.parse(JSON.stringify(originalImages)));
        setHasUnsavedChanges(false);
    };

    /* ── Shared field style ─────────────────────────────────────────────── */
    const fieldStyle = {
        padding: '10px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid #555',
        color: 'var(--text-light)',
        borderRadius: '4px',
        width: '100%',
    };
    const sectionHeadStyle = {
        color: 'var(--accent)',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(212,175,55,0.3)',
        paddingBottom: '8px',
        marginBottom: '12px',
        marginTop: '20px',
    };

    /* ── Reusable edit form renderer ─────────────────────────────────────── */
    const renderEditFields = (form, setForm) => (
        <>
            {/* ─ Basic Info ─ */}
            <p style={sectionHeadStyle}>Basic Info</p>

            <div className={styles.formGroup}>
                <label>Service Name <span style={{ color: '#aaa', fontWeight: 400 }}>(displayed in menus/cards)</span></label>
                <input type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required style={fieldStyle} />
            </div>

            <div className={styles.formGroup}>
                <label>Sub Name <span style={{ color: '#aaa', fontWeight: 400 }}>(tagline below the main title on the page)</span></label>
                <input type="text" value={form.subtitle}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="e.g. A Fresh Coat Changes Everything."
                    style={fieldStyle} />
            </div>

            <div className={styles.formGroup}>
                <label>Page Title <span style={{ color: '#aaa', fontWeight: 400 }}>(browser tab / SEO title)</span></label>
                <input type="text" value={form.page_title}
                    onChange={e => setForm({ ...form, page_title: e.target.value })}
                    placeholder="e.g. Remodeling Services | J&R NW Construction"
                    style={fieldStyle} />
            </div>

            <div className={styles.formGroup}>
                <label>
                    URL Slug{' '}
                    <span style={{ color: '#aaa', fontWeight: 400 }}>
                        (used in URL: https://jandrnw.com/services/<strong style={{ color: 'var(--accent)' }}>{form.slug || 'slug'}</strong>)
                    </span>
                </label>
                <input type="text" value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                    placeholder="e.g. remodeling"
                    style={fieldStyle} />
            </div>

            {/* ─ Description ─ */}
            <p style={sectionHeadStyle}>Description</p>

            <div className={styles.formGroup}>
                <label>Header Description <span style={{ color: '#aaa', fontWeight: 400 }}>(texto debajo del título en la sección hero de la imagen de fondo)</span></label>
                <textarea value={form.header_desc}
                    onChange={e => setForm({ ...form, header_desc: e.target.value })}
                    rows="4" style={fieldStyle}
                    placeholder="Description visible en la imagen del header..." />
            </div>

            <div className={styles.formGroup}>
                <label>Short Description <span style={{ color: '#aaa', fontWeight: 400 }}>(hero subtitle / card preview)</span></label>
                <textarea value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required rows="3" style={fieldStyle}
                    placeholder="Brief description shown in the hero and service cards..." />
            </div>

            <div className={styles.formGroup}>
                <label>Why Choose Us <span style={{ color: '#aaa', fontWeight: 400 }}>(full "About this service" section)</span></label>
                <textarea value={form.details}
                    onChange={e => setForm({ ...form, details: e.target.value })}
                    rows="6" style={fieldStyle}
                    placeholder="Full detailed description of the service..." />
            </div>

            {/* ─ Key Selling Points ─ */}
            <p style={sectionHeadStyle}>Key Selling Points</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '12px' }}>
                4 selling points shown as icon cards on the service page.
            </p>

            {[1, 2, 3, 4].map(n => (
                <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '12px', alignItems: 'start' }}>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                        <label>KSP {n} — Title</label>
                        <input type="text" value={form[`ksp_title_${n}`]}
                            onChange={e => setForm({ ...form, [`ksp_title_${n}`]: e.target.value })}
                            placeholder={`e.g. Premium materials`}
                            style={fieldStyle} />
                    </div>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                        <label>KSP {n} — Description</label>
                        <input type="text" value={form[`ksp_desc_${n}`]}
                            onChange={e => setForm({ ...form, [`ksp_desc_${n}`]: e.target.value })}
                            placeholder={`e.g. We use top-grade products...`}
                            style={fieldStyle} />
                    </div>
                </div>
            ))}

            <div className={styles.formGroup}>
                <label>Process / Additional Description <span style={{ color: '#aaa', fontWeight: 400 }}>(copy block shown on the service page — "OUR PROCESS")</span></label>
                <textarea value={form.process_desc}
                    onChange={e => setForm({ ...form, process_desc: e.target.value })}
                    rows="5" style={fieldStyle}
                    placeholder="Describe the process, details or anything you want..." />
            </div>

            {/* ─ FAQ ─ */}
            <p style={sectionHeadStyle}>FAQ Section</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '12px' }}>
                Up to 5 question &amp; answer pairs shown below the copy blocks.
            </p>

            {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '6px', padding: '12px', marginBottom: '12px' }}>
                    <div className={styles.formGroup} style={{ marginBottom: '8px' }}>
                        <label>FAQ {n} — Question</label>
                        <input type="text" value={form[`faq_q_${n}`]}
                            onChange={e => setForm({ ...form, [`faq_q_${n}`]: e.target.value })}
                            placeholder="e.g. Do I need to move my furniture?"
                            style={fieldStyle} />
                    </div>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                        <label>FAQ {n} — Answer</label>
                        <textarea value={form[`faq_a_${n}`]}
                            onChange={e => setForm({ ...form, [`faq_a_${n}`]: e.target.value })}
                            rows="2" style={fieldStyle}
                            placeholder="e.g. We handle furniture moving and full protection..." />
                    </div>
                </div>
            ))}
        </>
    );

    if (loading) {
        return <AdminLayout title="Services"><div>Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout title="Manage Services">
            <button onClick={() => setShowAddForm(!showAddForm)} className={styles.addBtn}>
                {showAddForm ? 'Cancel' : '+ Add New Service'}
            </button>

            {showAddForm && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid var(--accent)'
                }}>
                    <h3 style={{ color: 'var(--accent)', marginBottom: '20px' }}>Add New Service</h3>
                    <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {renderEditFields(newService, setNewService)}

                        <div className={styles.formGroup}>
                            <label>Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={fieldStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className={styles.addBtn} style={{ width: 'fit-content' }}>
                                Save Service
                            </button>
                            <button type="button" onClick={handleCancelAdd} className={styles.actionBtn} style={{ padding: '12px 24px' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.dataTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <>
                                <tr key={service.id}>
                                    {editingId === service.id ? (
                                        <>
                                            <td colSpan="4">
                                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                                                    <h4 style={{ color: 'var(--accent)', marginBottom: '20px' }}>
                                                        Editing: {service.title || service.name}
                                                    </h4>
                                                    {renderEditFields(editForm, setEditForm)}
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                                        <button onClick={handleSave} className={styles.actionBtn + ' ' + styles.editBtn}>
                                                            💾 Save Changes
                                                        </button>
                                                        <button onClick={handleCancelEdit} className={styles.actionBtn}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <div style={{ position: 'relative' }}>
                                                    <img src={service.image_url || service.image || service.image_path} alt={service.name || service.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <label style={{
                                                        position: 'absolute',
                                                        bottom: '0',
                                                        right: '0',
                                                        background: 'var(--accent)',
                                                        color: 'var(--primary)',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        {editingImage === service.id ? '...' : '📷'}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleEditImageChange(e, service.id)}
                                                            style={{ display: 'none' }}
                                                        />
                                                    </label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{service.name || service.title}</strong>
                                                    {service.slug && (
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>
                                                            /services/{service.slug}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{service.description}</td>
                                            <td>
                                                <button onClick={() => handleEdit(service)} className={styles.actionBtn + ' ' + styles.editBtn}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleManageImages(service.id)} className={styles.actionBtn + ' ' + styles.editBtn}>
                                                    Images
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className={styles.actionBtn + ' ' + styles.deleteBtn}>
                                                    Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                                {managingImagesId === service.id && (
                                    <tr>
                                        <td colSpan="4" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px' }}>
                                            <h4 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Manage Images for: {service.name || service.title}</h4>
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
                                                            onClick={() => handleSaveImages(service.id)}
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
                                                💡 Tip: Drag and drop images to reorder. The first image will be the service thumbnail.
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                                                {serviceImages.map((img, index) => (
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
                                                            position: 'absolute', top: '5px', left: '5px',
                                                            background: index === 0 ? '#4CAF50' : 'var(--accent)',
                                                            color: '#fff', fontWeight: 'bold',
                                                            borderRadius: '50%', width: '25px', height: '25px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.85rem', zIndex: 1
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                        {index === 0 && (
                                                            <div style={{
                                                                position: 'absolute', bottom: '5px', left: '5px',
                                                                background: '#4CAF50', color: 'white',
                                                                padding: '3px 8px', borderRadius: '4px',
                                                                fontSize: '0.7rem', fontWeight: 'bold', zIndex: 1
                                                            }}>
                                                                MAIN
                                                            </div>
                                                        )}
                                                        <img src={img.image_path || img.image_url || img.image} alt="Service" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                                        <button
                                                            onClick={() => handleDeleteImage(img.id, service.id)}
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
                                                            onClick={() => handleSaveImageOrder(service.id)}
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
