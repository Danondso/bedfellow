import React, { createContext, Dispatch, SetStateAction, useState, useMemo, ReactNode, Context } from 'react';
import defaultPalette from '../../theme/styles';

export type ImagePalette = {
  background: string;
  primary: string;
  secondary: string;
  detail: string;
};

export type ImagePaletteContextData = {
  imagePalette: ImagePalette;
  setImagePalette: Dispatch<SetStateAction<ImagePalette>>;
};

const initialState: ImagePalette = {
  background: defaultPalette.primaryBackground,
  detail: defaultPalette.accent,
  primary: defaultPalette.primaryText,
  secondary: defaultPalette.secondaryBackground,
};

export const ImagePaletteContext: Context<ImagePaletteContextData> = createContext<ImagePaletteContextData>({
  imagePalette: initialState,
  setImagePalette: () => {},
});

function ImagePaletteContextProvider({ children }: { children: ReactNode }) {
  const [imagePalette, setImagePalette] = useState<ImagePalette>(initialState);

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
