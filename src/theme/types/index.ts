export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  BRAND = 'brand',
  AUTO = 'auto',
  DYNAMIC = 'dynamic',
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  '4xl': number;
  '5xl': number;
}

export interface TypographyScale {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

export interface BorderRadiusScale {
  none: number;
  sm: number;
  base: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  full: number;
}

export interface ShadowScale {
  none: object;
  sm: object;
  base: object;
  md: object;
  lg: object;
  xl: object;
  '2xl': object;
}

export interface ThemeColors {
  // Backgrounds
  background: ColorScale;
  surface: ColorScale;

  // Content
  text: ColorScale;

  // Interactive
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;

  // Feedback
  error: ColorScale;
  warning: ColorScale;
  success: ColorScale;
  info: ColorScale;

  // Borders & Dividers
  border: ColorScale;
  divider: ColorScale;

  // Special
  shadow: string;
  overlay: string;

  // Stroke utilities
  softStroke?: string;
  mediumStroke?: string;
  strongStroke?: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: SpacingScale;
  typography: TypographyScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  gradients?: {
    brand: string;
    button?: string;
    header?: string;
    accent?: string;
    overlay?: string;
    [key: string]: string | undefined;
  };
}

// Utility types for components
export interface ThemedStyleProps {
  theme: Theme;
}

export interface ThemedComponentProps {
  theme?: Theme;
  style?: any;
}

// Type for dynamic palette from album artwork
export interface DynamicPalette {
  background: string;
  primary: string;
  secondary: string;
  detail: string;
}

// Theme preference stored in AsyncStorage
export interface ThemePreference {
  mode: ThemeMode;
  dynamicEnabled: boolean;
  customAccentColor?: string;
}
