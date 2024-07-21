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

        const resultPalette: ImagePalette =
          result.platform === 'android'
            ? {
                background: result.dominant ?? defaultPalette.primaryBackground,
                detail: result.lightMuted ?? defaultPalette.accent,
                primary: result.vibrant ?? defaultPalette.primaryText,
                secondary: result.lightVibrant ?? defaultPalette.secondaryBackground,
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
