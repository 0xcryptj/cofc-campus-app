// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors = {
  // Brand
  maroon: '#6B1D1D',
  maroonDark: '#4E1414',
  maroonLight: '#8B3A3A',
  maroonFaint: '#F5EAEA',

  // Backgrounds
  background: '#F7F6F3',   // warm off-white
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAF8', // slightly off-white for nested surfaces
  surfaceAlt: '#F0EFEC',

  // Text
  textPrimary: '#18181B',
  textSecondary: '#71717A',
  textMuted: '#A1A1AA',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E4E4E7',
  borderStrong: '#D4D4D8',
  divider: '#F0F0F0',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.42)',

  // Semantic
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',

  // Avatar palette — 8 refined colors for anon identities
  avatarPalette: [
    '#6B1D1D', // maroon
    '#1E3A5F', // midnight navy
    '#1A4731', // deep forest
    '#3B1F6B', // plum
    '#7C2D12', // burnt sienna
    '#0F4C5C', // deep teal
    '#374151', // charcoal
    '#6D1B3C', // wine
  ],
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Typography = {
  // Size scale
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Line heights (use these to keep consistent vertical rhythm)
  lineHeightSm: 18,
  lineHeightBase: 22,
  lineHeightMd: 26,

  // Letter spacing
  tightTracking: -0.3,
  normalTracking: 0,
  wideTracking: 0.4,
  capsTracking: 0.8,
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
  section: 56,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────
// Each level is strictly stronger than the previous.

export const Shadow = {
  // Barely visible — for cards in a white environment
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  // Standard feed card
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  // Elevated card or bottom sheet
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  // FAB / floating element
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
  // Brand-tinted shadow for the FAB
  fab: {
    shadowColor: '#6B1D1D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
  },
} as const;

// ─── Animation durations ──────────────────────────────────────────────────────

export const Duration = {
  fast: 150,
  base: 250,
  slow: 380,
} as const;
