import { Theme, ThemeMode } from '../types';
import { lightSemanticColors, specialColors } from '../colors/semanticColors';
import { spacingScale, typographyScale, borderRadiusScale, shadowScale } from '../scales';
import { brandGradient, getGradientForCSS } from '../gradients';

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
  gradients: {
    brand: brandGradient,
    button: getGradientForCSS('button'),
    header: getGradientForCSS('header'),
    accent: getGradientForCSS('accent'),
    overlay: getGradientForCSS('overlay'),
  },
};

export default lightTheme;
