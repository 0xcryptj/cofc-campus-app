// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors = {
  // Brand
  maroon: '#6B1D1D',       // CofC maroon — primary accent
  maroonLight: '#8B3A3A',  // lighter maroon for hover/pressed states
  maroonFaint: '#F5EAEA',  // very light maroon tint for backgrounds

  // Backgrounds
  background: '#F8F7F5',   // warm off-white — main app background
  surface: '#FFFFFF',      // card / sheet surface
  surfaceAlt: '#F2F1EF',   // slightly darker surface for inputs

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#A0A0A0',

  // Utility
  border: '#E5E4E2',
  divider: '#EBEBEB',
  white: '#FFFFFF',

  // Status
  success: '#2E7D32',
  error: '#C62828',
  warning: '#F57F17',

  // Avatar palette — used for anon identity colors
  avatarPalette: [
    '#6B1D1D', // maroon
    '#1A3A5C', // navy
    '#1B5E20', // forest
    '#4A148C', // purple
    '#BF360C', // burnt orange
    '#006064', // teal
    '#37474F', // slate
    '#880E4F', // rose
  ],
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,

  // Font weights (cast to match React Native's accepted values)
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

// ─── Shadows (iOS) ────────────────────────────────────────────────────────────

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2, // Android fallback
  },
} as const;
