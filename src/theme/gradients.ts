/**
 * Gradient System for Brand Theme
 * Utilities and presets for creating gradients in the application
 */

import { BRAND_COLORS, BrandGradient, GradientPresets } from './colors/brandColors';

/**
 * Brand gradient constant
 * Primary gradient using sage to teal transition
 */
export const brandGradient = 'linear-gradient(90deg, #74A892 0%, #008585 100%)';

/**
 * Create a CSS gradient string
 * @param colors - Array of color values
 * @param angle - Gradient angle in degrees (default: 90)
 * @returns CSS gradient string
 */
export function createGradient(colors: string[], angle: number = 90): string {
  if (colors.length < 2) {
    throw new Error('Gradient requires at least 2 colors');
  }

  const stops = colors
    .map((color, index) => {
      const position = (index / (colors.length - 1)) * 100;
      return `${color} ${position}%`;
    })
    .join(', ');

  return `linear-gradient(${angle}deg, ${stops})`;
}

/**
 * Create a React Native compatible gradient configuration
 * @param colors - Array of color values
 * @param start - Start point {x, y} (0-1 range)
 * @param end - End point {x, y} (0-1 range)
 * @param locations - Optional array of color stop locations (0-1 range)
 * @returns React Native gradient configuration
 */
export function createRNGradient(
  colors: string[],
  start: { x: number; y: number } = { x: 0, y: 0.5 },
  end: { x: number; y: number } = { x: 1, y: 0.5 },
  locations?: number[]
): BrandGradient {
  if (colors.length < 2) {
    throw new Error('Gradient requires at least 2 colors');
  }

  const gradient: BrandGradient = {
    colors,
    start,
    end,
  };

  if (locations && locations.length === colors.length) {
    gradient.locations = locations;
  }

  return gradient;
}

/**
 * Convert angle to React Native gradient points
 * @param angle - Angle in degrees
 * @returns Start and end points for React Native gradient
 */
export function angleToPoints(angle: number): { start: { x: number; y: number }; end: { x: number; y: number } } {
  const angleRad = (angle * Math.PI) / 180;

  // Calculate gradient direction
  const dx = Math.cos(angleRad);
  const dy = Math.sin(angleRad);

  // Normalize to 0-1 range
  const start = {
    x: 0.5 - dx * 0.5,
    y: 0.5 + dy * 0.5,
  };

  const end = {
    x: 0.5 + dx * 0.5,
    y: 0.5 - dy * 0.5,
  };

  return { start, end };
}

/**
 * Gradient presets for different use cases
 */
export const gradientPresets: GradientPresets = {
  // Primary brand gradient - sage to teal
  brand: {
    colors: [BRAND_COLORS.SAGE_500, BRAND_COLORS.TEAL_600],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
    angle: 90,
  },

  // Button gradient - subtle teal variation
  button: {
    colors: ['#009999', BRAND_COLORS.TEAL_600, '#006666'],
    locations: [0, 0.5, 1],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    angle: 180,
  },

  // Header gradient - sand to light teal
  header: {
    colors: [BRAND_COLORS.SAND_50, '#E6F7F7', '#CCE6E6'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 135,
  },

  // Accent gradient - rust variations
  accent: {
    colors: ['#D65A2F', BRAND_COLORS.RUST_600, '#B84825'],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
    angle: 90,
  },

  // Overlay gradient - dark fade
  overlay: {
    colors: ['rgba(52, 57, 65, 0)', 'rgba(52, 57, 65, 0.7)', 'rgba(52, 57, 65, 0.9)'],
    locations: [0, 0.7, 1],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    angle: 180,
  },
};

/**
 * Create a gradient for React Native LinearGradient component
 * @param preset - Preset name from gradientPresets
 * @returns Array format for LinearGradient component
 */
export function getGradientForRN(preset: keyof GradientPresets): BrandGradient {
  const gradientConfig = gradientPresets[preset];
  return {
    colors: gradientConfig.colors,
    locations: gradientConfig.locations,
    start: gradientConfig.start,
    end: gradientConfig.end,
  };
}

/**
 * Create a CSS gradient from preset
 * @param preset - Preset name from gradientPresets
 * @returns CSS gradient string
 */
export function getGradientForCSS(preset: keyof GradientPresets): string {
  const gradientConfig = gradientPresets[preset];
  return createGradient(gradientConfig.colors, gradientConfig.angle || 90);
}

/**
 * Blend two colors to create a gradient midpoint
 * @param color1 - First color
 * @param color2 - Second color
 * @param ratio - Blend ratio (0-1, where 0 is color1 and 1 is color2)
 * @returns Blended color
 */
export function blendColors(color1: string, color2: string, ratio: number = 0.5): string {
  // Convert hex to RGB
  const hex2rgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgb1 = hex2rgb(color1);
  const rgb2 = hex2rgb(color2);

  // Blend colors
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  // Convert back to hex
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Create a smooth gradient with multiple stops
 * @param baseColor - Base color for gradient
 * @param steps - Number of gradient steps
 * @param lightness - Lightness variation (-100 to 100)
 * @returns Array of colors for gradient
 */
export function createSmoothGradient(baseColor: string, steps: number = 3, lightness: number = 20): string[] {
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const factor = (i / (steps - 1)) * 2 - 1; // -1 to 1
    const adjustedLightness = factor * lightness;

    // Simple lightness adjustment (this is a simplified version)
    // In production, you'd want to use proper HSL conversion
    const hex = baseColor.replace('#', '');
    const rgb = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };

    const adjust = 1 + adjustedLightness / 100;
    const adjusted = {
      r: Math.min(255, Math.max(0, Math.round(rgb.r * adjust))),
      g: Math.min(255, Math.max(0, Math.round(rgb.g * adjust))),
      b: Math.min(255, Math.max(0, Math.round(rgb.b * adjust))),
    };

    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    colors.push(`#${toHex(adjusted.r)}${toHex(adjusted.g)}${toHex(adjusted.b)}`.toUpperCase());
  }

  return colors;
}

// Export types
export type { BrandGradient, GradientPresets };
