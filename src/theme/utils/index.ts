import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme, ThemeColors, ColorScale } from '../types';

// Utility type for extracting color values from a ColorScale
export type ColorValue = string;

// Get a specific shade from a color scale
export const getColorShade = (scale: ColorScale, shade: keyof ColorScale): ColorValue => {
  return scale[shade];
};

// Get the base color (500) from a scale
export const getBaseColor = (scale: ColorScale): ColorValue => {
  return scale[500];
};

// Utility type for style props that can receive theme values
export type ThemedStyle<T = ViewStyle | TextStyle | ImageStyle> = T | ((theme: Theme) => T);

// Helper to resolve themed styles
export const resolveThemedStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  style: ThemedStyle<T> | undefined,
  theme: Theme
): T | undefined => {
  if (!style) return undefined;
  return typeof style === 'function' ? style(theme) : style;
};

// Color contrast utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  // Relative luminance formula
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if color combination meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
export const meetsContrastStandard = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

// Automatically select text color based on background
export const getContrastTextColor = (backgroundColor: string, theme: Theme): ColorValue => {
  const lightText = theme.colors.text[900]; // White or near-white
  const darkText = theme.colors.text[900]; // Black or near-black

  const lightContrast = getContrastRatio(lightText, backgroundColor);
  const darkContrast = getContrastRatio(darkText, backgroundColor);

  return lightContrast > darkContrast ? lightText : darkText;
};

// Style helper factories
export const createThemedStyles = <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  stylesFn: (theme: Theme) => T
) => {
  return (theme: Theme): T => stylesFn(theme);
};

// Common themed style utilities
export const themedStyles = {
  // Flex utilities
  flex: (value: number) => ({ flex: value }),
  flexRow: { flexDirection: 'row' as const },
  flexColumn: { flexDirection: 'column' as const },
  justifyCenter: { justifyContent: 'center' as const },
  justifyBetween: { justifyContent: 'space-between' as const },
  justifyAround: { justifyContent: 'space-around' as const },
  alignCenter: { alignItems: 'center' as const },
  alignStart: { alignItems: 'flex-start' as const },
  alignEnd: { alignItems: 'flex-end' as const },

  // Position utilities
  absolute: { position: 'absolute' as const },
  relative: { position: 'relative' as const },
  fillParent: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Size utilities
  fullWidth: { width: '100%' as const },
  fullHeight: { height: '100%' as const },

  // Common patterns
  centered: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  // Shadow helper
  shadow: (theme: Theme, level: keyof Theme['shadows'] = 'base') => theme.shadows[level],

  // Border helper
  border: (theme: Theme, color?: string, width = 1) => ({
    borderWidth: width,
    borderColor: color || getBaseColor(theme.colors.border),
  }),

  // Rounded corners helper
  rounded: (theme: Theme, size: keyof Theme['borderRadius'] = 'base') => ({
    borderRadius: theme.borderRadius[size],
  }),

  // Padding helper
  padding: (theme: Theme, size: keyof Theme['spacing']) => ({
    padding: theme.spacing[size],
  }),

  // Margin helper
  margin: (theme: Theme, size: keyof Theme['spacing']) => ({
    margin: theme.spacing[size],
  }),
};

// Color manipulation utilities
export const adjustColorBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (value: number) => {
    const adjusted = Math.round(value * (1 + percent / 100));
    return Math.min(255, Math.max(0, adjusted));
  };

  const r = adjust(rgb.r).toString(16).padStart(2, '0');
  const g = adjust(rgb.g).toString(16).padStart(2, '0');
  const b = adjust(rgb.b).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
};

export const addAlpha = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

// Theme transition utilities
export const createThemeTransition = (property: string = 'all', duration: number = 300): any => ({
  transitionProperty: property,
  transitionDuration: `${duration}ms`,
  transitionTimingFunction: 'ease-in-out',
});

// Helper to check if we're in dark mode
export const isDarkTheme = (theme: Theme): boolean => {
  return theme.mode === 'dark' || (theme.mode === 'dynamic' && getLuminance(theme.colors.background[500]) < 0.5);
};

// Helper to get inverted theme colors (useful for special UI elements)
export const getInvertedColors = (theme: Theme): Partial<ThemeColors> => {
  const isDark = isDarkTheme(theme);
  return {
    background: isDark ? theme.colors.text : theme.colors.background,
    text: isDark ? theme.colors.background : theme.colors.text,
  };
};

// Export all utilities
export default {
  getColorShade,
  getBaseColor,
  resolveThemedStyle,
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsContrastStandard,
  getContrastTextColor,
  createThemedStyles,
  themedStyles,
  adjustColorBrightness,
  addAlpha,
  createThemeTransition,
  isDarkTheme,
  getInvertedColors,
};
