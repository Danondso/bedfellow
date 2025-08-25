/**
 * Dark Theme
 * Warm dark mode that maintains the brand aesthetic
 */

import { Theme, ThemeMode } from '../types';
import { brandColorScales, BRAND_COLORS } from '../colors/brandColors';
import { hexToRgba } from '../utils/colorGenerator';
import {
  spacingScale as spacing,
  typographyScale as typography,
  borderRadiusScale as borderRadius,
  shadowScale as shadows,
} from '../scales';

// Base color for borders and dividers in dark mode
const sandBase = BRAND_COLORS.SAND_50; // #FEF9E0

const darkTheme: Theme = {
  mode: ThemeMode.DARK,

  colors: {
    // Backgrounds - Dark warm browns/slates
    background: {
      50: '#1A1611', // Darkest - warm dark brown
      100: '#221E17', // Very dark warm brown
      200: '#2A251D', // Dark warm brown
      300: '#322C23', // Dark sand-influenced brown
      400: '#3A3329', // Medium dark brown
      500: '#423A2F', // Base dark background with warm undertones
      600: '#4A4135',
      700: '#52483B',
      800: '#5A4F41',
      900: '#625647',
    },

    // Surfaces - Slightly lighter warm browns for elevation
    surface: {
      50: '#221E17', // Dark warm brown
      100: '#2A251D', // Slightly lighter
      200: '#322C23', // Warm brown surface
      300: '#3A3329',
      400: '#423A2F',
      500: '#4A4135', // Base surface with warm undertones
      600: '#52483B',
      700: '#5A4F41',
      800: '#625647',
      900: '#6A5D4D',
    },

    // Text - Light warm colors for dark backgrounds
    text: {
      50: brandColorScales.slate[700], // Muted text
      100: brandColorScales.slate[600],
      200: brandColorScales.slate[500],
      300: brandColorScales.slate[400],
      400: brandColorScales.slate[300],
      500: brandColorScales.sand[200], // Base text - warm light
      600: brandColorScales.sand[100], // Brighter text
      700: brandColorScales.sand[50], // Primary text
      800: brandColorScales.white[50], // Very bright text - warm white
      900: brandColorScales.white[100], // Pure white for emphasis
    },

    // Primary - Lighter teal for dark mode
    primary: {
      50: brandColorScales.teal[900],
      100: brandColorScales.teal[800],
      200: brandColorScales.teal[700],
      300: brandColorScales.teal[600], // Original brand teal
      400: brandColorScales.teal[500],
      500: brandColorScales.teal[400], // Base - lighter for dark mode
      600: brandColorScales.teal[300],
      700: brandColorScales.teal[200],
      800: brandColorScales.teal[100],
      900: brandColorScales.teal[50],
    },

    // Secondary - Lighter sage for dark mode
    secondary: {
      50: brandColorScales.sage[900],
      100: brandColorScales.sage[800],
      200: brandColorScales.sage[700],
      300: brandColorScales.sage[600],
      400: brandColorScales.sage[500], // Original brand sage
      500: brandColorScales.sage[400], // Base - lighter for dark mode
      600: brandColorScales.sage[300],
      700: brandColorScales.sage[200],
      800: brandColorScales.sage[100],
      900: brandColorScales.sage[50],
    },

    // Accent - Lighter rust for dark mode
    accent: {
      50: brandColorScales.rust[900],
      100: brandColorScales.rust[800],
      200: brandColorScales.rust[700],
      300: brandColorScales.rust[600], // Original brand rust
      400: brandColorScales.rust[500],
      500: brandColorScales.rust[400], // Base - lighter for dark mode
      600: brandColorScales.rust[300],
      700: brandColorScales.rust[200],
      800: brandColorScales.rust[100],
      900: brandColorScales.rust[50],
    },

    // Semantic colors - using lighter variants for dark theme
    error: {
      50: brandColorScales.rust[900],
      100: brandColorScales.rust[800],
      200: brandColorScales.rust[700],
      300: brandColorScales.rust[600],
      400: brandColorScales.rust[500],
      500: brandColorScales.rust[400], // Lighter rust for visibility
      600: brandColorScales.rust[300],
      700: brandColorScales.rust[200],
      800: brandColorScales.rust[100],
      900: brandColorScales.rust[50],
    },
    warning: {
      50: brandColorScales.amber[900],
      100: brandColorScales.amber[800],
      200: brandColorScales.amber[700],
      300: brandColorScales.amber[600],
      400: brandColorScales.amber[500], // Original amber
      500: brandColorScales.amber[400], // Lighter for visibility
      600: brandColorScales.amber[300],
      700: brandColorScales.amber[200],
      800: brandColorScales.amber[100],
      900: brandColorScales.amber[50],
    },
    success: {
      50: brandColorScales.sage[900],
      100: brandColorScales.sage[800],
      200: brandColorScales.sage[700],
      300: brandColorScales.sage[600],
      400: brandColorScales.sage[500],
      500: brandColorScales.sage[400], // Lighter sage for visibility
      600: brandColorScales.sage[300],
      700: brandColorScales.sage[200],
      800: brandColorScales.sage[100],
      900: brandColorScales.sage[50],
    },
    info: {
      50: brandColorScales.info[900],
      100: brandColorScales.info[800],
      200: brandColorScales.info[700],
      300: brandColorScales.info[600],
      400: brandColorScales.info[500],
      500: brandColorScales.info[400], // Lighter for visibility
      600: brandColorScales.info[300],
      700: brandColorScales.info[200],
      800: brandColorScales.info[100],
      900: brandColorScales.info[50],
    },

    // Borders with warm tones and opacity
    border: {
      50: hexToRgba(sandBase, 0.05), // Sand-based border
      100: hexToRgba(sandBase, 0.1),
      200: hexToRgba(sandBase, 0.15),
      300: hexToRgba(sandBase, 0.2),
      400: hexToRgba(sandBase, 0.25),
      500: hexToRgba(sandBase, 0.3), // Base
      600: hexToRgba(sandBase, 0.35),
      700: hexToRgba(sandBase, 0.4),
      800: hexToRgba(sandBase, 0.45),
      900: hexToRgba(sandBase, 0.5),
    },

    // Dividers with lower opacity
    divider: {
      50: hexToRgba(sandBase, 0.03),
      100: hexToRgba(sandBase, 0.05),
      200: hexToRgba(sandBase, 0.08),
      300: hexToRgba(sandBase, 0.1),
      400: hexToRgba(sandBase, 0.12),
      500: hexToRgba(sandBase, 0.15), // Base
      600: hexToRgba(sandBase, 0.18),
      700: hexToRgba(sandBase, 0.2),
      800: hexToRgba(sandBase, 0.23),
      900: hexToRgba(sandBase, 0.25),
    },

    // Special colors for dark theme
    shadow: 'rgba(0, 0, 0, 0.4)', // Darker shadows
    overlay: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    softStroke: hexToRgba(sandBase, 0.08),
    mediumStroke: hexToRgba(sandBase, 0.12),
    strongStroke: hexToRgba(sandBase, 0.16),
  },

  // Scales remain the same
  spacing,
  typography,
  borderRadius,
  shadows,

  // Dark mode gradients with warm tones
  gradients: {
    brand: `linear-gradient(90deg, ${brandColorScales.sage[400]} 0%, ${brandColorScales.teal[400]} 100%)`,
    button: `linear-gradient(180deg, ${brandColorScales.teal[300]} 0%, ${brandColorScales.teal[400]} 50%, ${brandColorScales.teal[500]} 100%)`,
    header: `linear-gradient(135deg, #423A2F 0%, #3A3329 50%, #322C23 100%)`,
    accent: `linear-gradient(90deg, ${brandColorScales.rust[300]} 0%, ${brandColorScales.rust[400]} 50%, ${brandColorScales.rust[500]} 100%)`,
    overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.9) 100%)',
  },
};

export default darkTheme;
