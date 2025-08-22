import { Theme, ThemeMode } from '../types';
import lightTheme from './light';
import darkTheme from './dark';
import brandTheme from './brand';

// Theme registry for easy lookup
const themes: Record<string, Theme> = {
  [ThemeMode.LIGHT]: lightTheme,
  [ThemeMode.DARK]: darkTheme,
  [ThemeMode.BRAND]: brandTheme,
};

// Get theme by mode
export const getThemeByMode = (mode: ThemeMode): Theme => {
  // For auto and dynamic modes, we'll determine the actual theme elsewhere
  // This function just returns the base themes
  if (mode === ThemeMode.LIGHT) {
    return lightTheme;
  }
  if (mode === ThemeMode.DARK) {
    return darkTheme;
  }
  if (mode === ThemeMode.BRAND) {
    return brandTheme;
  }

  // Default to light theme for auto/dynamic modes
  // The actual theme selection for these modes will be handled by the ThemeContext
  return lightTheme;
};

// Helper to get the opposite theme (for inverting)
export const getOppositeTheme = (currentTheme: Theme): Theme => {
  return currentTheme.mode === ThemeMode.DARK ? lightTheme : darkTheme;
};

// Check if a theme mode is valid
export const isValidThemeMode = (mode: string): mode is ThemeMode => {
  return Object.values(ThemeMode).includes(mode as ThemeMode);
};

// Export individual themes
export { lightTheme, darkTheme, brandTheme };

// Export all themes
export default themes;
