import { Theme, ThemeMode, DynamicPalette } from '../types';
import lightTheme from './light';
import darkTheme from './dark';

// Default theme is the light theme
export const defaultTheme: Theme = lightTheme;

// Create a dynamic theme from album colors
export const createDynamicTheme = (palette: DynamicPalette, baseTheme: Theme = lightTheme): Theme => {
  // Use the album palette to override certain colors in the base theme
  // This maintains the structure but applies the dynamic colors

  return {
    ...baseTheme,
    mode: ThemeMode.DYNAMIC,
    colors: {
      ...baseTheme.colors,
      // Override with dynamic colors from album
      primary: {
        ...baseTheme.colors.primary,
        500: palette.primary,
        400: palette.primary,
        600: palette.primary,
      },
      secondary: {
        ...baseTheme.colors.secondary,
        500: palette.secondary,
        400: palette.secondary,
        600: palette.secondary,
      },
      accent: {
        ...baseTheme.colors.accent,
        500: palette.detail,
        400: palette.detail,
        600: palette.detail,
      },
      background: {
        ...baseTheme.colors.background,
        500: palette.background,
        400: palette.background,
        600: palette.background,
      },
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
