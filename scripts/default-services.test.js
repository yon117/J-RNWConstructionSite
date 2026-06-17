const assert = require('node:assert/strict');
const { DEFAULT_SERVICES, findDefaultService, mergeDefaultServices } = require('../lib/defaultServices');

const fromDb = [
    {
        id: 1,
        title: 'Mold Mitigation',
        description: '',
        image_url: '/custom/mold.jpg',
        slug: 'mold',
    },
    {
        id: 2,
        title: 'Siding',
        description: 'Existing siding copy',
        image_url: '/custom/siding.jpg',
        slug: 'siding',
    },
];

const merged = mergeDefaultServices(fromDb);

assert.equal(DEFAULT_SERVICES.length, 2);
assert.equal(merged.filter((service) => service.slug === 'mold').length, 1);
assert.ok(merged.find((service) => service.slug === 'mold').description.length > 40);
assert.equal(merged.find((service) => service.slug === 'mold').image_url, '/custom/mold.jpg');
assert.ok(merged.some((service) => service.slug === 'structural-support-repair'));
assert.ok(merged.every((service) => service.image_url));
assert.equal(findDefaultService({ title: 'Mold Mitigation', description: '' }).slug, 'mold');
assert.equal(findDefaultService({ slug: 'structural-support-repair' }).title, 'Structural Support & Repair');

console.log('default service merge test passed');
