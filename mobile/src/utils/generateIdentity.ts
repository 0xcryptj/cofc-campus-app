import { Colors } from '../theme';
import type { AnonIdentity } from '../types';

const ADJECTIVES = [
  'Purple', 'Maroon', 'Silent', 'Golden', 'Midnight', 'Crimson',
  'Hidden', 'Coastal', 'Ancient', 'Quiet', 'Mossy', 'Swift',
];

const NOUNS = [
  'Fox', 'Bear', 'Heron', 'Oak', 'Magnolia', 'Osprey',
  'Cedar', 'Tide', 'Hawk', 'Willow', 'Gator', 'Sparrow',
];

export function generateIdentity(): AnonIdentity {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const palette = Colors.avatarPalette;
  const color = palette[Math.floor(Math.random() * palette.length)];

  return {
    id: `identity-${Date.now()}`,
    displayName: `${adj} ${noun}`,
    avatarColor: color,
    createdAt: new Date().toISOString(),
  };
}
