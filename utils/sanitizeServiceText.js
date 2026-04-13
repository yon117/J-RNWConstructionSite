const KITCHEN_WORD = /\bkitchen\b/gi;

export function sanitizeServiceText(value) {
    if (!value || typeof value !== 'string') return value;

    return value
        .split(/(?<=[.!?])\s+/)
        .filter(sentence => !KITCHEN_WORD.test(sentence))
        .map(sentence => sentence.replace(KITCHEN_WORD, '').replace(/\s{2,}/g, ' ').trim())
        .filter(Boolean)
        .join(' ')
        .trim();
}

export function sanitizeServiceObject(service) {
    if (!service || typeof service !== 'object') return service;

    const sanitized = { ...service };
    const textFields = [
        'title',
        'subtitle',
        'header_desc',
        'description',
        'details',
        'process_desc',
        'page_title',
    ];

    textFields.forEach((key) => {
        if (sanitized[key]) {
            sanitized[key] = sanitizeServiceText(sanitized[key]);
        }
    });

    for (let i = 1; i <= 4; i += 1) {
        const titleKey = `ksp_title_${i}`;
        const descKey = `ksp_desc_${i}`;
        if (sanitized[titleKey]) sanitized[titleKey] = sanitizeServiceText(sanitized[titleKey]);
        if (sanitized[descKey]) sanitized[descKey] = sanitizeServiceText(sanitized[descKey]);
    }

    for (let i = 1; i <= 5; i += 1) {
        const qKey = `faq_q_${i}`;
        const aKey = `faq_a_${i}`;
        if (sanitized[qKey]) sanitized[qKey] = sanitizeServiceText(sanitized[qKey]);
        if (sanitized[aKey]) sanitized[aKey] = sanitizeServiceText(sanitized[aKey]);
    }

    return sanitized;
}
