import { Platform } from 'react-native';

/**
 * Font family definitions for the warm, nostalgic aesthetic
 * Inspired by classic Apple typography
 */

// Serif fonts for headers - reminiscent of early Macintosh systems
export const SERIF_FONTS = Platform.select({
  ios: {
    regular: 'Georgia',
    bold: 'Georgia-Bold',
    italic: 'Georgia-Italic',
    boldItalic: 'Georgia-BoldItalic',
  },
  android: {
    regular: 'serif',
    bold: 'serif',
    italic: 'serif',
    boldItalic: 'serif',
  },
  default: {
    regular: 'Georgia',
    bold: 'Georgia',
    italic: 'Georgia',
    boldItalic: 'Georgia',
  },
});

// Sans-serif fonts for body text
export const SANS_SERIF_FONTS = Platform.select({
  ios: {
    regular: 'System',
    bold: 'System',
    italic: 'System',
    boldItalic: 'System',
  },
  android: {
    regular: 'Roboto',
    bold: 'Roboto-Bold',
    italic: 'Roboto-Italic',
    boldItalic: 'Roboto-BoldItalic',
  },
  default: {
    regular: 'System',
    bold: 'System',
    italic: 'System',
    boldItalic: 'System',
  },
});

// Font families by usage
export const fontFamilies = {
  // Headers use serif fonts for that classic, warm feeling
  heading: {
    regular: SERIF_FONTS?.regular || 'Georgia',
    bold: SERIF_FONTS?.bold || 'Georgia-Bold',
    italic: SERIF_FONTS?.italic || 'Georgia-Italic',
    boldItalic: SERIF_FONTS?.boldItalic || 'Georgia-BoldItalic',
  },
  // Body text uses clean sans-serif
  body: {
    regular: SANS_SERIF_FONTS?.regular || 'System',
    bold: SANS_SERIF_FONTS?.bold || 'System',
    italic: SANS_SERIF_FONTS?.italic || 'System',
    boldItalic: SANS_SERIF_FONTS?.boldItalic || 'System',
  },
  // Monospace for code/technical content
  mono:
    Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'Courier',
    }) || 'Courier',
};

// Type for all font weight keys (exported for use in components)
export type FontWeightKey = keyof typeof fontWeights;

// Helper function to get the appropriate font family
export const getFontFamily = (
  variant: 'heading' | 'body' | 'mono' = 'body',
  weight: 'regular' | 'bold' = 'regular', // Still use simple weights for font family selection
  italic: boolean = false
): string => {
  if (variant === 'mono') {
    return fontFamilies.mono;
  }

  const fontSet = fontFamilies[variant];

  if (italic && weight === 'bold') {
    return fontSet.boldItalic;
  }
  if (italic) {
    return fontSet.italic;
  }
  if (weight === 'bold') {
    return fontSet.bold;
  }

  return fontSet.regular;
};

// Font weight mappings
export const fontWeights = {
  thin: '100' as const,
  extraLight: '200' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const,
};
