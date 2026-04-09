// Utility function to generate URL-friendly slugs from service titles
export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Utility function to create service URL with slug and ID
export function getServiceUrl(service) {
    const slug = generateSlug(service.title);
    return `/services/${slug}-${service.id}`;
}

// Utility function to extract ID from slug-based URL parameter
export function extractIdFromSlug(slugParam) {
    // Format: "service-name-123" -> extract "123"
    const parts = slugParam.split('-');
    const id = parts[parts.length - 1];
    return parseInt(id, 10);
}
