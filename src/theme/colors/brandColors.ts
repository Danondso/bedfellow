/**
 * Brand Color System
 * Core brand colors for Bedfellow's visual identity
 */

import { ColorScale } from '../types';
import { generateColorScale } from '../utils/colorGenerator';

/**
 * Base brand color values
 * These are the foundational colors from the brand palette
 */
export const BRAND_COLORS = {
  // Sand - Warm, natural base colors
  SAND_50: '#FEF9E0', // Base page background
  SAND_100: '#FBF2C4', // Subtle sections and tiles
  SAND_300: '#E5C185', // Surfaces and warm highlights

  // Primary colors
  TEAL_600: '#008585', // Primary brand color - buttons, links, key accents
  SAGE_500: '#74A892', // Secondary brand color - secondary CTAs, badges

  // Accent colors
  RUST_600: '#C7522A', // Accent/Danger - error states, critical actions
  AMBER_500: '#D97706', // Warm amber for warnings

  // Text colors
  SLATE_900: '#343941', // Primary text color
  SLATE_600: '#535A63', // Muted text color

  // Info and special colors
  INFO_600: '#5E7A7D', // Warm teal-gray for info states
  OBSIDIAN: '#000000', // Pure black for special uses

  // White variants for dark mode
  WHITE_WARM: '#FFF9F0', // Warm white with slight sand tint
  WHITE_PURE: '#FFFFFF', // Pure white for maximum contrast
} as const;

/**
 * Named brand colors for easier reference
 * Maps semantic names to actual color values
 */
export const brandColors = {
  sand50: BRAND_COLORS.SAND_50,
  sand100: BRAND_COLORS.SAND_100,
  sand300: BRAND_COLORS.SAND_300,
  teal600: BRAND_COLORS.TEAL_600,
  sage500: BRAND_COLORS.SAGE_500,
  rust600: BRAND_COLORS.RUST_600,
  amber500: BRAND_COLORS.AMBER_500,
  slate900: BRAND_COLORS.SLATE_900,
  slate600: BRAND_COLORS.SLATE_600,
  info600: BRAND_COLORS.INFO_600,
  obsidian: BRAND_COLORS.OBSIDIAN,
  whiteWarm: BRAND_COLORS.WHITE_WARM,
  whitePure: BRAND_COLORS.WHITE_PURE,
} as const;

/**
 * Text color mappings for different backgrounds
 * Ensures proper contrast and readability
 */
export const TEXT_ON_COLOR = {
  onTeal: BRAND_COLORS.SAND_50, // Light text on teal
  onSage: BRAND_COLORS.SLATE_900, // Dark text on sage
  onRust: BRAND_COLORS.SAND_50, // Light text on rust
  onSand: BRAND_COLORS.SLATE_900, // Dark text on sand surfaces
} as const;

/**
 * Semantic color mappings
 * Maps UI states to brand colors
 */
export const SEMANTIC_BRAND_COLORS = {
  primary: BRAND_COLORS.TEAL_600,
  secondary: BRAND_COLORS.SAGE_500,
  accent: BRAND_COLORS.RUST_600,
  success: BRAND_COLORS.SAGE_500,
  warning: BRAND_COLORS.AMBER_500, // Warm amber for better visibility
  info: BRAND_COLORS.INFO_600,
  danger: BRAND_COLORS.RUST_600,

  // Backgrounds
  background: BRAND_COLORS.SAND_50,
  surface: BRAND_COLORS.SAND_100,
  surfaceStrong: BRAND_COLORS.SAND_300,

  // Text
  text: BRAND_COLORS.SLATE_900,
  textMuted: BRAND_COLORS.SLATE_600,
} as const;

/**
 * Shadow and stroke colors
 * For consistent elevation and borders
 */
export const SHADOW_COLORS = {
  softStroke: 'rgba(52, 57, 65, 0.12)', // 12% opacity
  mediumStroke: 'rgba(52, 57, 65, 0.16)', // 16% opacity
  strongStroke: 'rgba(52, 57, 65, 0.20)', // 20% opacity
  cardShadow: 'rgba(52, 57, 65, 0.14)', // Card shadow color
} as const;

/**
 * Interface for brand color mapping structure
 */
export interface BrandColors {
  sand50: string;
  sand100: string;
  sand300: string;
  teal600: string;
  sage500: string;
  rust600: string;
  slate900: string;
  slate600: string;
  info600: string;
  obsidian: string;
}

/**
 * Interface for gradient definitions
 */
export interface BrandGradient {
  colors: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  angle?: number;
}

/**
 * Interface for gradient presets
 */
export interface GradientPresets {
  brand: BrandGradient;
  button: BrandGradient;
  header: BrandGradient;
  accent: BrandGradient;
  overlay: BrandGradient;
}

/**
 * Interface for complete brand palette including gradients
 */
export interface BrandPalette {
  colors: BrandColors;
  semantic: typeof SEMANTIC_BRAND_COLORS;
  textOnColor: typeof TEXT_ON_COLOR;
  shadows: typeof SHADOW_COLORS;
  gradients?: GradientPresets;
}

// Type exports for TypeScript support
export type BrandColorKey = keyof typeof brandColors;
export type SemanticColorKey = keyof typeof SEMANTIC_BRAND_COLORS;
export type TextOnColorKey = keyof typeof TEXT_ON_COLOR;

/**
 * Generated Color Scales
 * Full 50-900 scales for each brand color
 */

/**
 * Sand color scale
 * Warm, natural tones for backgrounds and surfaces
 * Preserves key brand values: 50 (#FEF9E0), 100 (#FBF2C4), 300 (#E5C185)
 */
export const sandScale: ColorScale = generateColorScale(BRAND_COLORS.SAND_100, {
  50: BRAND_COLORS.SAND_50, // #FEF9E0 - Preserved
  100: BRAND_COLORS.SAND_100, // #FBF2C4 - Preserved
  300: BRAND_COLORS.SAND_300, // #E5C185 - Preserved
});

/**
 * Teal color scale
 * Primary brand color for buttons, links, and key accents
 * Base value: 600 (#008585)
 */
export const tealScale: ColorScale = generateColorScale(BRAND_COLORS.TEAL_600, {
  600: BRAND_COLORS.TEAL_600, // #008585 - Primary brand teal
});

/**
 * Sage color scale
 * Secondary brand color for secondary CTAs and badges
 * Base value: 500 (#74A892)
 */
export const sageScale: ColorScale = generateColorScale(BRAND_COLORS.SAGE_500, {
  500: BRAND_COLORS.SAGE_500, // #74A892 - Secondary brand sage
});

/**
 * Rust color scale
 * Accent color for error states and critical actions
 * Base value: 600 (#C7522A)
 */
export const rustScale: ColorScale = generateColorScale(BRAND_COLORS.RUST_600, {
  600: BRAND_COLORS.RUST_600, // #C7522A - Accent/danger brand rust
});

/**
 * Slate color scale
 * Text and neutral colors for UI elements
 * Preserves key brand values: 600 (#535A63), 900 (#343941)
 */
export const slateScale: ColorScale = generateColorScale(BRAND_COLORS.SLATE_600, {
  600: BRAND_COLORS.SLATE_600, // #535A63 - Muted text
  900: BRAND_COLORS.SLATE_900, // #343941 - Primary text
});

/**
 * Amber color scale
 * Warm warning color for better visibility
 * Base value: 500 (#D97706)
 */
export const amberScale: ColorScale = generateColorScale(BRAND_COLORS.AMBER_500, {
  500: BRAND_COLORS.AMBER_500, // #D97706 - Warm amber for warnings
});

/**
 * Info color scale
 * Warm teal-gray for informational states
 * Base value: 600 (#5E7A7D)
 */
export const infoScale: ColorScale = generateColorScale(BRAND_COLORS.INFO_600, {
  600: BRAND_COLORS.INFO_600, // #5E7A7D - Warm teal-gray info
});

/**
 * White color scale
 * Whites and off-whites for dark mode text
 * Preserves warm and pure white values
 */
export const whiteScale: ColorScale = generateColorScale(BRAND_COLORS.WHITE_WARM, {
  50: BRAND_COLORS.WHITE_WARM, // #FFF9F0 - Warm white
  100: BRAND_COLORS.WHITE_PURE, // #FFFFFF - Pure white
});

// Export all scales for easy access
export const brandColorScales = {
  sand: sandScale,
  teal: tealScale,
  sage: sageScale,
  rust: rustScale,
  amber: amberScale,
  slate: slateScale,
  info: infoScale,
  white: whiteScale,
} as const;
