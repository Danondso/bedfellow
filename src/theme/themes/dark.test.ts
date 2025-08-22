/**
 * Dark Theme Integration Tests
 * Tests for brand theme implementation and transitions
 */

import darkTheme from './dark';
import lightTheme from './light';
import { ThemeMode } from '../types';
import { BRAND_COLORS, brandColorScales } from '../colors/brandColors';
import { darkSemanticBrandColors } from '../colors/semanticColors';

describe('Dark Theme with Brand Palette', () => {
  describe('Theme Structure', () => {
    test('should have correct theme mode', () => {
      expect(darkTheme.mode).toBe(ThemeMode.DARK);
    });

    test('should include all required theme properties', () => {
      expect(darkTheme).toHaveProperty('mode');
      expect(darkTheme).toHaveProperty('colors');
      expect(darkTheme).toHaveProperty('spacing');
      expect(darkTheme).toHaveProperty('typography');
      expect(darkTheme).toHaveProperty('borderRadius');
      expect(darkTheme).toHaveProperty('shadows');
      expect(darkTheme).toHaveProperty('gradients');
    });

    test('should have brand gradients defined', () => {
      expect(darkTheme.gradients).toBeDefined();
      expect(darkTheme.gradients?.brand).toBeDefined();
      expect(darkTheme.gradients?.brand).toContain('linear-gradient');
      expect(darkTheme.gradients?.brand).toContain('#74A892'); // Sage
      expect(darkTheme.gradients?.brand).toContain('#008585'); // Teal
    });
  });

  describe('Brand Color Integration', () => {
    test('should use brand colors for backgrounds', () => {
      // Check that backgrounds use sand scale
      const backgrounds = darkTheme.colors.background;
      expect(backgrounds[50]).toBe(brandColorScales.sand[300]);
      expect(backgrounds[100]).toBe(brandColorScales.sand[200]);
      expect(backgrounds[200]).toBe(brandColorScales.sand[100]);
      expect(backgrounds[300]).toBe(brandColorScales.sand[50]);
    });

    test('should use brand colors for primary palette', () => {
      const { primary } = darkTheme.colors;
      expect(primary[600]).toBe(BRAND_COLORS.TEAL_600);
      expect(primary).toStrictEqual(brandColorScales.teal);
    });

    test('should use brand colors for secondary palette', () => {
      const { secondary } = darkTheme.colors;
      expect(secondary[500]).toBe(BRAND_COLORS.SAGE_500);
      expect(secondary).toStrictEqual(brandColorScales.sage);
    });

    test('should use brand colors for accent palette', () => {
      const { accent } = darkTheme.colors;
      expect(accent[600]).toBe(BRAND_COLORS.RUST_600);
      expect(accent).toStrictEqual(brandColorScales.rust);
    });

    test('should use slate scale for text colors', () => {
      const { text } = darkTheme.colors;
      expect(text[600]).toBe(brandColorScales.slate[900]); // Primary text
      expect(text[300]).toBe(brandColorScales.slate[600]); // Muted text
    });

    test('should have semantic color mappings', () => {
      expect(darkTheme.colors.success).toStrictEqual(brandColorScales.sage);
      expect(darkTheme.colors.warning).toStrictEqual(brandColorScales.sand);
      expect(darkTheme.colors.error).toStrictEqual(brandColorScales.rust);
      expect(darkTheme.colors.info).toStrictEqual(brandColorScales.info);
    });
  });

  describe('Shadow Configuration', () => {
    test('should use brand shadow color', () => {
      // Check shadow color in special colors
      expect(darkTheme.colors.shadow).toBe('rgba(52, 57, 65, 0.14)');
    });

    test('should have shadow scale defined', () => {
      expect(darkTheme.shadows).toBeDefined();
      expect(darkTheme.shadows.sm).toBeDefined();
      expect(darkTheme.shadows.base).toBeDefined();
      expect(darkTheme.shadows.md).toBeDefined();
      expect(darkTheme.shadows.lg).toBeDefined();
      expect(darkTheme.shadows.xl).toBeDefined();
    });
  });

  describe('Border and Divider Colors', () => {
    test('should use slate scale with opacity for borders', () => {
      const { border } = darkTheme.colors;
      // Check that borders use slate colors with opacity
      expect(border[500]).toContain(brandColorScales.slate[600].replace('#', ''));
    });

    test('should have lighter divider colors than borders', () => {
      const { divider } = darkTheme.colors;
      // Dividers should use lighter opacity than borders
      expect(divider[300]).toContain('33'); // 20% opacity
    });
  });

  describe('Theme Switching Compatibility', () => {
    test('should have matching structure with light theme', () => {
      const darkKeys = Object.keys(darkTheme).sort();
      const lightKeys = Object.keys(lightTheme).sort();
      expect(darkKeys).toEqual(lightKeys);
    });

    test('should have same color categories as light theme', () => {
      const darkColorKeys = Object.keys(darkTheme.colors).sort();
      const lightColorKeys = Object.keys(lightTheme.colors).sort();
      expect(darkColorKeys).toEqual(lightColorKeys);
    });

    test('should have same spacing scale as light theme', () => {
      expect(darkTheme.spacing).toEqual(lightTheme.spacing);
    });

    test('should have same typography scale as light theme', () => {
      expect(darkTheme.typography).toEqual(lightTheme.typography);
    });

    test('should have same border radius scale as light theme', () => {
      expect(darkTheme.borderRadius).toEqual(lightTheme.borderRadius);
    });
  });

  describe('Color Scale Completeness', () => {
    test('all color scales should have values from 50 to 900', () => {
      const colorCategories = [
        'background',
        'surface',
        'text',
        'primary',
        'secondary',
        'accent',
        'error',
        'warning',
        'success',
        'info',
        'border',
        'divider',
      ];

      colorCategories.forEach((category) => {
        const scale = darkTheme.colors[category as keyof typeof darkTheme.colors];
        if (typeof scale === 'object') {
          expect(scale).toHaveProperty('50');
          expect(scale).toHaveProperty('100');
          expect(scale).toHaveProperty('200');
          expect(scale).toHaveProperty('300');
          expect(scale).toHaveProperty('400');
          expect(scale).toHaveProperty('500');
          expect(scale).toHaveProperty('600');
          expect(scale).toHaveProperty('700');
          expect(scale).toHaveProperty('800');
          expect(scale).toHaveProperty('900');
        }
      });
    });
  });

  describe('Special Colors', () => {
    test('should have shadow color defined', () => {
      expect(darkTheme.colors.shadow).toBeDefined();
      expect(darkTheme.colors.shadow).toContain('rgba');
    });

    test('should have overlay color defined', () => {
      expect(darkTheme.colors.overlay).toBeDefined();
      expect(darkTheme.colors.overlay).toContain('rgba');
    });

    test('should have stroke utilities defined', () => {
      expect(darkTheme.colors.softStroke).toBeDefined();
      expect(darkTheme.colors.mediumStroke).toBeDefined();
      expect(darkTheme.colors.strongStroke).toBeDefined();
    });
  });

  describe('Gradient System', () => {
    test('should have all gradient presets', () => {
      expect(darkTheme.gradients?.brand).toBeDefined();
      expect(darkTheme.gradients?.button).toBeDefined();
      expect(darkTheme.gradients?.header).toBeDefined();
      expect(darkTheme.gradients?.accent).toBeDefined();
      expect(darkTheme.gradients?.overlay).toBeDefined();
    });

    test('gradients should be valid CSS', () => {
      Object.values(darkTheme.gradients || {}).forEach((gradient) => {
        if (gradient) {
          expect(gradient).toContain('linear-gradient');
          expect(gradient).toContain('deg');
        }
      });
    });
  });

  describe('Performance Considerations', () => {
    test('theme object should be serializable', () => {
      // Theme should be JSON serializable for storage
      const serialized = JSON.stringify(darkTheme);
      const deserialized = JSON.parse(serialized);
      expect(deserialized.mode).toBe(darkTheme.mode);
    });

    test('theme transition should complete quickly', () => {
      // Measure theme switching time
      const startTime = performance.now();

      // Simulate theme switch by accessing all properties
      const allColors = Object.values(darkTheme.colors);
      const allSpacing = Object.values(darkTheme.spacing);
      const allTypography = Object.values(darkTheme.typography);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Theme access should be under 10ms
      expect(duration).toBeLessThan(10);
    });
  });
});
