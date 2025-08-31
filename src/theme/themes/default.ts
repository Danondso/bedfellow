import { Theme, ThemeMode, DynamicPalette } from '../types';
import lightTheme from './light';
import darkTheme from './dark';
import { lighten, darken, adjustSaturation, mixColors } from '../utils/colorGenerator';

// Default theme is the light theme
export const defaultTheme: Theme = lightTheme;

// Create a dynamic theme from album colors
export const createDynamicTheme = (palette: DynamicPalette, baseTheme: Theme = lightTheme): Theme => {
  // Use the album palette to override certain colors in the base theme
  // This maintains the structure but applies the dynamic colors

  // Generate more vibrant color scales from the palette colors
  const generateScale = (baseColor: string) => ({
    50: lighten(adjustSaturation(baseColor, 10), 45),
    100: lighten(adjustSaturation(baseColor, 10), 35),
    200: lighten(adjustSaturation(baseColor, 10), 25),
    300: lighten(adjustSaturation(baseColor, 10), 15),
    400: lighten(adjustSaturation(baseColor, 10), 5),
    500: adjustSaturation(baseColor, 15), // Boost saturation for base color
    600: darken(adjustSaturation(baseColor, 15), 10),
    700: darken(adjustSaturation(baseColor, 15), 20),
    800: darken(adjustSaturation(baseColor, 10), 30),
    900: darken(adjustSaturation(baseColor, 5), 40),
  });

  // Generate text colors that complement the album colors
  const textColors = {
    50: lighten(mixColors(palette.detail, '#FFFFFF', 0.2), 40),
    100: lighten(mixColors(palette.detail, '#FFFFFF', 0.3), 30),
    200: lighten(mixColors(palette.detail, '#CCCCCC', 0.4), 20),
    300: mixColors(palette.detail, '#999999', 0.5),
    400: mixColors(palette.detail, '#666666', 0.6),
    500: mixColors(palette.detail, '#444444', 0.7),
    600: mixColors(palette.detail, '#333333', 0.8),
    700: mixColors(palette.detail, '#222222', 0.85),
    800: mixColors(palette.detail, '#111111', 0.9),
    900: mixColors(palette.detail, '#000000', 0.8),
  };

  return {
    ...baseTheme,
    mode: ThemeMode.DYNAMIC,
    colors: {
      ...baseTheme.colors,
      // Override with dynamic colors from album
      primary: generateScale(palette.primary),
      secondary: generateScale(palette.secondary),
      accent: generateScale(palette.detail),
      // Text colors with subtle album color tinting
      text: textColors,
      // Dynamic background colors - use lighter, tinted versions of album colors
      background: {
        50: lighten(mixColors(palette.background, '#FFFFFF', 0.3), 40), // Very light tinted white
        100: lighten(mixColors(palette.background, palette.secondary, 0.8), 35),
        200: lighten(mixColors(palette.background, palette.secondary, 0.75), 30),
        300: lighten(mixColors(palette.background, palette.primary, 0.8), 25),
        400: lighten(mixColors(palette.background, palette.primary, 0.75), 20),
        500: lighten(mixColors(palette.background, palette.secondary, 0.7), 15),
        600: lighten(palette.background, 10),
        700: lighten(palette.background, 5),
        800: palette.background,
        900: darken(palette.background, 10),
      },
      // Dynamic surface colors for cards - more vibrant with primary/secondary colors
      surface: {
        50: lighten(mixColors(palette.secondary, '#FFFFFF', 0.2), 35), // Light secondary tint
        100: lighten(mixColors(palette.primary, '#FFFFFF', 0.25), 30), // Light primary tint for cards
        200: lighten(mixColors(palette.secondary, palette.background, 0.6), 25),
        300: lighten(mixColors(palette.primary, palette.background, 0.6), 20),
        400: lighten(mixColors(palette.secondary, palette.background, 0.5), 15),
        500: lighten(mixColors(palette.primary, palette.background, 0.5), 10),
        600: mixColors(palette.secondary, palette.background, 0.4),
        700: mixColors(palette.primary, palette.background, 0.4),
        800: darken(mixColors(palette.secondary, palette.background, 0.3), 5),
        900: darken(mixColors(palette.primary, palette.background, 0.3), 10),
      },
    },
    // Add custom gradients based on the palette
    gradients: {
      ...baseTheme.gradients,
      brand: `linear-gradient(90deg, ${palette.secondary} 0%, ${palette.primary} 100%)`,
      accent: `linear-gradient(90deg, ${lighten(palette.detail, 10)} 0%, ${palette.detail} 50%, ${darken(palette.detail, 10)} 100%)`,
    },
  };
};

// Fallback theme for error states
export const fallbackTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // Use more muted colors for fallback
    primary: {
      ...lightTheme.colors.primary,
      500: '#757575', // Gray as fallback
    },
    secondary: {
      ...lightTheme.colors.secondary,
      500: '#9E9E9E', // Light gray
    },
    accent: {
      ...lightTheme.colors.accent,
      500: '#BDBDBD', // Lighter gray
    },
  },
};

// Get the appropriate base theme for dynamic mode based on system preference
export const getBaseThemeForDynamic = (prefersDark: boolean): Theme => {
  return prefersDark ? darkTheme : lightTheme;
};

// Validate if a theme object is valid
export const isValidTheme = (theme: any): theme is Theme => {
  return (
    theme &&
    typeof theme === 'object' &&
    'mode' in theme &&
    'colors' in theme &&
    'spacing' in theme &&
    'typography' in theme &&
    'borderRadius' in theme &&
    'shadows' in theme
  );
};

export default defaultTheme;
