import { Theme, ThemeMode } from '../types';
import { darkSemanticColors, specialColors } from '../colors/semanticColors';
import { spacingScale, typographyScale, borderRadiusScale, shadowScale } from '../scales';

const darkTheme: Theme = {
  mode: ThemeMode.DARK,
  colors: {
    ...darkSemanticColors,
    ...specialColors,
  },
  spacing: spacingScale,
  typography: typographyScale,
  borderRadius: borderRadiusScale,
  shadows: shadowScale,
};

export default darkTheme;
