import { Theme, ThemeMode } from '../types';
import { lightSemanticColors, specialColors } from '../colors/semanticColors';
import { spacingScale, typographyScale, borderRadiusScale, shadowScale } from '../scales';

const lightTheme: Theme = {
  mode: ThemeMode.LIGHT,
  colors: {
    ...lightSemanticColors,
    ...specialColors,
  },
  spacing: spacingScale,
  typography: typographyScale,
  borderRadius: borderRadiusScale,
  shadows: shadowScale,
};

export default lightTheme;
