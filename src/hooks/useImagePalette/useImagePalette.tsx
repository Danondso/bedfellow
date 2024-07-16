import { useEffect, useContext, useCallback } from 'react';
import ImageColors, { AndroidImageColors, IOSImageColors } from 'react-native-image-colors';
import defaultPalette from '../../theme/styles';
import { ImagePaletteContext, ImagePaletteContextData } from '../../context/ImagePaletteContext';

const useImagePalette = (imageSrc: string) => {
  const { imagePalette, setImagePalette } = useContext<ImagePaletteContextData>(ImagePaletteContext);

  const setImagePaletteCallbackFn = useCallback(
    (colors: IOSImageColors | AndroidImageColors | null) => setImagePalette(colors),
    [setImagePalette]
  );
  useEffect(() => {
    const getColorPallette = async () => {
      if (!imageSrc) {
        return;
      }
      if (imageSrc.startsWith('https://')) {
        const result = await ImageColors.getColors(imageSrc, {
          fallback: defaultPalette.primaryBackground,
        });
        setImagePaletteCallbackFn(result);
      }
    };
    if (imageSrc) {
      getColorPallette();
    }
  }, [imageSrc, setImagePaletteCallbackFn]);

  return imagePalette;
};

export default useImagePalette;
