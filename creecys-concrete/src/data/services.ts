import type { ImageMetadata } from 'astro';

import driveways from '../assets/images/service-driveways.jpg';
import slabs from '../assets/images/service-slabs.jpg';
import aggregate from '../assets/images/service-aggregate.jpg';
import paths from '../assets/images/service-paths.jpg';
import shedSlabs from '../assets/images/service-shed-slabs.jpg';
import decorative from '../assets/images/service-decorative.jpg';

export type Service = {
  title: string;
  summary: string;
  image: ImageMetadata;
  alt: string;
};

export const services: Service[] = [
  {
    title: 'Driveways',
    summary:
      'Properly prepared, correctly reinforced driveways that hold their shape and finish for the long run.',
    image: driveways,
    alt: 'A smooth concrete driveway with a clean control joint running up to a garage door',
  },
  {
    title: 'Concrete Slabs',
    summary:
      'Level, square and true. Slabs poured to spec with the base work done right before a single load arrives.',
    image: slabs,
    alt: 'A concreter levelling a fresh slab pour with a bull float',
  },
  {
    title: 'Exposed Aggregate',
    summary:
      'A durable, textured finish with real depth — washed back evenly and sealed for a consistent result.',
    image: aggregate,
    alt: 'Close view of an exposed aggregate concrete surface showing evenly distributed stone',
  },
  {
    title: 'Paths & Footpaths',
    summary:
      'Clean lines, even falls and tidy edges on paths, footpaths and access ways around the property.',
    image: paths,
    alt: 'A crisp concrete edge and low retaining wall meeting a clean lawn line',
  },
  {
    title: 'House & Shed Slabs',
    summary:
      'Set out accurately and finished flat, ready for the build to go straight up on top of it.',
    image: shedSlabs,
    alt: 'A row of finished concrete slabs and hardstand aprons in front of new garages',
  },
  {
    title: 'Decorative Concrete',
    summary:
      'Considered finishes for patios, alfresco areas and entertaining spaces that lift the whole property.',
    image: decorative,
    alt: 'A pale, smooth concrete floor running through a modern covered alfresco area',
  },
];
