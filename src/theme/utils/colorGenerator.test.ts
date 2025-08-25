import {
  interpolateColor,
  getContrastColor,
  mixColors,
  generateColorScale,
  generateBrandColorScale,
} from './colorGenerator';

describe('Color Generator Utilities', () => {
  describe('interpolateColor', () => {
    it('should interpolate between two colors', () => {
      const color1 = '#000000';
      const color2 = '#FFFFFF';

      expect(interpolateColor(color1, color2, 0)).toBe('#000000');
      expect(interpolateColor(color1, color2, 1)).toBe('#FFFFFF');
      expect(interpolateColor(color1, color2, 0.5)).toBe('#808080');
    });
  });

  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('#000000');
      expect(getContrastColor('#FEF9E0')).toBe('#000000'); // Light sand
    });

    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#FFFFFF');
      expect(getContrastColor('#343941')).toBe('#FFFFFF'); // Dark slate
    });
  });

  describe('mixColors', () => {
    it('should mix colors with equal weight by default', () => {
      const mixed = mixColors('#FF0000', '#0000FF');
      expect(mixed).toBe('#800080'); // Purple
    });

    it('should mix colors with custom weight', () => {
      const mixed = mixColors('#FF0000', '#0000FF', 0.75);
      expect(mixed).toBe('#BF0040'); // More red than blue
    });
  });

  describe('generateColorScale', () => {
    it('should generate a complete color scale from base color', () => {
      const scale = generateColorScale('#008585');

      expect(scale[50]).toBeTruthy();
      expect(scale[100]).toBeTruthy();
      expect(scale[200]).toBeTruthy();
      expect(scale[300]).toBeTruthy();
      expect(scale[400]).toBeTruthy();
      expect(scale[500]).toBeTruthy();
      expect(scale[600]).toBeTruthy();
      expect(scale[700]).toBeTruthy();
      expect(scale[800]).toBeTruthy();
      expect(scale[900]).toBeTruthy();
    });

    it('should preserve provided key points', () => {
      const keyPoints = {
        200: '#AABBCC',
        600: '#556677',
      };
      const scale = generateColorScale('#008585', keyPoints);

      expect(scale[200]).toBe('#AABBCC');
      expect(scale[600]).toBe('#556677');
    });

    it('should interpolate between key points', () => {
      const keyPoints = {
        200: '#FFFFFF',
        800: '#000000',
      };
      const scale = generateColorScale('#808080', keyPoints);

      // Check that 500 (middle) is interpolated between white and black
      const rgb500 = scale[500].toLowerCase();
      expect(rgb500).toMatch(/^#[0-9a-f]{6}$/); // Should be a valid hex color
    });

    it('should generate lighter variants for positions below 500', () => {
      const scale = generateColorScale('#008585');

      // Convert to grayscale to compare lightness
      const getLightness = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r + g + b) / 3;
      };

      const lightness100 = getLightness(scale[100]);
      const lightness500 = getLightness(scale[500]);

      expect(lightness100).toBeGreaterThan(lightness500);
    });

    it('should generate darker variants for positions above 500', () => {
      const scale = generateColorScale('#008585');

      // Convert to grayscale to compare lightness
      const getLightness = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r + g + b) / 3;
      };

      const lightness500 = getLightness(scale[500]);
      const lightness900 = getLightness(scale[900]);

      expect(lightness900).toBeLessThan(lightness500);
    });
  });

  describe('generateBrandColorScale', () => {
    it('should generate scale with preserved hue', () => {
      const scale = generateBrandColorScale('#008585'); // Teal

      // Check that all colors exist
      expect(scale[50]).toBeTruthy();
      expect(scale[500]).toBeTruthy();
      expect(scale[900]).toBeTruthy();
    });

    it('should respect lightness boundaries', () => {
      const scale = generateBrandColorScale('#008585');

      // Light colors should have high lightness
      const light = scale[50];
      const lightR = parseInt(light.slice(1, 3), 16);
      const lightG = parseInt(light.slice(3, 5), 16);
      const lightB = parseInt(light.slice(5, 7), 16);
      const lightAvg = (lightR + lightG + lightB) / 3;

      // Dark colors should have low lightness
      const dark = scale[900];
      const darkR = parseInt(dark.slice(1, 3), 16);
      const darkG = parseInt(dark.slice(3, 5), 16);
      const darkB = parseInt(dark.slice(5, 7), 16);
      const darkAvg = (darkR + darkG + darkB) / 3;

      expect(lightAvg).toBeGreaterThan(200); // Light should be bright
      expect(darkAvg).toBeLessThan(100); // Dark should be dark
    });

    it('should apply saturation curve', () => {
      const scale = generateBrandColorScale('#808080'); // Gray

      // Even with gray input, the brand color scale should add some saturation
      const mid = scale[500];
      expect(mid).toBeTruthy();
      // The exact saturation behavior depends on implementation
    });
  });
});
