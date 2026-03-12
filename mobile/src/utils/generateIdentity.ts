import type { AnonIdentity } from '../types';

const ADJECTIVES = [
  'Silent', 'Coastal', 'Ancient', 'Mossy', 'Golden', 'Midnight',
  'Crimson', 'Hidden', 'Swift', 'Quiet', 'Hollow', 'Dusky',
];

const NOUNS = [
  'Heron', 'Cedar', 'Osprey', 'Magnolia', 'Tide', 'Sparrow',
  'Willow', 'Gator', 'Oak', 'Hawk', 'Marsh', 'Cistern',
];

export function generateIdentity(): AnonIdentity {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return {
    id:          `identity-${Date.now()}`,
    displayName: `${adj} ${noun}`,
    createdAt:   new Date().toISOString(),
  };
}
