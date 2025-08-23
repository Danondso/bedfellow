import { useEffect, useContext, useCallback } from 'react';
import { DynamicPalette } from '../../theme/types';
import { ThemeContext } from './index';
import ColorExtractionService, {
  ExtractionQuality,
  ColorHarmony,
  ColorExtractionOptions,
} from '../../services/theme/colorExtraction';

// Default extraction options
const DEFAULT_EXTRACTION_OPTIONS: ColorExtractionOptions = {
  quality: ExtractionQuality.LOW,
  cache: true,
  enhanceContrast: true,
  harmony: ColorHarmony.TRIADIC,
};

// Hook to use dynamic theme from album artwork
export const useDynamicTheme = (imageUrl: string | null | undefined, options: Partial<ColorExtractionOptions> = {}) => {
  const { setDynamicPalette, isDynamicEnabled } = useContext(ThemeContext);

  const updatePalette = useCallback(async () => {
    if (!isDynamicEnabled || !imageUrl) {
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
  }, [imageUrl, isDynamicEnabled, setDynamicPalette, options]);

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
  const { dynamicPalette, setDynamicPalette, isDynamicEnabled } = useContext(ThemeContext);

  const extractAndApply = useCallback(async () => {
    if (!isDynamicEnabled || !imageUrl) {
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
  }, [imageUrl, isDynamicEnabled, setDynamicPalette, options]);

  const createFromColor = useCallback(
    (baseColor: string, harmony: ColorHarmony = ColorHarmony.TRIADIC) => {
      const palette = ColorExtractionService.createPalette(baseColor, harmony);
      setDynamicPalette(palette);
      return palette;
    },
    [setDynamicPalette]
  );

  const validateAccessibility = useCallback(
    (palette?: DynamicPalette) => {
      const targetPalette = palette || dynamicPalette;
      if (!targetPalette) return null;

      return ColorExtractionService.validateAccessibility(targetPalette);
    },
    [dynamicPalette]
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
    validateAccessibility,
    clearCache,
  };
};

export default useDynamicTheme;
