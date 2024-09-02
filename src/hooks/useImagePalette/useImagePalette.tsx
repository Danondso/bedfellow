import { useEffect, useContext, useCallback } from 'react';
import ImageColors from 'react-native-image-colors';
import defaultPalette from '../../theme/styles';
import { ImagePalette, ImagePaletteContext, ImagePaletteContextData } from '../../context/ImagePaletteContext';

const useImagePalette = (imageSrc: string) => {
  const { imagePalette, setImagePalette } = useContext<ImagePaletteContextData>(ImagePaletteContext);

  const setImagePaletteCallbackFn = useCallback((colors: ImagePalette) => setImagePalette(colors), [setImagePalette]);
  useEffect(() => {
    const getColorPallette = async () => {
      if (!imageSrc) {
        return;
      }
      if (imageSrc.startsWith('https://')) {
        const result: ImageColors.IOSImageColors | ImageColors.AndroidImageColors = await ImageColors.getColors(
          imageSrc,
          {
            fallback: defaultPalette.primaryBackground,
            cache: true,
            key: imageSrc,
          }
        );

        // We get different colors based on the platform, android's is a
        // little spottier when getting a palette with
        // contrast so we only use the dark / light colors here
        const resultPalette: ImagePalette =
          result.platform === 'android'
            ? {
                // ts warns androids props may be undefined so we default any to the defaultPalette
                background: result.lightMuted ?? defaultPalette.primaryBackground,
                detail: result.darkMuted ?? defaultPalette.accent,
                primary: result.lightVibrant ?? defaultPalette.primaryText,
                secondary: result.darkVibrant ?? defaultPalette.secondaryBackground,
              }
            : {
                background: result.background,
                detail: result.detail,
                primary: result.primary,
                secondary: result.secondary,
              };

        setImagePaletteCallbackFn(resultPalette);
      }
    };
    if (imageSrc) {
      getColorPallette();
    }
  }, [imageSrc, setImagePaletteCallbackFn]);

  return imagePalette;
};

export default useImagePalette;
