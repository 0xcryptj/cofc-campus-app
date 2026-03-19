import { Platform } from 'react-native';

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
} as const;

// ─── Typography tokens ────────────────────────────────────────────────────────

export const Type = {
  // Sizes
  size: {
    caption:  10,
    label:    12,
    body:     14,
    card:     20,
    section:  24,
    screen:   32,
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
    tight:  14,
    body:   20,
    loose:  26,
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

// ─── Spacing — 8px base unit ──────────────────────────────────────────────────

export const Space = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────

export const Radius = {
  xs:   2,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  full: 9999,
} as const;

// ─── Elevation / shadows ──────────────────────────────────────────────────────

export const Elevation = {
  // Spec-defined card shadow
  // Web uses boxShadow; native uses shadow* props (react-native-web warns on shadow*)
  card: Platform.select({
    web:     { boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' },
    default: { elevation: 2, shadowColor: '#000000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  }) as object,
  // Stronger — modal, bottom sheet
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
  buttonHeight:  44,
  inputHeight:   44,
  avatarSm:      36,
  avatarMd:      48,
  avatarLg:      64,
  tabBarHeight:  60,
  fabSize:       52,
} as const;
