function numericOrder(value) {
    const order = Number(value);
    return Number.isFinite(order) ? order : 0;
}

export function chooseDisplayOrder(existingImages, requestedOrder) {
    const maxOrder = (existingImages || []).reduce((max, image) => {
        return Math.max(max, numericOrder(image.display_order));
    }, 0);
    const requested = numericOrder(requestedOrder);

    return requested > maxOrder ? requested : maxOrder + 1;
}

export function normalizeImageOrder(images) {
    return [...(images || [])]
        .sort((a, b) => {
            const orderDiff = numericOrder(a.display_order) - numericOrder(b.display_order);
            if (orderDiff !== 0) return orderDiff;
            return numericOrder(a.id) - numericOrder(b.id);
        })
        .map((image, index) => ({
            id: image.id,
            display_order: index + 1
        }));
}

export function firstImageByProject(images) {
    const firstImages = {};
    const orderedImages = [...(images || [])].sort((a, b) => {
        const projectDiff = numericOrder(a.project_id) - numericOrder(b.project_id);
        if (projectDiff !== 0) return projectDiff;
        const orderDiff = numericOrder(a.display_order) - numericOrder(b.display_order);
        if (orderDiff !== 0) return orderDiff;
        return numericOrder(a.id) - numericOrder(b.id);
    });

    for (const image of orderedImages) {
        if (image.project_id === undefined || !image.image_path) continue;
        if (!firstImages[image.project_id]) {
            firstImages[image.project_id] = image.image_path;
        }
    }

    return firstImages;
}
