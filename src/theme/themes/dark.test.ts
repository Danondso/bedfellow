/**
 * Dark Theme Integration Tests
 * Tests for brand theme implementation and transitions
 */

import darkTheme from './dark';
import lightTheme from './light';
import { ThemeMode } from '../types';
import { brandColorScales } from '../colors/brandColors';
// import { darkSemanticBrandColors } from '../colors/semanticColors';

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
      // Dark theme uses lighter variants of brand colors
      expect(darkTheme.gradients?.brand).toContain(brandColorScales.sage[400]);
      expect(darkTheme.gradients?.brand).toContain(brandColorScales.teal[400]);
    });
  });

  describe('Brand Color Integration', () => {
    test('should use warm dark colors for backgrounds', () => {
      // Dark theme uses warm dark browns instead of sand
      const backgrounds = darkTheme.colors.background;
      expect(backgrounds[50]).toBe('#1A1611'); // Darkest warm brown
      expect(backgrounds[100]).toBe('#221E17');
      expect(backgrounds[200]).toBe('#2A251D');
      expect(backgrounds[500]).toBe('#423A2F'); // Base dark background
    });

    test('should use lighter teal variants for primary palette', () => {
      const { primary } = darkTheme.colors;
      // Dark theme inverts the scale for better contrast
      expect(primary[300]).toBe(brandColorScales.teal[600]); // Original teal at 300
      expect(primary[500]).toBe(brandColorScales.teal[400]); // Lighter base for dark mode
    });

    test('should use lighter sage variants for secondary palette', () => {
      const { secondary } = darkTheme.colors;
      // Dark theme uses lighter sage for visibility
      expect(secondary[400]).toBe(brandColorScales.sage[500]); // Original sage at 400
      expect(secondary[500]).toBe(brandColorScales.sage[400]); // Lighter base for dark mode
    });

    test('should use lighter rust variants for accent palette', () => {
      const { accent } = darkTheme.colors;
      // Dark theme uses lighter rust for visibility
      expect(accent[300]).toBe(brandColorScales.rust[600]); // Original rust at 300
      expect(accent[500]).toBe(brandColorScales.rust[400]); // Lighter base for dark mode
    });

    test('should use warm light colors for text', () => {
      const { text } = darkTheme.colors;
      // Dark theme uses sand tones for warm light text
      expect(text[500]).toBe(brandColorScales.sand[200]); // Base text
      expect(text[700]).toBe(brandColorScales.sand[50]); // Primary text
    });

    test('should have semantic color mappings with lighter variants', () => {
      // Dark theme uses lighter variants for visibility
      expect(darkTheme.colors.success[500]).toBe(brandColorScales.sage[400]);
      expect(darkTheme.colors.warning[500]).toBe(brandColorScales.amber[400]);
      expect(darkTheme.colors.error[500]).toBe(brandColorScales.rust[400]);
      expect(darkTheme.colors.info[500]).toBe(brandColorScales.info[400]);
    });
  });

  describe('Shadow Configuration', () => {
    test('should use darker shadow for dark theme', () => {
      // Dark theme uses darker shadows
      expect(darkTheme.colors.shadow).toBe('rgba(0, 0, 0, 0.4)');
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
    test('should use warm sand-based borders with opacity', () => {
      const { border } = darkTheme.colors;
      // Dark theme uses sand color with opacity for warm borders
      expect(border[500]).toBe('rgba(254, 249, 224, 0.30)');
    });

    test('should have lighter divider colors than borders', () => {
      const { divider, border } = darkTheme.colors;
      // Dividers should use lower opacity than borders
      expect(divider[300]).toBe('rgba(254, 249, 224, 0.10)'); // 10% opacity
      expect(border[300]).toBe('rgba(254, 249, 224, 0.20)'); // 20% opacity
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
      Object.values(darkTheme.colors);
      Object.values(darkTheme.spacing);
      Object.values(darkTheme.typography);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Theme access should be under 10ms
      expect(duration).toBeLessThan(10);
    });
  });
});
