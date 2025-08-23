import ImageColors from 'react-native-image-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DynamicPalette } from '../../theme/types';
import { BRAND_COLORS } from '../../theme/colors/brandColors';

// Cache configuration
const PALETTE_CACHE_KEY = '@bedfellow_palette_cache';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_ENTRIES = 50;

// Color extraction quality levels
export enum ExtractionQuality {
  LOWEST = 'lowest',
  LOW = 'low',
  HIGH = 'high',
  HIGHEST = 'highest',
}

// Color harmony types
export enum ColorHarmony {
  MONOCHROMATIC = 'monochromatic',
  ANALOGOUS = 'analogous',
  COMPLEMENTARY = 'complementary',
  SPLIT_COMPLEMENTARY = 'split_complementary',
  TRIADIC = 'triadic',
  TETRADIC = 'tetradic',
}

// Extraction options
export interface ColorExtractionOptions {
  quality?: ExtractionQuality;
  cache?: boolean;
  fallback?: string;
  harmony?: ColorHarmony;
  enhanceContrast?: boolean;
  saturate?: number; // -100 to 100
  brighten?: number; // -100 to 100
  blendWithBrand?: boolean; // Blend with brand colors
  brandInfluence?: number; // 0-100% brand influence strength
}

// Palette cache entry
interface PaletteCacheEntry {
  url: string;
  palette: DynamicPalette;
  timestamp: number;
  options: ColorExtractionOptions;
}

// Color utilities
class ColorUtils {
  // Convert hex to RGB
  static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  // Convert RGB to hex
  static rgbToHex(r: number, g: number, b: number): string {
    const cr = Math.max(0, Math.min(255, r));
    const cg = Math.max(0, Math.min(255, g));
    const cb = Math.max(0, Math.min(255, b));
    return `#${((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1)}`;
  }

  // Convert hex to HSL
  static hexToHsl(hex: string): { h: number; s: number; l: number } {
    const { r, g, b } = this.hexToRgb(hex);
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

  // Convert HSL to hex
  static hslToHex(h: number, s: number, l: number): string {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;

    let r, g, b;

    if (sNorm === 0) {
      r = g = b = lNorm;
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

    return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
  }

  // Calculate relative luminance
  static getLuminance(hex: string): number {
    const { r, g, b } = this.hexToRgb(hex);
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const cNorm = c / 255;
      return cNorm <= 0.03928 ? cNorm / 12.92 : ((cNorm + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Calculate contrast ratio
  static getContrastRatio(hex1: string, hex2: string): number {
    const l1 = this.getLuminance(hex1);
    const l2 = this.getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Adjust color saturation
  static adjustSaturation(hex: string, amount: number): string {
    const hsl = this.hexToHsl(hex);
    hsl.s = Math.max(0, Math.min(100, hsl.s + amount));
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }

  // Adjust color lightness
  static adjustLightness(hex: string, amount: number): string {
    const hsl = this.hexToHsl(hex);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }

  // Mix two colors
  static mixColors(hex1: string, hex2: string, ratio: number = 0.5): string {
    const rgb1 = this.hexToRgb(hex1);
    const rgb2 = this.hexToRgb(hex2);

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

    return this.rgbToHex(r, g, b);
  }
}

// Color harmony generator
class ColorHarmonyGenerator {
  // Generate monochromatic palette
  static monochromatic(baseColor: string): DynamicPalette {
    const hsl = ColorUtils.hexToHsl(baseColor);

    return {
      background: ColorUtils.hslToHex(hsl.h, hsl.s * 0.2, 95),
      primary: baseColor,
      secondary: ColorUtils.hslToHex(hsl.h, hsl.s * 0.8, hsl.l * 0.7),
      detail: ColorUtils.hslToHex(hsl.h, hsl.s * 0.6, hsl.l * 0.5),
    };
  }

  // Generate analogous palette
  static analogous(baseColor: string): DynamicPalette {
    const hsl = ColorUtils.hexToHsl(baseColor);

    return {
      background: ColorUtils.hslToHex(hsl.h, hsl.s * 0.2, 95),
      primary: baseColor,
      secondary: ColorUtils.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      detail: ColorUtils.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    };
  }

  // Generate complementary palette
  static complementary(baseColor: string): DynamicPalette {
    const hsl = ColorUtils.hexToHsl(baseColor);

    return {
      background: ColorUtils.hslToHex(hsl.h, hsl.s * 0.1, 95),
      primary: baseColor,
      secondary: ColorUtils.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      detail: ColorUtils.hslToHex((hsl.h + 180) % 360, hsl.s * 0.7, hsl.l * 0.8),
    };
  }

  // Generate split complementary palette
  static splitComplementary(baseColor: string): DynamicPalette {
    const hsl = ColorUtils.hexToHsl(baseColor);

    return {
      background: ColorUtils.hslToHex(hsl.h, hsl.s * 0.1, 95),
      primary: baseColor,
      secondary: ColorUtils.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
      detail: ColorUtils.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l),
    };
  }

  // Generate triadic palette
  static triadic(baseColor: string): DynamicPalette {
    const hsl = ColorUtils.hexToHsl(baseColor);

    return {
      background: ColorUtils.hslToHex(hsl.h, hsl.s * 0.1, 95),
      primary: baseColor,
      secondary: ColorUtils.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      detail: ColorUtils.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    };
  }

  // Generate tetradic palette
  static tetradic(baseColor: string): DynamicPalette {
    const hsl = ColorUtils.hexToHsl(baseColor);

    return {
      background: ColorUtils.hslToHex(hsl.h, hsl.s * 0.1, 95),
      primary: baseColor,
      secondary: ColorUtils.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
      detail: ColorUtils.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    };
  }

  // Generate palette based on harmony type
  static generate(baseColor: string, harmony: ColorHarmony): DynamicPalette {
    switch (harmony) {
      case ColorHarmony.MONOCHROMATIC:
        return this.monochromatic(baseColor);
      case ColorHarmony.ANALOGOUS:
        return this.analogous(baseColor);
      case ColorHarmony.COMPLEMENTARY:
        return this.complementary(baseColor);
      case ColorHarmony.SPLIT_COMPLEMENTARY:
        return this.splitComplementary(baseColor);
      case ColorHarmony.TRIADIC:
        return this.triadic(baseColor);
      case ColorHarmony.TETRADIC:
        return this.tetradic(baseColor);
      default:
        return this.triadic(baseColor);
    }
  }
}

// Contrast enhancement utilities
class ContrastEnhancer {
  private static readonly MIN_CONTRAST_RATIO = 4.5; // WCAG AA

  private static readonly MIN_LARGE_TEXT_CONTRAST = 3.0; // WCAG AA large text

  // Enhance contrast for a color against a background
  static enhanceContrast(foreground: string, background: string, minRatio: number = this.MIN_CONTRAST_RATIO): string {
    let currentRatio = ColorUtils.getContrastRatio(foreground, background);

    if (currentRatio >= minRatio) {
      return foreground;
    }

    const backgroundLuminance = ColorUtils.getLuminance(background);
    const shouldLighten = backgroundLuminance < 0.5;

    let adjustedColor = foreground;
    let adjustment = 0;
    const maxAdjustment = 100;
    const step = 5;

    while (currentRatio < minRatio && adjustment < maxAdjustment) {
      adjustment += step;
      adjustedColor = shouldLighten
        ? ColorUtils.adjustLightness(foreground, adjustment)
        : ColorUtils.adjustLightness(foreground, -adjustment);

      currentRatio = ColorUtils.getContrastRatio(adjustedColor, background);
    }

    // If still not enough contrast, try adjusting saturation
    if (currentRatio < minRatio) {
      const desaturated = ColorUtils.adjustSaturation(adjustedColor, -30);
      if (ColorUtils.getContrastRatio(desaturated, background) > currentRatio) {
        adjustedColor = desaturated;
      }
    }

    return adjustedColor;
  }

  // Enhance entire palette for accessibility
  static enhancePalette(palette: DynamicPalette): DynamicPalette {
    return {
      background: palette.background,
      primary: this.enhanceContrast(palette.primary, palette.background),
      secondary: this.enhanceContrast(palette.secondary, palette.background),
      detail: this.enhanceContrast(palette.detail, palette.background, this.MIN_LARGE_TEXT_CONTRAST),
    };
  }

  // Check if palette meets accessibility standards
  static validatePalette(palette: DynamicPalette): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    const primaryRatio = ColorUtils.getContrastRatio(palette.primary, palette.background);
    const secondaryRatio = ColorUtils.getContrastRatio(palette.secondary, palette.background);
    const detailRatio = ColorUtils.getContrastRatio(palette.detail, palette.background);

    if (primaryRatio < this.MIN_CONTRAST_RATIO) {
      issues.push(`Primary color contrast too low: ${primaryRatio.toFixed(2)}`);
    }

    if (secondaryRatio < this.MIN_CONTRAST_RATIO) {
      issues.push(`Secondary color contrast too low: ${secondaryRatio.toFixed(2)}`);
    }

    if (detailRatio < this.MIN_LARGE_TEXT_CONTRAST) {
      issues.push(`Detail color contrast too low: ${detailRatio.toFixed(2)}`);
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

// Palette cache manager
class PaletteCache {
  private static cache: Map<string, PaletteCacheEntry> = new Map();

  private static isInitialized = false;

  // Initialize cache from storage
  static async initialize() {
    if (this.isInitialized) return;

    try {
      const stored = await AsyncStorage.getItem(PALETTE_CACHE_KEY);
      if (stored) {
        const entries: PaletteCacheEntry[] = JSON.parse(stored);
        const now = Date.now();

        // Filter out expired entries
        entries
          .filter((entry) => now - entry.timestamp < CACHE_EXPIRY_MS)
          .forEach((entry) => {
            this.cache.set(this.getCacheKey(entry.url, entry.options), entry);
          });
      }

      this.isInitialized = true;
    } catch (error) {
      // Error occurred: 'Failed to initialize palette cache:', error
    }
  }

  // Get cache key
  private static getCacheKey(url: string, options: ColorExtractionOptions): string {
    return `${url}_${JSON.stringify(options)}`;
  }

  // Get cached palette
  static async get(url: string, options: ColorExtractionOptions): Promise<DynamicPalette | null> {
    await this.initialize();

    const key = this.getCacheKey(url, options);
    const entry = this.cache.get(key);

    if (entry) {
      const now = Date.now();
      if (now - entry.timestamp < CACHE_EXPIRY_MS) {
        return entry.palette;
      } else {
        // Remove expired entry
        this.cache.delete(key);
      }
    }

    return null;
  }

  // Set cached palette
  static async set(url: string, palette: DynamicPalette, options: ColorExtractionOptions) {
    await this.initialize();

    const key = this.getCacheKey(url, options);
    const entry: PaletteCacheEntry = {
      url,
      palette,
      timestamp: Date.now(),
      options,
    };

    this.cache.set(key, entry);

    // Limit cache size
    if (this.cache.size > MAX_CACHE_ENTRIES) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      // Remove oldest entries
      const toRemove = entries.slice(0, entries.length - MAX_CACHE_ENTRIES);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }

    // Persist to storage
    await this.persist();
  }

  // Persist cache to storage
  private static async persist() {
    try {
      const entries = Array.from(this.cache.values());
      await AsyncStorage.setItem(PALETTE_CACHE_KEY, JSON.stringify(entries));
    } catch (error) {
      // Error occurred: 'Failed to persist palette cache:', error
    }
  }

  // Clear cache
  static async clear() {
    this.cache.clear();
    await AsyncStorage.removeItem(PALETTE_CACHE_KEY);
  }
}

// Brand color blending configuration
export interface BrandBlendOptions {
  preserveTeal?: boolean; // Preserve primary teal
  preserveSage?: boolean; // Preserve secondary sage
  blendStrength?: number; // 0-1, how much brand influence (default 0.3)
  ensureContrast?: boolean; // Ensure brand colors remain visible
}

// Brand color blending utilities
class BrandColorBlender {
  // Default brand palette
  private static readonly BRAND_PALETTE: DynamicPalette = {
    background: BRAND_COLORS.SAND_50,
    primary: BRAND_COLORS.TEAL_600,
    secondary: BRAND_COLORS.SAGE_500,
    detail: BRAND_COLORS.RUST_600,
  };

  // Blend extracted palette with brand colors
  static blendWithBrandColors(extractedPalette: DynamicPalette, options: BrandBlendOptions = {}): DynamicPalette {
    const { preserveTeal = true, preserveSage = true, blendStrength = 0.3, ensureContrast = true } = options;

    // Start with extracted palette
    let blendedPalette = { ...extractedPalette };

    // Blend background with sand tones
    blendedPalette.background = ColorUtils.mixColors(
      extractedPalette.background,
      BRAND_COLORS.SAND_50,
      1 - blendStrength * 0.5 // Subtle blend for background
    );

    // Handle primary color (teal)
    if (preserveTeal) {
      // Mix extracted primary with brand teal, keeping teal dominant
      blendedPalette.primary = ColorUtils.mixColors(
        extractedPalette.primary,
        BRAND_COLORS.TEAL_600,
        1 - blendStrength * 1.5 // Strong brand influence
      );
    } else {
      // Subtle teal influence
      blendedPalette.primary = ColorUtils.mixColors(
        extractedPalette.primary,
        BRAND_COLORS.TEAL_600,
        1 - blendStrength * 0.3
      );
    }

    // Handle secondary color (sage)
    if (preserveSage) {
      // Mix extracted secondary with brand sage, keeping sage visible
      blendedPalette.secondary = ColorUtils.mixColors(
        extractedPalette.secondary,
        BRAND_COLORS.SAGE_500,
        1 - blendStrength * 1.2 // Moderate brand influence
      );
    } else {
      // Subtle sage influence
      blendedPalette.secondary = ColorUtils.mixColors(
        extractedPalette.secondary,
        BRAND_COLORS.SAGE_500,
        1 - blendStrength * 0.3
      );
    }

    // Blend detail with rust accent
    blendedPalette.detail = ColorUtils.mixColors(
      extractedPalette.detail,
      BRAND_COLORS.RUST_600,
      1 - blendStrength * 0.4 // Subtle rust influence
    );

    // Ensure brand color visibility if requested
    if (ensureContrast) {
      blendedPalette = this.ensureBrandColorContrast(blendedPalette);
    }

    return blendedPalette;
  }

  // Ensure brand colors remain visible against background
  private static ensureBrandColorContrast(palette: DynamicPalette): DynamicPalette {
    const adjustedPalette = { ...palette };

    // Check teal visibility
    const tealContrast = ColorUtils.getContrastRatio(BRAND_COLORS.TEAL_600, palette.background);
    if (tealContrast < 3.0) {
      // Adjust primary to ensure teal is visible
      adjustedPalette.primary = ContrastEnhancer.enhanceContrast(adjustedPalette.primary, palette.background, 3.0);
    }

    // Check sage visibility
    const sageContrast = ColorUtils.getContrastRatio(BRAND_COLORS.SAGE_500, palette.background);
    if (sageContrast < 3.0) {
      // Adjust secondary to ensure sage is visible
      adjustedPalette.secondary = ContrastEnhancer.enhanceContrast(adjustedPalette.secondary, palette.background, 3.0);
    }

    return adjustedPalette;
  }

  // Create brand-aware fallback palette
  static createBrandFallback(): DynamicPalette {
    return {
      background: BRAND_COLORS.SAND_50,
      primary: BRAND_COLORS.TEAL_600,
      secondary: BRAND_COLORS.SAGE_500,
      detail: BRAND_COLORS.SLATE_600,
    };
  }

  // Get brand influence strength based on extracted colors
  static calculateBrandInfluence(extractedPalette: DynamicPalette): number {
    // Calculate how different the extracted colors are from brand colors
    const primaryDiff = this.getColorDifference(extractedPalette.primary, BRAND_COLORS.TEAL_600);
    const secondaryDiff = this.getColorDifference(extractedPalette.secondary, BRAND_COLORS.SAGE_500);

    // If extracted colors are very different, use stronger brand influence
    const avgDiff = (primaryDiff + secondaryDiff) / 2;

    // Map difference to influence (0-1)
    // High difference = high brand influence
    return Math.min(1, avgDiff / 180); // Max 180 degree hue difference
  }

  // Calculate color difference based on HSL
  private static getColorDifference(color1: string, color2: string): number {
    const hsl1 = ColorUtils.hexToHsl(color1);
    const hsl2 = ColorUtils.hexToHsl(color2);

    // Calculate hue difference (most important)
    const hueDiff = Math.abs(hsl1.h - hsl2.h);
    const minHueDiff = Math.min(hueDiff, 360 - hueDiff);

    // Calculate saturation and lightness differences
    const satDiff = Math.abs(hsl1.s - hsl2.s) * 0.5; // Less weight
    const lightDiff = Math.abs(hsl1.l - hsl2.l) * 0.3; // Least weight

    return minHueDiff + satDiff + lightDiff;
  }
}

// Main color extraction service
export class ColorExtractionService {
  // Extract colors from image
  static async extractColors(imageUrl: string, options: ColorExtractionOptions = {}): Promise<DynamicPalette | null> {
    try {
      // Check cache first
      if (options.cache !== false) {
        const cached = await PaletteCache.get(imageUrl, options);
        if (cached) {
          return cached;
        }
      }

      // Validate URL
      if (!imageUrl || !imageUrl.startsWith('http')) {
        console.warn('Invalid image URL for color extraction, using brand fallback:', imageUrl);
        return BrandColorBlender.createBrandFallback();
      }

      // Extract colors using react-native-image-colors
      const result = await ImageColors.getColors(imageUrl, {
        fallback: options.fallback || '#999999',
        cache: true,
        key: imageUrl,
        quality: options.quality || ExtractionQuality.LOW,
      });

      // Process extracted colors
      let palette: DynamicPalette;

      if (result.platform === 'android') {
        palette = {
          background: result.dominant || result.average || '#FFFFFF',
          primary: result.vibrant || result.muted || '#000000',
          secondary: result.darkVibrant || result.darkMuted || '#666666',
          detail: result.lightVibrant || result.lightMuted || '#999999',
        };
      } else if (result.platform === 'ios') {
        palette = {
          background: result.background || '#FFFFFF',
          primary: result.primary || '#000000',
          secondary: result.secondary || '#666666',
          detail: result.detail || '#999999',
        };
      } else {
        // Web platform - use similar to android
        palette = {
          background: result.dominant || '#FFFFFF',
          primary: result.vibrant || result.muted || '#000000',
          secondary: result.darkVibrant || result.darkMuted || '#666666',
          detail: result.lightVibrant || result.lightMuted || '#999999',
        };
      }

      // Apply color harmony if specified
      if (options.harmony) {
        const dominantColor = palette.primary;
        palette = ColorHarmonyGenerator.generate(dominantColor, options.harmony);
      }

      // Apply color adjustments
      if (options.saturate !== undefined) {
        palette = {
          background: palette.background,
          primary: ColorUtils.adjustSaturation(palette.primary, options.saturate),
          secondary: ColorUtils.adjustSaturation(palette.secondary, options.saturate),
          detail: ColorUtils.adjustSaturation(palette.detail, options.saturate),
        };
      }

      if (options.brighten !== undefined) {
        palette = {
          background: ColorUtils.adjustLightness(palette.background, options.brighten),
          primary: ColorUtils.adjustLightness(palette.primary, options.brighten),
          secondary: ColorUtils.adjustLightness(palette.secondary, options.brighten),
          detail: ColorUtils.adjustLightness(palette.detail, options.brighten),
        };
      }

      // Enhance contrast if needed
      if (options.enhanceContrast !== false) {
        palette = ContrastEnhancer.enhancePalette(palette);
      }

      // Blend with brand colors if requested
      if (options.blendWithBrand !== false) {
        const brandInfluence =
          options.brandInfluence !== undefined
            ? options.brandInfluence / 100 // Convert to 0-1 range
            : BrandColorBlender.calculateBrandInfluence(palette);

        palette = BrandColorBlender.blendWithBrandColors(palette, {
          blendStrength: brandInfluence,
          preserveTeal: true,
          preserveSage: true,
          ensureContrast: options.enhanceContrast !== false,
        });
      }

      // Validate palette
      const validation = ContrastEnhancer.validatePalette(palette);
      if (!validation.valid) {
      }

      // Cache the result
      if (options.cache !== false) {
        await PaletteCache.set(imageUrl, palette, options);
      }

      return palette;
    } catch (error) {
      // Error occurred: 'Failed to extract colors:', error
      return null;
    }
  }

  // Create palette from base color
  static createPalette(baseColor: string, harmony: ColorHarmony = ColorHarmony.TRIADIC): DynamicPalette {
    const palette = ColorHarmonyGenerator.generate(baseColor, harmony);
    return ContrastEnhancer.enhancePalette(palette);
  }

  // Clear palette cache
  static async clearCache() {
    await PaletteCache.clear();
  }

  // Validate accessibility
  static validateAccessibility(palette: DynamicPalette) {
    return ContrastEnhancer.validatePalette(palette);
  }

  // Mix palettes
  static blendPalettes(palette1: DynamicPalette, palette2: DynamicPalette, ratio: number = 0.5): DynamicPalette {
    return {
      background: ColorUtils.mixColors(palette1.background, palette2.background, ratio),
      primary: ColorUtils.mixColors(palette1.primary, palette2.primary, ratio),
      secondary: ColorUtils.mixColors(palette1.secondary, palette2.secondary, ratio),
      detail: ColorUtils.mixColors(palette1.detail, palette2.detail, ratio),
    };
  }
}

// Export utilities for direct use
export { ColorUtils, ColorHarmonyGenerator, ContrastEnhancer, BrandColorBlender };

export default ColorExtractionService;
