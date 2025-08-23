import { Platform } from 'react-native';
import { SpacingScale, TypographyScale, BorderRadiusScale, ShadowScale } from '../types';

// Base spacing unit (following 4-point grid system)
const BASE_SPACING = 4;

export const spacingScale: SpacingScale = {
  xs: BASE_SPACING, // 4
  sm: BASE_SPACING * 2, // 8
  md: BASE_SPACING * 4, // 16
  lg: BASE_SPACING * 6, // 24
  xl: BASE_SPACING * 8, // 32
  xxl: BASE_SPACING * 12, // 48
  xxxl: BASE_SPACING * 16, // 64
};

// Typography scale (using modular scale with 1.25 ratio)
export const typographyScale: TypographyScale = {
  xs: 10, // Extra small
  sm: 12, // Small
  base: 14, // Base/body text
  lg: 16, // Large body
  xl: 18, // H6
  '2xl': 20, // H5
  '3xl': 24, // H4
  '4xl': 30, // H3
  '5xl': 36, // H2/H1
};

// Border radius scale
export const borderRadiusScale: BorderRadiusScale = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999, // For circular elements
};

// Shadow scale - Platform specific shadows with brand colors
const createShadow = (
  elevation: number,
  shadowOpacity: number,
  shadowRadius: number,
  shadowOffset: { width: number; height: number }
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#343941', // Brand slate color
      shadowOffset,
      shadowOpacity,
      shadowRadius,
    };
  } else {
    // Android
    return {
      elevation,
      shadowColor: '#343941', // Android 28+ supports shadowColor
    };
  }
};

export const shadowScale: ShadowScale = {
  none: {},
  sm: createShadow(2, 0.12, 2, { width: 0, height: 1 }), // 12% opacity
  base: createShadow(4, 0.14, 4, { width: 0, height: 2 }), // 14% opacity (card shadow)
  md: createShadow(6, 0.16, 6, { width: 0, height: 3 }), // 16% opacity
  lg: createShadow(8, 0.18, 8, { width: 0, height: 4 }), // 18% opacity
  xl: createShadow(12, 0.2, 12, { width: 0, height: 6 }), // 20% opacity
  '2xl': createShadow(16, 0.2, 16, { width: 0, height: 8 }), // 20% opacity max
};

// Special card shadow that matches the PRD spec
export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#343941',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
  },
  android: {
    elevation: 4,
    shadowColor: '#343941',
  },
});

// Extended spacing helpers for common patterns
export const spacing = {
  ...spacingScale,
  // Padding presets
  paddingHorizontal: {
    xs: { paddingHorizontal: spacingScale.xs },
    sm: { paddingHorizontal: spacingScale.sm },
    md: { paddingHorizontal: spacingScale.md },
    lg: { paddingHorizontal: spacingScale.lg },
    xl: { paddingHorizontal: spacingScale.xl },
  },
  paddingVertical: {
    xs: { paddingVertical: spacingScale.xs },
    sm: { paddingVertical: spacingScale.sm },
    md: { paddingVertical: spacingScale.md },
    lg: { paddingVertical: spacingScale.lg },
    xl: { paddingVertical: spacingScale.xl },
  },
  // Margin presets
  marginHorizontal: {
    xs: { marginHorizontal: spacingScale.xs },
    sm: { marginHorizontal: spacingScale.sm },
    md: { marginHorizontal: spacingScale.md },
    lg: { marginHorizontal: spacingScale.lg },
    xl: { marginHorizontal: spacingScale.xl },
  },
  marginVertical: {
    xs: { marginVertical: spacingScale.xs },
    sm: { marginVertical: spacingScale.sm },
    md: { marginVertical: spacingScale.md },
    lg: { marginVertical: spacingScale.lg },
    xl: { marginVertical: spacingScale.xl },
  },
};

// Typography presets with line heights
export const typography = {
  // Display styles
  display: {
    fontSize: typographyScale['5xl'],
    lineHeight: typographyScale['5xl'] * 1.2,
    fontWeight: '700' as const,
  },
  // Heading styles
  h1: {
    fontSize: typographyScale['4xl'],
    lineHeight: typographyScale['4xl'] * 1.25,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: typographyScale['3xl'],
    lineHeight: typographyScale['3xl'] * 1.3,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: typographyScale['2xl'],
    lineHeight: typographyScale['2xl'] * 1.35,
    fontWeight: '600' as const,
  },
  h4: {
    fontSize: typographyScale.xl,
    lineHeight: typographyScale.xl * 1.4,
    fontWeight: '600' as const,
  },
  h5: {
    fontSize: typographyScale.lg,
    lineHeight: typographyScale.lg * 1.4,
    fontWeight: '600' as const,
  },
  h6: {
    fontSize: typographyScale.base,
    lineHeight: typographyScale.base * 1.4,
    fontWeight: '600' as const,
  },
  // Body styles
  body: {
    fontSize: typographyScale.base,
    lineHeight: typographyScale.base * 1.5,
    fontWeight: '400' as const,
  },
  bodyLarge: {
    fontSize: typographyScale.lg,
    lineHeight: typographyScale.lg * 1.5,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: typographyScale.sm,
    lineHeight: typographyScale.sm * 1.5,
    fontWeight: '400' as const,
  },
  // Caption and label styles
  caption: {
    fontSize: typographyScale.xs,
    lineHeight: typographyScale.xs * 1.4,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: typographyScale.sm,
    lineHeight: typographyScale.sm * 1.3,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  button: {
    fontSize: typographyScale.base,
    lineHeight: typographyScale.base * 1.2,
    fontWeight: '600' as const,
    letterSpacing: 0.75,
  },
};

// Animation durations (in milliseconds)
export const animationDurations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Z-index scale for layering
export const zIndexScale = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
};
