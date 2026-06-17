const DEFAULT_SERVICES = [
    {
        id: 'mold',
        title: 'Mold Mitigation',
        description: 'Mold mitigation for homes affected by moisture, leaks, poor ventilation, or water damage. We remove damaged materials, treat affected areas, and rebuild cleanly.',
        header_desc: 'Mold is usually a moisture problem first. We find the source, remove compromised materials, treat affected areas, and rebuild the space cleanly.',
        image_url: '/assets/service-mold-remediation.png',
        image: '/assets/service-mold-remediation.png',
        details: 'Mold should not be hidden behind paint, caulk, or new drywall. Our approach starts with the cause of the moisture, then moves through removal, drying, treatment, and rebuild work that helps keep the issue from coming back.\n\nFor larger or regulated remediation scopes, we can coordinate the right testing or remediation support before reconstruction begins.',
        slug: 'mold',
        page_title: 'Mold Mitigation Portland OR | Moisture Damage Cleanup',
        subtitle: 'Moisture source, damaged material removal, treatment, and clean rebuild work for affected areas.',
        ksp_title_1: 'Moisture Source First',
        ksp_desc_1: 'We look for the leak, ventilation issue, or water intrusion that allowed mold to start instead of only covering the visible damage.',
        ksp_title_2: 'Damaged Material Removal',
        ksp_desc_2: 'Compromised drywall, trim, flooring, or framing is removed when needed so the repair is not cosmetic.',
        ksp_title_3: 'Treatment + Drying',
        ksp_desc_3: 'Affected surfaces are cleaned, treated, and dried before rebuild work begins.',
        ksp_title_4: 'Rebuild Ready',
        ksp_desc_4: 'Once the area is stable, we handle the reconstruction details so the room looks finished again.',
        process_desc: 'We inspect the affected area, identify the moisture source, remove compromised material, clean and treat surfaces, dry the space, and rebuild only after the area is ready.',
        faq_q_1: 'Is mold part of mitigation?',
        faq_a_1: 'Yes. Mold usually fits under mitigation because it starts with moisture or water damage. A dedicated page still helps customers find the specific service.',
        faq_q_2: 'Do you just paint over mold?',
        faq_a_2: 'No. Painting over mold hides the symptom and usually leaves the moisture problem in place.',
        faq_q_3: 'Can you rebuild after mold removal?',
        faq_a_3: 'Yes. We can repair drywall, trim, flooring, framing, and finishes after the affected area is stable.',
        faq_q_4: 'Do you handle bathroom mold?',
        faq_a_4: 'Yes. Bathrooms are common because of leaks, humidity, failed caulking, and poor ventilation.',
        faq_q_5: 'Do I need testing?',
        faq_a_5: 'Testing depends on the scope and situation. If the job needs it, we can coordinate the right next step before reconstruction.',
    },
    {
        id: 'structural-support-repair',
        title: 'Structural Support & Repair',
        description: 'Structural support and repair for damaged framing, posts, beams, subfloors, dry rot, water damage, and load-path problems.',
        header_desc: 'Structural repair needs disciplined work. We correct damaged framing, reinforce weak areas, and rebuild support details with the right sequence.',
        image_url: '/assets/service-structural-support-repair.png',
        image: '/assets/service-structural-support-repair.png',
        details: 'Structural issues are not the place for guesswork. Sagging floors, rotted framing, failing posts, damaged beams, and water-damaged support areas need careful evaluation before cosmetic work begins.\n\nWe focus on practical residential repair: opening the affected area, removing failed material, reinforcing the structure, and rebuilding the finish layers only after the support issue is addressed.',
        slug: 'structural-support-repair',
        page_title: 'Structural Support and Repair Portland OR | Framing, Posts, Beams',
        subtitle: 'Framing, posts, beams, subfloors, dry rot, and water-damaged structural areas repaired with the right sequence.',
        ksp_title_1: 'Load Path Awareness',
        ksp_desc_1: 'We treat support issues as system problems, not isolated cosmetic damage.',
        ksp_title_2: 'Framing + Reinforcement',
        ksp_desc_2: 'Damaged framing, subfloor sections, posts, and support members are repaired or reinforced as the scope requires.',
        ksp_title_3: 'Dry Rot + Water Damage',
        ksp_desc_3: 'When moisture caused the damage, we address the failed material and the water source behind it.',
        ksp_title_4: 'Finish Rebuild',
        ksp_desc_4: 'After the structural work is stable, we rebuild surrounding drywall, trim, flooring, and finish details.',
        process_desc: 'We inspect the visible damage, open the affected area as needed, confirm the repair path, remove failed material, reinforce or replace support components, and close the area with clean finish work.',
        faq_q_1: 'What counts as structural support repair?',
        faq_a_1: 'Posts, beams, framing, subfloors, wall support, dry rot damage, and water-damaged support areas can all fall under structural repair.',
        faq_q_2: 'Can you repair dry rot and framing together?',
        faq_a_2: 'Yes. Dry rot often affects framing or subfloor areas, so those repairs are commonly connected.',
        faq_q_3: 'Do you handle small residential structural repairs?',
        faq_a_3: 'Yes. We focus on practical residential repair scopes, including support and rebuild work.',
        faq_q_4: 'Will you cover damaged framing without fixing it?',
        faq_a_4: 'No. Covering a support problem creates a bigger issue later. The structure needs to be addressed first.',
        faq_q_5: 'Do structural repairs need engineering?',
        faq_a_5: 'Some do. If the scope needs engineering or permitting direction, we will identify that before moving forward.',
    },
];

const toSlug = (value) => (
    String(value || '')
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
);

const normalizeService = (service) => ({
    ...service,
    slug: service.slug || toSlug(service.title),
    image_url: service.image_url || service.image || '/assets/placeholder.jpg',
});

const serviceMatches = (service, fallback) => {
    const serviceKeys = [service.slug, toSlug(service.title), String(service.id || '')].filter(Boolean);
    const fallbackKeys = [fallback.slug, toSlug(fallback.title), String(fallback.id || '')].filter(Boolean);

    return serviceKeys.some((key) => fallbackKeys.includes(key));
};

const fillEmptyFields = (service, fallback) => {
    const filled = { ...service };

    Object.entries(fallback).forEach(([key, value]) => {
        if (filled[key] === undefined || filled[key] === null || filled[key] === '') {
            filled[key] = value;
        }
    });

    return filled;
};

function findDefaultService(service) {
    const normalizedService = normalizeService(service || {});
    return DEFAULT_SERVICES
        .map(normalizeService)
        .find((defaultService) => serviceMatches(normalizedService, defaultService)) || null;
}

function mergeDefaultServices(services = []) {
    const defaults = DEFAULT_SERVICES.map(normalizeService);
    const normalized = services.map((service) => {
        const normalizedService = normalizeService(service);
        const fallback = findDefaultService(normalizedService);

        return fallback ? fillEmptyFields(normalizedService, fallback) : normalizedService;
    });
    const existingKeys = new Set(
        normalized.flatMap((service) => [
            service.slug,
            toSlug(service.title),
            String(service.id || ''),
        ]).filter(Boolean)
    );

    const missingDefaults = defaults
        .filter((service) => !existingKeys.has(service.slug) && !existingKeys.has(toSlug(service.title)));

    return [...normalized, ...missingDefaults];
}

module.exports = {
    DEFAULT_SERVICES,
    findDefaultService,
    mergeDefaultServices,
    toSlug,
};
