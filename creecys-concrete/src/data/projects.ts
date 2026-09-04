import type { ImageMetadata } from 'astro';

import p1 from '../assets/images/project-01.jpg';
import p2 from '../assets/images/project-02.jpg';
import p3 from '../assets/images/project-03.jpg';
import p4 from '../assets/images/project-04.jpg';
import p5 from '../assets/images/project-05.jpg';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROJECT GALLERY
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚠️  The photographs below are stock placeholders, not Creecy's Concrete
 *      jobs. To swap in real work:
 *
 *      1. Drop the photos into `src/assets/images/`
 *      2. Update the `import` lines above to point at them
 *      3. Update each `title`, `category` and `alt` to describe the real job
 *
 *      Deliberately no client names, locations or dates — add them only once
 *      they are real. The layout takes any number of entries; the first is
 *      shown as the large featured project.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Project = {
  title: string;
  category: string;
  image: ImageMetadata;
  alt: string;
};

export const projects: Project[] = [
  {
    title: 'Residential Driveway',
    category: 'Plain concrete',
    image: p1,
    alt: 'A wide new concrete driveway with a raised edge running up to a modern home',
  },
  {
    title: 'Steps & Terracing',
    category: 'Paths',
    image: p2,
    alt: 'A sweep of poured concrete steps curving through established garden planting',
  },
  {
    title: 'Alfresco Slab',
    category: 'Decorative',
    image: p3,
    alt: 'A large concrete entertaining area under cover, opening onto a pool and lawn',
  },
  {
    title: 'Double Driveway',
    category: 'Plain concrete',
    image: p4,
    alt: 'A broad double-width concrete driveway in front of a two-car garage',
  },
  {
    title: 'Feature Paving',
    category: 'Decorative',
    image: p5,
    alt: 'Large-format concrete paving with crisp joints and a strong diagonal shadow',
  },
];
