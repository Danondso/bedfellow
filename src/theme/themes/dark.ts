import { Theme, ThemeMode } from '../types';
import { darkSemanticBrandColors, specialColors } from '../colors/semanticColors';
import { spacingScale, typographyScale, borderRadiusScale, shadowScale } from '../scales';
import { brandGradient, getGradientForCSS } from '../gradients';

const darkTheme: Theme = {
  mode: ThemeMode.DARK,
  colors: {
    ...darkSemanticBrandColors,
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

export default darkTheme;
