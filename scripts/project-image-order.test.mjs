import assert from 'node:assert/strict';
import {
  chooseDisplayOrder,
  firstImageByProject,
  normalizeImageOrder
} from '../lib/projectImageOrdering.mjs';

const existingImages = [
  { id: 1, project_id: 7, image_path: '/uploads/old-a.png', display_order: 1 },
  { id: 2, project_id: 7, image_path: '/uploads/old-b.png', display_order: 2 },
  { id: 3, project_id: 7, image_path: '/uploads/old-c.png', display_order: 3 }
];

assert.equal(
  chooseDisplayOrder(existingImages, 4),
  4,
  'accept next requested order when it is greater than current max'
);

assert.equal(
  chooseDisplayOrder([...existingImages, { id: 4, display_order: 4 }], 4),
  5,
  'duplicate requested order should append after current max'
);

assert.deepEqual(
  normalizeImageOrder([
    { id: 30, display_order: 10 },
    { id: 10, display_order: 10 },
    { id: 20, display_order: 20 }
  ]),
  [
    { id: 10, display_order: 1 },
    { id: 30, display_order: 2 },
    { id: 20, display_order: 3 }
  ],
  'normalizeImageOrder should remove duplicate order ties using id as stable tiebreaker'
);

assert.deepEqual(
  firstImageByProject([
    { id: 8, project_id: 2, image_path: '/uploads/project-2-b.png', display_order: 1 },
    { id: 7, project_id: 2, image_path: '/uploads/project-2-a.png', display_order: 1 },
    { id: 9, project_id: 2, image_path: '/uploads/project-2-c.png', display_order: 2 },
    { id: 12, project_id: 3, image_path: '/uploads/project-3-a.png', display_order: 4 }
  ]),
  {
    2: '/uploads/project-2-a.png',
    3: '/uploads/project-3-a.png'
  },
  'firstImageByProject should choose lowest display_order, then lowest id'
);

console.log('project-image-order regression tests passed');
