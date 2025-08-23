/**
 * Brand Theme
 * Custom brand color palette theme for Bedfellow
 */

import { Theme, ThemeMode } from '../types';
import { brandColorScales, BRAND_COLORS } from '../colors/brandColors';
import {
  spacingScale as spacing,
  typographyScale as typography,
  borderRadiusScale as borderRadius,
  shadowScale as shadows,
} from '../scales';

const brandTheme: Theme = {
  mode: ThemeMode.LIGHT, // Base it on light mode for now

  colors: {
    // Backgrounds - Sand scale (light to dark)
    background: {
      50: brandColorScales.sand[50], // #FEF9E0 - Lightest sand
      100: brandColorScales.sand[100], // #FBF2C4
      200: brandColorScales.sand[200],
      300: brandColorScales.sand[300], // #E5C185
      400: brandColorScales.sand[400],
      500: brandColorScales.sand[500],
      600: brandColorScales.sand[600],
      700: brandColorScales.sand[700],
      800: brandColorScales.sand[800],
      900: brandColorScales.sand[900],
    },

    // Surfaces - Slightly darker sand for elevation
    surface: {
      50: brandColorScales.sand[100], // #FBF2C4
      100: brandColorScales.sand[200],
      200: brandColorScales.sand[300], // #E5C185
      300: brandColorScales.sand[400],
      400: brandColorScales.sand[500],
      500: brandColorScales.sand[600],
      600: brandColorScales.sand[700],
      700: brandColorScales.sand[800],
      800: brandColorScales.sand[900],
      900: brandColorScales.slate[50],
    },

    // Text - Slate scale
    text: {
      50: brandColorScales.slate[50],
      100: brandColorScales.slate[100],
      200: brandColorScales.slate[200],
      300: brandColorScales.slate[300],
      400: brandColorScales.slate[400],
      500: brandColorScales.slate[500],
      600: brandColorScales.slate[600], // #535A63 - Muted text
      700: brandColorScales.slate[700],
      800: brandColorScales.slate[800],
      900: brandColorScales.slate[900], // #343941 - Primary text
    },

    // Primary - Teal scale
    primary: brandColorScales.teal, // #008585 at 600

    // Secondary - Sage scale
    secondary: brandColorScales.sage, // #74A892 at 500

    // Accent - Rust scale
    accent: brandColorScales.rust, // #C7522A at 600

    // Semantic colors
    error: brandColorScales.rust,
    warning: brandColorScales.sand,
    success: brandColorScales.sage,
    info: brandColorScales.info,

    // Borders with opacity
    border: {
      50: `#${brandColorScales.slate[200].replace('#', '')}1A`, // 10% opacity
      100: `#${brandColorScales.slate[300].replace('#', '')}26`, // 15% opacity
      200: `#${brandColorScales.slate[400].replace('#', '')}33`, // 20% opacity
      300: `#${brandColorScales.slate[500].replace('#', '')}4D`, // 30% opacity
      400: `#${brandColorScales.slate[600].replace('#', '')}66`, // 40% opacity
      500: `#${brandColorScales.slate[700].replace('#', '')}80`, // 50% opacity
      600: `#${brandColorScales.slate[800].replace('#', '')}99`, // 60% opacity
      700: `#${brandColorScales.slate[800].replace('#', '')}B3`, // 70% opacity
      800: `#${brandColorScales.slate[900].replace('#', '')}CC`, // 80% opacity
      900: brandColorScales.slate[900], // 100% opacity
    },

    // Dividers with lower opacity
    divider: {
      50: `#${brandColorScales.slate[200].replace('#', '')}0D`, // 5% opacity
      100: `#${brandColorScales.slate[300].replace('#', '')}1A`, // 10% opacity
      200: `#${brandColorScales.slate[400].replace('#', '')}26`, // 15% opacity
      300: `#${brandColorScales.slate[500].replace('#', '')}33`, // 20% opacity
      400: `#${brandColorScales.slate[600].replace('#', '')}40`, // 25% opacity
      500: `#${brandColorScales.slate[700].replace('#', '')}4D`, // 30% opacity
      600: `#${brandColorScales.slate[800].replace('#', '')}5A`, // 35% opacity
      700: `#${brandColorScales.slate[800].replace('#', '')}66`, // 40% opacity
      800: `#${brandColorScales.slate[900].replace('#', '')}73`, // 45% opacity
      900: `#${brandColorScales.slate[900].replace('#', '')}80`, // 50% opacity
    },

    // Special colors
    shadow: 'rgba(52, 57, 65, 0.14)', // Based on slate-900
    overlay: 'rgba(52, 57, 65, 0.7)',

    // Stroke utilities
    softStroke: 'rgba(52, 57, 65, 0.12)',
    mediumStroke: 'rgba(52, 57, 65, 0.16)',
    strongStroke: 'rgba(52, 57, 65, 0.20)',
  },

  // Scales remain the same
  spacing,
  typography,
  borderRadius,
  shadows,

  // Brand gradients
  gradients: {
    brand: `linear-gradient(90deg, ${BRAND_COLORS.SAGE_500} 0%, ${BRAND_COLORS.TEAL_600} 100%)`,
    button: `linear-gradient(180deg, #009999 0%, ${BRAND_COLORS.TEAL_600} 50%, #006666 100%)`,
    header: `linear-gradient(135deg, ${BRAND_COLORS.SAND_50} 0%, #E6F7F7 50%, #CCE6E6 100%)`,
    accent: `linear-gradient(90deg, #D65A2F 0%, ${BRAND_COLORS.RUST_600} 50%, #B84825 100%)`,
    overlay: 'linear-gradient(180deg, rgba(52, 57, 65, 0) 0%, rgba(52, 57, 65, 0.7) 70%, rgba(52, 57, 65, 0.9) 100%)',
  },
};

export default brandTheme;
