import { useEffect, useContext, useCallback } from 'react';
import ImageColors from 'react-native-image-colors';
import type {
  IOSImageColors,
  AndroidImageColors,
  WebImageColors,
} from 'react-native-image-colors/lib/typescript/types';
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
        const result: IOSImageColors | AndroidImageColors | WebImageColors = await ImageColors.getColors(imageSrc, {
          fallback: defaultPalette.primaryBackground,
          cache: true,
          key: imageSrc,
        });

        // We get different colors based on the platform, android's is a
        // little spottier when getting a palette with
        // contrast so we only use the dark / light colors here
        let resultPalette: ImagePalette;

        if (result.platform === 'android') {
          // ts warns androids props may be undefined so we default any to the defaultPalette
          resultPalette = {
            background: result.lightMuted ?? defaultPalette.primaryBackground,
            detail: result.darkMuted ?? defaultPalette.accent,
            primary: result.lightVibrant ?? defaultPalette.primaryText,
            secondary: result.darkVibrant ?? defaultPalette.secondaryBackground,
          };
        } else if (result.platform === 'ios') {
          resultPalette = {
            background: result.background,
            detail: result.detail,
            primary: result.primary,
            secondary: result.secondary,
          };
        } else {
          // Web platform - use similar to android
          resultPalette = {
            background: result.lightMuted ?? defaultPalette.primaryBackground,
            detail: result.darkMuted ?? defaultPalette.accent,
            primary: result.lightVibrant ?? defaultPalette.primaryText,
            secondary: result.darkVibrant ?? defaultPalette.secondaryBackground,
          };
        }

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
