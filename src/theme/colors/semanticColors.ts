import { ColorScale } from '../types';

// Helper function to create a color scale
export const createColorScale = (baseColor: string, variations: Partial<ColorScale> = {}): ColorScale => {
  return {
    50: variations[50] || baseColor,
    100: variations[100] || baseColor,
    200: variations[200] || baseColor,
    300: variations[300] || baseColor,
    400: variations[400] || baseColor,
    500: variations[500] || baseColor, // Base
    600: variations[600] || baseColor,
    700: variations[700] || baseColor,
    800: variations[800] || baseColor,
    900: variations[900] || baseColor,
  };
};

// Semantic color definitions for light theme
export const lightSemanticColors = {
  // Backgrounds - Light to dark
  background: {
    50: '#FFFFFF',
    100: '#FEFEFE',
    200: '#FAFAFA',
    300: '#F7F7F7',
    400: '#F5F5F5',
    500: '#F0F0F0', // Base
    600: '#E8E8E8',
    700: '#E0E0E0',
    800: '#D6D6D6',
    900: '#CCCCCC',
  },

  // Surface colors for cards, modals, etc
  surface: {
    50: '#FFFFFF',
    100: '#FEFEFE',
    200: '#FCFCFC',
    300: '#FAFAFA',
    400: '#F8F8F8',
    500: '#F5F5F5', // Base
    600: '#F0F0F0',
    700: '#E8E8E8',
    800: '#E0E0E0',
    900: '#D8D8D8',
  },

  // Text colors - Light to dark
  text: {
    50: '#F5F5F5',
    100: '#E0E0E0',
    200: '#BDBDBD',
    300: '#9E9E9E',
    400: '#757575',
    500: '#616161', // Base
    600: '#424242',
    700: '#303030',
    800: '#212121',
    900: '#121212',
  },

  // Primary brand colors (green-based from PRD)
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Base
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Secondary colors
  secondary: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Base
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  // Accent colors (teal-based from PRD)
  accent: {
    50: '#E0F2F1',
    100: '#B2DFDB',
    200: '#80CBC4',
    300: '#4DB6AC',
    400: '#26A69A',
    500: '#009688', // Base
    600: '#00897B',
    700: '#00796B',
    800: '#00695C',
    900: '#004D40',
  },

  // Error colors
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336', // Base
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  // Warning colors
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107', // Base
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // Success colors
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Base
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Info colors
  info: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Base
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Border colors
  border: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E', // Base
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Divider colors
  divider: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#E0E0E0', // Base - lighter than border
    600: '#BDBDBD',
    700: '#9E9E9E',
    800: '#757575',
    900: '#616161',
  },
};

// Semantic color definitions for dark theme
export const darkSemanticColors = {
  // Backgrounds - Dark to light
  background: {
    50: '#000000',
    100: '#0A0A0A',
    200: '#121212',
    300: '#1A1A1A',
    400: '#1E1E1E',
    500: '#212121', // Base
    600: '#2C2C2C',
    700: '#303030',
    800: '#383838',
    900: '#404040',
  },

  // Surface colors for cards, modals, etc
  surface: {
    50: '#121212',
    100: '#1A1A1A',
    200: '#1E1E1E',
    300: '#242424',
    400: '#2A2A2A',
    500: '#2C2C2C', // Base
    600: '#323232',
    700: '#383838',
    800: '#3E3E3E',
    900: '#454545',
  },

  // Text colors - Dark to light
  text: {
    50: '#424242',
    100: '#616161',
    200: '#757575',
    300: '#9E9E9E',
    400: '#BDBDBD',
    500: '#E0E0E0', // Base
    600: '#EEEEEE',
    700: '#F5F5F5',
    800: '#FAFAFA',
    900: '#FFFFFF',
  },

  // Primary brand colors (adjusted for dark theme)
  primary: {
    50: '#1B5E20',
    100: '#2E7D32',
    200: '#388E3C',
    300: '#43A047',
    400: '#4CAF50',
    500: '#66BB6A', // Base - brighter for dark theme
    600: '#81C784',
    700: '#A5D6A7',
    800: '#C8E6C9',
    900: '#E8F5E9',
  },

  // Secondary colors (adjusted for dark theme)
  secondary: {
    50: '#E65100',
    100: '#EF6C00',
    200: '#F57C00',
    300: '#FB8C00',
    400: '#FF9800',
    500: '#FFA726', // Base - brighter for dark theme
    600: '#FFB74D',
    700: '#FFCC80',
    800: '#FFE0B2',
    900: '#FFF3E0',
  },

  // Accent colors (adjusted for dark theme)
  accent: {
    50: '#004D40',
    100: '#00695C',
    200: '#00796B',
    300: '#00897B',
    400: '#009688',
    500: '#26A69A', // Base - brighter for dark theme
    600: '#4DB6AC',
    700: '#80CBC4',
    800: '#B2DFDB',
    900: '#E0F2F1',
  },

  // Error colors (adjusted for dark theme)
  error: {
    50: '#B71C1C',
    100: '#C62828',
    200: '#D32F2F',
    300: '#E53935',
    400: '#F44336',
    500: '#EF5350', // Base - brighter for dark theme
    600: '#E57373',
    700: '#EF9A9A',
    800: '#FFCDD2',
    900: '#FFEBEE',
  },

  // Warning colors (adjusted for dark theme)
  warning: {
    50: '#FF6F00',
    100: '#FF8F00',
    200: '#FFA000',
    300: '#FFB300',
    400: '#FFC107',
    500: '#FFCA28', // Base - brighter for dark theme
    600: '#FFD54F',
    700: '#FFE082',
    800: '#FFECB3',
    900: '#FFF8E1',
  },

  // Success colors (adjusted for dark theme)
  success: {
    50: '#1B5E20',
    100: '#2E7D32',
    200: '#388E3C',
    300: '#43A047',
    400: '#4CAF50',
    500: '#66BB6A', // Base - brighter for dark theme
    600: '#81C784',
    700: '#A5D6A7',
    800: '#C8E6C9',
    900: '#E8F5E9',
  },

  // Info colors (adjusted for dark theme)
  info: {
    50: '#0D47A1',
    100: '#1565C0',
    200: '#1976D2',
    300: '#1E88E5',
    400: '#2196F3',
    500: '#42A5F5', // Base - brighter for dark theme
    600: '#64B5F6',
    700: '#90CAF9',
    800: '#BBDEFB',
    900: '#E3F2FD',
  },

  // Border colors (adjusted for dark theme)
  border: {
    50: '#121212',
    100: '#1A1A1A',
    200: '#242424',
    300: '#2C2C2C',
    400: '#383838',
    500: '#424242', // Base
    600: '#4A4A4A',
    700: '#525252',
    800: '#5A5A5A',
    900: '#626262',
  },

  // Divider colors (adjusted for dark theme)
  divider: {
    50: '#121212',
    100: '#1A1A1A',
    200: '#1E1E1E',
    300: '#242424',
    400: '#2A2A2A',
    500: '#2C2C2C', // Base - subtler than border
    600: '#323232',
    700: '#383838',
    800: '#3E3E3E',
    900: '#454545',
  },
};

// Special colors (same for both themes)
export const specialColors = {
  shadow: 'rgba(0, 0, 0, 0.25)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};
