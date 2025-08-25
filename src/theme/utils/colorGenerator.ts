/**
 * Color Generator Utilities
 * Functions for generating color scales and interpolating color values
 */

import { ColorScale } from '../types';

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Convert hex color to RGBA string
 */
export function hexToRgba(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  // Format opacity to 1 decimal place for cleaner CSS
  const formattedOpacity = opacity.toFixed(1);
  return `rgba(${r}, ${g}, ${b}, ${formattedOpacity})`;
}

/**
 * Convert RGB values to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r, g, b;

  if (sNorm === 0) {
    r = g = b = lNorm; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;

    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Interpolate between two colors
 * @param color1 - Start color in hex format
 * @param color2 - End color in hex format
 * @param factor - Interpolation factor (0-1)
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Lighten a color by a percentage
 * @param hex - Color in hex format
 * @param percent - Percentage to lighten (0-100)
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Increase lightness
  hsl.l = Math.min(100, hsl.l + percent);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Darken a color by a percentage
 * @param hex - Color in hex format
 * @param percent - Percentage to darken (0-100)
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Decrease lightness
  hsl.l = Math.max(0, hsl.l - percent);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Adjust saturation of a color
 * @param hex - Color in hex format
 * @param percent - Percentage to adjust (-100 to 100)
 */
export function adjustSaturation(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Adjust saturation
  hsl.s = Math.max(0, Math.min(100, hsl.s + percent));

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generate a color that contrasts well with the given color
 * @param hex - Base color in hex format
 */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Mix two colors together
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @param weight - Weight of the first color (0-1)
 */
export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(rgb1.r * weight + rgb2.r * (1 - weight));
  const g = Math.round(rgb1.g * weight + rgb2.g * (1 - weight));
  const b = Math.round(rgb1.b * weight + rgb2.b * (1 - weight));

  return rgbToHex(r, g, b);
}

/**
 * Generate a complete color scale from a base color and optional key points
 * @param baseColor - The primary color to build the scale from
 * @param keyPoints - Optional object mapping scale positions (50-900) to specific colors
 * @returns A complete ColorScale object with all values from 50 to 900
 *
 * @example
 * // Generate a scale with specific key points preserved
 * generateColorScale('#008585', { 600: '#008585', 500: '#009999' })
 *
 * @example
 * // Generate a scale from just a base color (assumes it's the 500 value)
 * generateColorScale('#74A892')
 */
export function generateColorScale(
  baseColor: string,
  keyPoints: Partial<Record<keyof ColorScale, string>> = {}
): ColorScale {
  const scalePositions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

  // If no keyPoints provided, assume baseColor is the 500 value
  const finalKeyPoints = Object.keys(keyPoints).length === 0 ? { 500: baseColor } : keyPoints;

  // Find the primary reference point (prefer 500, then 600, then any middle value)
  const referencePoint =
    finalKeyPoints[500] ||
    finalKeyPoints[600] ||
    finalKeyPoints[400] ||
    finalKeyPoints[300] ||
    finalKeyPoints[700] ||
    baseColor;

  // Convert reference to HSL for better interpolation
  const refRgb = hexToRgb(referencePoint);
  const refHsl = rgbToHsl(refRgb.r, refRgb.g, refRgb.b);

  // Generate the scale
  const scale: Partial<ColorScale> = {};

  scalePositions.forEach((position) => {
    // Use provided keyPoint if available
    if (finalKeyPoints[position]) {
      scale[position] = finalKeyPoints[position]!.toUpperCase();
      return;
    }

    // Otherwise, generate the color based on position
    let generatedColor: string;

    if (position < 500) {
      // Lighter variants (50-400)
      // Calculate how much lighter this should be
      const lightnessIncrease = ((500 - position) / 450) * 40; // Up to 40% lighter
      const saturationDecrease = ((500 - position) / 450) * 20; // Slightly less saturated

      // Apply HSL adjustments
      const newL = Math.min(95, refHsl.l + lightnessIncrease);
      const newS = Math.max(5, refHsl.s - saturationDecrease);
      const newRgb = hslToRgb(refHsl.h, newS, newL);
      generatedColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    } else if (position > 500) {
      // Darker variants (600-900)
      // Calculate how much darker this should be
      const darknessIncrease = ((position - 500) / 400) * 35; // Up to 35% darker
      const saturationIncrease = ((position - 500) / 400) * 10; // Slightly more saturated

      // Apply HSL adjustments
      const newL = Math.max(10, refHsl.l - darknessIncrease);
      const newS = Math.min(100, refHsl.s + saturationIncrease);
      const newRgb = hslToRgb(refHsl.h, newS, newL);
      generatedColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    } else {
      // Position 500 - use reference point
      generatedColor = referencePoint;
    }

    scale[position] = generatedColor.toUpperCase();
  });

  // Interpolate between keyPoints for smoother transitions
  const sortedKeyPoints = Object.keys(keyPoints)
    .map(Number)
    .sort((a, b) => a - b) as Array<keyof ColorScale>;

  if (sortedKeyPoints.length > 1) {
    for (let i = 0; i < sortedKeyPoints.length - 1; i++) {
      const startPos = sortedKeyPoints[i];
      const endPos = sortedKeyPoints[i + 1];
      const startColor = keyPoints[startPos]!;
      const endColor = keyPoints[endPos]!;

      // Interpolate between these two keyPoints
      scalePositions.forEach((pos) => {
        if (pos > startPos && pos < endPos && !keyPoints[pos]) {
          const factor = (pos - startPos) / (endPos - startPos);
          scale[pos] = interpolateColor(startColor, endColor, factor).toUpperCase();
        }
      });
    }
  }

  return scale as ColorScale;
}

/**
 * Generate a color scale with specific brand color characteristics
 * Useful for creating scales that maintain brand identity
 */
export function generateBrandColorScale(
  baseColor: string,
  options: {
    preserveHue?: boolean;
    minLightness?: number;
    maxLightness?: number;
    saturationCurve?: 'linear' | 'ease' | 'dramatic';
  } = {}
): ColorScale {
  const { preserveHue = true, minLightness = 10, maxLightness = 95, saturationCurve = 'ease' } = options;

  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const scale: Partial<ColorScale> = {};

  const positions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

  positions.forEach((position) => {
    // Calculate lightness based on position
    const normalizedPos = (position - 50) / 850; // 0 to 1
    const lightness = maxLightness - normalizedPos * (maxLightness - minLightness);

    // Calculate saturation based on curve type
    let saturation = hsl.s;
    if (saturationCurve === 'ease') {
      // Less saturated at extremes, more in middle
      const midDistance = Math.abs(position - 500) / 450;
      saturation = hsl.s * (1 - midDistance * 0.3);
    } else if (saturationCurve === 'dramatic') {
      // More variation in saturation
      const midDistance = Math.abs(position - 500) / 450;
      saturation = hsl.s * (1 - midDistance * 0.5);
    }

    // Generate the color
    const newRgb = hslToRgb(
      preserveHue ? hsl.h : hsl.h,
      Math.max(5, Math.min(100, saturation)),
      Math.max(minLightness, Math.min(maxLightness, lightness))
    );

    scale[position] = rgbToHex(newRgb.r, newRgb.g, newRgb.b).toUpperCase();
  });

  return scale as ColorScale;
}
