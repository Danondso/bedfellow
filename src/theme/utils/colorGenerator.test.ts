import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  interpolateColor,
  lighten,
  darken,
  adjustSaturation,
  getContrastColor,
  mixColors,
  generateColorScale,
  generateBrandColorScale,
} from './colorGenerator';
import { ColorScale } from '../types';

describe('Color Generator Utilities', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#008585')).toEqual({ r: 0, g: 133, b: 133 });
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
      expect(rgbToHex(0, 133, 133)).toBe('#008585');
    });

    it('should clamp values to 0-255 range', () => {
      expect(rgbToHex(300, -50, 128)).toBe('#FF0080');
    });
  });

  describe('rgbToHsl and hslToRgb', () => {
    it('should convert between RGB and HSL accurately', () => {
      const testColors = [
        { rgb: { r: 255, g: 0, b: 0 }, hsl: { h: 0, s: 100, l: 50 } },
        { rgb: { r: 0, g: 255, b: 0 }, hsl: { h: 120, s: 100, l: 50 } },
        { rgb: { r: 0, g: 0, b: 255 }, hsl: { h: 240, s: 100, l: 50 } },
      ];

      testColors.forEach(({ rgb, hsl }) => {
        const convertedHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        expect(convertedHsl.h).toBeCloseTo(hsl.h, 0);
        expect(convertedHsl.s).toBeCloseTo(hsl.s, 0);
        expect(convertedHsl.l).toBeCloseTo(hsl.l, 0);

        const convertedRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        expect(convertedRgb.r).toBeCloseTo(rgb.r, 0);
        expect(convertedRgb.g).toBeCloseTo(rgb.g, 0);
        expect(convertedRgb.b).toBeCloseTo(rgb.b, 0);
      });
    });
  });

  describe('interpolateColor', () => {
    it('should interpolate between two colors', () => {
      const color1 = '#000000';
      const color2 = '#FFFFFF';

      expect(interpolateColor(color1, color2, 0)).toBe('#000000');
      expect(interpolateColor(color1, color2, 0.5)).toBe('#808080');
      expect(interpolateColor(color1, color2, 1)).toBe('#FFFFFF');
    });

    it('should interpolate brand colors correctly', () => {
      const teal = '#008585';
      const sage = '#74A892';

      const midpoint = interpolateColor(teal, sage, 0.5);
      const rgb = hexToRgb(midpoint);

      expect(rgb.r).toBeGreaterThan(0);
      expect(rgb.r).toBeLessThan(116);
      expect(rgb.g).toBeGreaterThan(133);
      expect(rgb.g).toBeLessThan(168);
    });
  });

  describe('lighten and darken', () => {
    it('should lighten colors correctly', () => {
      const original = '#008585';
      const lighter = lighten(original, 20);
      const lighterRgb = hexToRgb(lighter);
      const originalRgb = hexToRgb(original);

      const lighterHsl = rgbToHsl(lighterRgb.r, lighterRgb.g, lighterRgb.b);
      const originalHsl = rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);

      expect(lighterHsl.l).toBeGreaterThan(originalHsl.l);
    });

    it('should darken colors correctly', () => {
      const original = '#74A892';
      const darker = darken(original, 20);
      const darkerRgb = hexToRgb(darker);
      const originalRgb = hexToRgb(original);

      const darkerHsl = rgbToHsl(darkerRgb.r, darkerRgb.g, darkerRgb.b);
      const originalHsl = rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);

      expect(darkerHsl.l).toBeLessThan(originalHsl.l);
    });
  });

  describe('adjustSaturation', () => {
    it('should adjust saturation correctly', () => {
      const original = '#74A892';
      const moreSaturated = adjustSaturation(original, 20);
      const lessSaturated = adjustSaturation(original, -20);

      const originalRgb = hexToRgb(original);
      const moreRgb = hexToRgb(moreSaturated);
      const lessRgb = hexToRgb(lessSaturated);

      const originalHsl = rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);
      const moreHsl = rgbToHsl(moreRgb.r, moreRgb.g, moreRgb.b);
      const lessHsl = rgbToHsl(lessRgb.r, lessRgb.g, lessRgb.b);

      expect(moreHsl.s).toBeGreaterThan(originalHsl.s);
      expect(lessHsl.s).toBeLessThan(originalHsl.s);
    });
  });

  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('#000000');
      expect(getContrastColor('#FEF9E0')).toBe('#000000');
      expect(getContrastColor('#FBF2C4')).toBe('#000000');
    });

    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#FFFFFF');
      expect(getContrastColor('#343941')).toBe('#FFFFFF');
      expect(getContrastColor('#008585')).toBe('#FFFFFF');
    });
  });

  describe('mixColors', () => {
    it('should mix colors with equal weight by default', () => {
      const result = mixColors('#FF0000', '#0000FF');
      expect(result).toBe('#800080');
    });

    it('should mix colors with custom weight', () => {
      const result = mixColors('#FF0000', '#0000FF', 0.75);
      const rgb = hexToRgb(result);
      expect(rgb.r).toBeGreaterThan(rgb.b);
    });
  });

  describe('generateColorScale', () => {
    it('should generate a complete color scale from base color', () => {
      const scale = generateColorScale('#008585');

      expect(scale[50]).toBeDefined();
      expect(scale[100]).toBeDefined();
      expect(scale[200]).toBeDefined();
      expect(scale[300]).toBeDefined();
      expect(scale[400]).toBeDefined();
      expect(scale[500]).toBeDefined();
      expect(scale[600]).toBeDefined();
      expect(scale[700]).toBeDefined();
      expect(scale[800]).toBeDefined();
      expect(scale[900]).toBeDefined();
    });

    it('should preserve provided key points', () => {
      const keyPoints = {
        50: '#FEF9E0',
        100: '#FBF2C4',
        300: '#E5C185',
      };

      const scale = generateColorScale('#FBF2C4', keyPoints);

      expect(scale[50]).toBe('#FEF9E0');
      expect(scale[100]).toBe('#FBF2C4');
      expect(scale[300]).toBe('#E5C185');
    });

    it('should preserve multiple key points for slate scale', () => {
      const keyPoints = {
        600: '#535A63',
        900: '#343941',
      };

      const scale = generateColorScale('#535A63', keyPoints);

      expect(scale[600]).toBe('#535A63');
      expect(scale[900]).toBe('#343941');
    });

    it('should interpolate between key points', () => {
      const keyPoints = {
        100: '#FBF2C4',
        300: '#E5C185',
      };

      const scale = generateColorScale('#FBF2C4', keyPoints);

      // Check that 200 is interpolated between 100 and 300
      const rgb200 = hexToRgb(scale[200]!);
      const rgb100 = hexToRgb('#FBF2C4');
      const rgb300 = hexToRgb('#E5C185');

      expect(rgb200.r).toBeGreaterThan(rgb300.r);
      expect(rgb200.r).toBeLessThan(rgb100.r);
    });

    it('should generate lighter variants for positions below 500', () => {
      const scale = generateColorScale('#008585');

      const rgb50 = hexToRgb(scale[50]!);
      const rgb500 = hexToRgb(scale[500]!);

      const hsl50 = rgbToHsl(rgb50.r, rgb50.g, rgb50.b);
      const hsl500 = rgbToHsl(rgb500.r, rgb500.g, rgb500.b);

      expect(hsl50.l).toBeGreaterThan(hsl500.l);
    });

    it('should generate darker variants for positions above 500', () => {
      const scale = generateColorScale('#74A892');

      const rgb500 = hexToRgb(scale[500]!);
      const rgb900 = hexToRgb(scale[900]!);

      const hsl500 = rgbToHsl(rgb500.r, rgb500.g, rgb500.b);
      const hsl900 = rgbToHsl(rgb900.r, rgb900.g, rgb900.b);

      expect(hsl900.l).toBeLessThan(hsl500.l);
    });
  });

  describe('generateBrandColorScale', () => {
    it('should generate scale with preserved hue', () => {
      const scale = generateBrandColorScale('#008585', { preserveHue: true });

      const rgb500 = hexToRgb(scale[500]!);
      const rgb300 = hexToRgb(scale[300]!);
      const rgb700 = hexToRgb(scale[700]!);

      const hsl500 = rgbToHsl(rgb500.r, rgb500.g, rgb500.b);
      const hsl300 = rgbToHsl(rgb300.r, rgb300.g, rgb300.b);
      const hsl700 = rgbToHsl(rgb700.r, rgb700.g, rgb700.b);

      expect(Math.abs(hsl500.h - hsl300.h)).toBeLessThan(5);
      expect(Math.abs(hsl500.h - hsl700.h)).toBeLessThan(5);
    });

    it('should respect lightness boundaries', () => {
      const scale = generateBrandColorScale('#C7522A', {
        minLightness: 15,
        maxLightness: 90,
      });

      const rgb50 = hexToRgb(scale[50]!);
      const rgb900 = hexToRgb(scale[900]!);

      const hsl50 = rgbToHsl(rgb50.r, rgb50.g, rgb50.b);
      const hsl900 = rgbToHsl(rgb900.r, rgb900.g, rgb900.b);

      expect(hsl50.l).toBeLessThanOrEqual(90);
      expect(hsl900.l).toBeGreaterThanOrEqual(15);
    });

    it('should apply saturation curve', () => {
      const scaleEase = generateBrandColorScale('#64748B', {
        saturationCurve: 'ease',
      });

      const scaleDramatic = generateBrandColorScale('#64748B', {
        saturationCurve: 'dramatic',
      });

      const rgbEase500 = hexToRgb(scaleEase[500]!);
      const rgbEase50 = hexToRgb(scaleEase[50]!);

      const hslEase500 = rgbToHsl(rgbEase500.r, rgbEase500.g, rgbEase500.b);
      const hslEase50 = rgbToHsl(rgbEase50.r, rgbEase50.g, rgbEase50.b);

      // Middle values should have higher saturation than extremes with ease curve
      expect(hslEase500.s).toBeGreaterThan(hslEase50.s);
    });
  });

  describe('Brand Color Scale Preservation', () => {
    it('should preserve sand scale key points', () => {
      const { sandScale } = require('../colors/brandColors');

      expect(sandScale[50]).toBe('#FEF9E0');
      expect(sandScale[100]).toBe('#FBF2C4');
      expect(sandScale[300]).toBe('#E5C185');
    });

    it('should preserve teal scale key point', () => {
      const { tealScale } = require('../colors/brandColors');

      expect(tealScale[600]).toBe('#008585');
    });

    it('should preserve sage scale key point', () => {
      const { sageScale } = require('../colors/brandColors');

      expect(sageScale[500]).toBe('#74A892');
    });

    it('should preserve rust scale key point', () => {
      const { rustScale } = require('../colors/brandColors');

      expect(rustScale[600]).toBe('#C7522A');
    });

    it('should preserve slate scale key points', () => {
      const { slateScale } = require('../colors/brandColors');

      expect(slateScale[600]).toBe('#535A63');
      expect(slateScale[900]).toBe('#343941');
    });

    it('should preserve info scale key point', () => {
      const { infoScale } = require('../colors/brandColors');

      expect(infoScale[600]).toBe('#64748B');
    });
  });
});
