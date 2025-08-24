import { Theme } from '../../../theme/types';

/**
 * Resolves a color value from the theme
 * Supports:
 * - Theme color names (primary, secondary, accent, error, etc.)
 * - Color shades (50-900)
 * - Direct hex values
 * - Fallback values
 */
export const resolveThemeColor = (
  theme: Theme,
  color?: string,
  defaultShade: number = 500,
  fallback?: string
): string | undefined => {
  if (!color) return fallback;

  // Check if it's a hex color
  if (color.startsWith('#')) {
    return color;
  }

  // Try to resolve from theme colors
  const colorCategories = [
    'primary',
    'secondary',
    'accent',
    'error',
    'warning',
    'success',
    'info',
    'text',
    'background',
    'surface',
    'border',
  ];

  for (const category of colorCategories) {
    if (color === category) {
      const colorScale = theme.colors[category as keyof typeof theme.colors];
      if (colorScale && typeof colorScale === 'object' && defaultShade in colorScale) {
        return (colorScale as any)[defaultShade];
      }
    }

    // Check for color with shade notation (e.g., "primary.600")
    if (color.startsWith(`${category}.`)) {
      const shade = parseInt(color.split('.')[1], 10);
      const colorScale = theme.colors[category as keyof typeof theme.colors];
      if (colorScale && typeof colorScale === 'object' && shade in colorScale) {
        return (colorScale as any)[shade];
      }
    }
  }

  return fallback;
};

/**
 * Adds alpha channel to a hex color
 */
export const addAlpha = (color: string, alpha: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Gets the appropriate text color based on the background
 */
export const getContrastTextColor = (theme: Theme, background?: string): string => {
  if (!background) return theme.colors.text[900];

  // Simple contrast check - in production, use proper luminance calculation
  const isDark = theme.mode === 'dark';
  return isDark ? theme.colors.text[50] : theme.colors.text[900];
};
