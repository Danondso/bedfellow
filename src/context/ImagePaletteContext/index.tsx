import React, { createContext, Dispatch, SetStateAction, useState, useMemo, ReactNode, Context } from 'react';
import { AuthorizeResult } from 'react-native-app-auth';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors';

export type AuthResult = AuthorizeResult & { expired: boolean };

export type ImagePaletteContextData = {
  imagePalette: AndroidImageColors | IOSImageColors | null;
  setImagePalette: Dispatch<SetStateAction<AndroidImageColors | IOSImageColors | null>>;
};

export const ImagePaletteContext: Context<ImagePaletteContextData> = createContext<ImagePaletteContextData>({
  imagePalette: null,
  setImagePalette: () => {},
});

function ImagePaletteContextProvider({ children }: { children: ReactNode }) {
  const [imagePalette, setImagePalette] = useState<AndroidImageColors | IOSImageColors | null>(null);

  const providerData = useMemo<ImagePaletteContextData>(
    () => ({
      imagePalette,
      setImagePalette,
    }),
    [imagePalette]
  );

  return <ImagePaletteContext.Provider value={providerData}>{children}</ImagePaletteContext.Provider>;
}

export default ImagePaletteContextProvider;
