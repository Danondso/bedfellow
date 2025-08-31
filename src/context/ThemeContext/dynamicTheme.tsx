import { useEffect, useContext, useCallback } from 'react';
import { ThemeMode } from '../../theme/types';
import { ThemeContext } from './index';
import ColorExtractionService, {
  ExtractionQuality,
  ColorHarmony,
  ColorExtractionOptions,
} from '../../services/theme/colorExtraction';

// Default extraction options
const DEFAULT_EXTRACTION_OPTIONS: ColorExtractionOptions = {
  quality: ExtractionQuality.HIGH, // Better quality extraction
  cache: true,
  enhanceContrast: true,
  harmony: ColorHarmony.COMPLEMENTARY, // More vibrant color combinations
  saturate: 20, // Boost saturation for more vibrant colors
  brighten: 10, // Slightly brighten for better visibility
  blendWithBrand: false, // Don't blend with brand colors to keep album colors pure
};

// Hook to use dynamic theme from album artwork
export const useDynamicTheme = (imageUrl: string | null | undefined, options: Partial<ColorExtractionOptions> = {}) => {
  const { setDynamicPalette, isDynamicEnabled, themeMode } = useContext(ThemeContext);

  const updatePalette = useCallback(async () => {
    // Check if we should extract colors (either DYNAMIC mode or legacy isDynamicEnabled)
    const shouldExtract = themeMode === ThemeMode.DYNAMIC || isDynamicEnabled;
    if (!shouldExtract || !imageUrl) {
      setDynamicPalette(null);
      return;
    }

    const palette = await ColorExtractionService.extractColors(imageUrl, {
      ...DEFAULT_EXTRACTION_OPTIONS,
      ...options,
    });

    if (palette) {
      setDynamicPalette(palette);
    }
  }, [imageUrl, isDynamicEnabled, themeMode, setDynamicPalette, options]);

  useEffect(() => {
    updatePalette();
  }, [updatePalette]);

  return {
    updatePalette,
  };
};

// Hook for album artwork theme (compatible with existing useImagePalette)
export const useAlbumTheme = (albumArtUrl: string | null | undefined, harmony?: ColorHarmony) => {
  const { theme, dynamicPalette } = useContext(ThemeContext);
  useDynamicTheme(albumArtUrl, { harmony });

  // Return palette in format compatible with existing ImagePalette
  return (
    dynamicPalette || {
      background: theme.colors.background[500],
      primary: theme.colors.primary[500],
      secondary: theme.colors.secondary[500],
      detail: theme.colors.accent[500],
    }
  );
};

// Hook for advanced dynamic theming with customization
export const useAdvancedDynamicTheme = (
  imageUrl: string | null | undefined,
  options: {
    harmony?: ColorHarmony;
    saturate?: number;
    brighten?: number;
    quality?: ExtractionQuality;
  } = {}
) => {
  const { dynamicPalette, setDynamicPalette, isDynamicEnabled, themeMode } = useContext(ThemeContext);

  const extractAndApply = useCallback(async () => {
    const shouldExtract = themeMode === ThemeMode.DYNAMIC || isDynamicEnabled;
    if (!shouldExtract || !imageUrl) {
      setDynamicPalette(null);
      return null;
    }

    const palette = await ColorExtractionService.extractColors(imageUrl, {
      ...DEFAULT_EXTRACTION_OPTIONS,
      ...options,
    });

    if (palette) {
      setDynamicPalette(palette);
      return palette;
    }

    return null;
  }, [imageUrl, isDynamicEnabled, themeMode, setDynamicPalette, options]);

  const createFromColor = useCallback(
    (baseColor: string, harmony: ColorHarmony = ColorHarmony.TRIADIC) => {
      const palette = ColorExtractionService.createPalette(baseColor, harmony);
      setDynamicPalette(palette);
      return palette;
    },
    [setDynamicPalette]
  );

  const clearCache = useCallback(async () => {
    await ColorExtractionService.clearCache();
  }, []);

  useEffect(() => {
    extractAndApply();
  }, [extractAndApply]);

  return {
    palette: dynamicPalette,
    extractAndApply,
    createFromColor,
    clearCache,
  };
};

export default useDynamicTheme;
