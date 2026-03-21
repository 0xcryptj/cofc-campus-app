import { Platform, Dimensions, PixelRatio } from 'react-native';

// ─── Responsive scale helpers ─────────────────────────────────────────────────

const BASE_WIDTH = 390; // iPhone 15 Pro reference width

/** Full linear scale relative to screen width */
export function scale(size: number): number {
  const { width } = Dimensions.get('window');
  return Math.round(PixelRatio.roundToNearestPixel(size * (width / BASE_WIDTH)));
}

/** Moderate scale — scales fonts/spacing less aggressively (factor 0–1) */
export function ms(size: number, factor = 0.45): number {
  return Math.round(size + (scale(size) - size) * factor);
}

// ─── Font families ────────────────────────────────────────────────────────────

export const Fonts = {
  regular: 'SpaceMono_400Regular',
  bold:    'SpaceMono_700Bold',
} as const;

// ─── Color tokens ─────────────────────────────────────────────────────────────

export const Colors = {
  // Brand
  primary:        '#800020',   // Cougar Maroon
  primaryPressed: '#5C0014',   // pressed/active state
  primaryFaint:   'rgba(128,0,32,0.08)',  // avatar wash, tinted surfaces

  // Backgrounds
  background:    '#F9F7F5',   // app background
  surface:       '#FFFFFF',   // card surface

  // Text
  textPrimary:   '#2C2C2C',
  textMuted:     '#A8A6A3',
  textInverse:   '#FFFFFF',

  // Borders / dividers
  border:        '#F2F0ED',

  // Inputs
  inputBg:       '#F2F0ED',

  // Semantic
  success:       '#22C55E',   // upvote active
  error:         '#EF4444',
  disabled:      '#A8A6A3',

  // Absolute
  white:         '#FFFFFF',
  black:         '#000000',
  transparent:   'transparent',

  // ── Dating channel palette (Tea-app inspired) ─────────────────────────────
  datingPrimary:  '#C9515A',   // warm rose
  datingPressed:  '#A73B43',
  datingFaint:    'rgba(201,81,90,0.07)',
  datingBorder:   'rgba(201,81,90,0.22)',
  datingCard:     '#FFF9F9',   // barely-there rose tint
  datingHeart:    '#E05563',   // active heart
  datingHeartFaint:'rgba(224,85,99,0.10)',
} as const;

// ─── Typography tokens ────────────────────────────────────────────────────────

export const Type = {
  // Sizes (moderate-scaled so they flex slightly across screens)
  size: {
    caption:  ms(10),
    label:    ms(12),
    body:     ms(14),
    card:     ms(20),
    section:  ms(22),
    screen:   ms(30),
  },

  // Weights
  weight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },

  // Line heights
  leading: {
    tight:  ms(14),
    body:   ms(20),
    loose:  ms(26),
  },

  // Letter spacing
  tracking: {
    caption:  0.3,
    label:    0.5,
    normal:   0,
    tight:   -0.3,
    tightest:-0.5,
  },
} as const;

// ─── Spacing — 8px base unit (moderate-scaled) ────────────────────────────────

export const Space = {
  xs:   ms(4),
  sm:   ms(8),
  md:   ms(16),
  lg:   ms(24),
  xl:   ms(32),
  xxl:  ms(48),
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────

export const Radius = {
  xs:   2,
  sm:   6,
  md:   10,
  lg:   14,
  xl:   18,
  full: 9999,
} as const;

// ─── Elevation / shadows ──────────────────────────────────────────────────────

export const Elevation = {
  card: Platform.select({
    web:     { boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' },
    default: { elevation: 2, shadowColor: '#000000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  }) as object,
  modal: Platform.select({
    web:     { boxShadow: '0px 4px 12px rgba(0,0,0,0.12)' },
    default: { elevation: 8, shadowColor: '#000000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  }) as object,
};

// ─── Layout — mobile-first content sizing ─────────────────────────────────────
// maxWidth: the phone-frame width used in web preview (matches App.tsx shell)
// contentPadding: standard horizontal padding for screen content

export const Layout = {
  maxWidth:       430,
  contentPadding: 16,
} as const;

// ─── Dimensions ───────────────────────────────────────────────────────────────

export const Dim = {
  buttonHeight:  ms(48),
  inputHeight:   ms(48),
  avatarSm:      ms(36),
  avatarMd:      ms(48),
  avatarLg:      ms(64),
  tabBarHeight:  ms(56),
  fabSize:       ms(54),
} as const;
