import React, { createContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSystemTheme } from './systemTheme';
import { themeEventManager } from './ThemeEventManager';
import { Theme, ThemeMode, ThemePreference, DynamicPalette } from '../../theme/types';
import { lightTheme, darkTheme } from '../../theme/themes';
import { createDynamicTheme, getBaseThemeForDynamic } from '../../theme/themes/default';

// Storage key for theme preferences
const THEME_STORAGE_KEY = '@bedfellow_theme_preferences';

// Context data interface
export interface ThemeContextData {
  theme: Theme;
  themeMode: ThemeMode;
  dynamicPalette: DynamicPalette | null;
  isDynamicEnabled: boolean;
  isLoading: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setDynamicPalette: (palette: DynamicPalette | null) => void;
  toggleDynamicTheme: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextData>({
  theme: lightTheme,
  themeMode: ThemeMode.AUTO,
  dynamicPalette: null,
  isDynamicEnabled: true,
  isLoading: false,
  setThemeMode: async () => {},
  setDynamicPalette: () => {},
  toggleDynamicTheme: async () => {},
  resetToDefaults: async () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(ThemeMode.AUTO);
  const [isDynamicEnabled, setIsDynamicEnabled] = useState(true);
  const [dynamicPalette, setDynamicPaletteState] = useState<DynamicPalette | null>(null);
  const systemTheme = useSystemTheme(); // Use enhanced system theme hook
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preferences on mount
  useEffect(() => {
    loadThemePreferences();
  }, []);

  // Load theme preferences from storage
  const loadThemePreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const preferences: ThemePreference = JSON.parse(stored);
        setThemeModeState(preferences.mode);
        setIsDynamicEnabled(preferences.dynamicEnabled);
      }
    } catch (error) {
      // Error occurred: 'Failed to load theme preferences:', error
    } finally {
      setIsLoading(false);
    }
  };

  // Save theme preferences to storage
  const saveThemePreferences = async (preferences: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      // Error occurred: 'Failed to save theme preferences:', error
    }
  };

  // Set theme mode
  const setThemeMode = useCallback(
    async (mode: ThemeMode) => {
      const previousMode = themeMode;
      setThemeModeState(mode);
      await saveThemePreferences({
        mode,
        dynamicEnabled: isDynamicEnabled,
      });

      // Notify event manager of manual theme change
      themeEventManager.handleManualThemeChange(previousMode, mode);
    },
    [isDynamicEnabled, themeMode]
  );

  // Set dynamic palette
  const setDynamicPalette = useCallback((palette: DynamicPalette | null) => {
    setDynamicPaletteState(palette);
  }, []);

  // Toggle dynamic theme
  const toggleDynamicTheme = useCallback(async () => {
    const newValue = !isDynamicEnabled;
    setIsDynamicEnabled(newValue);

    // If disabling dynamic theme, clear the palette
    if (!newValue) {
      setDynamicPaletteState(null);
    }

    await saveThemePreferences({
      mode: themeMode,
      dynamicEnabled: newValue,
    });
  }, [isDynamicEnabled, themeMode]);

  // Reset to defaults
  const resetToDefaults = useCallback(async () => {
    setThemeModeState(ThemeMode.AUTO);
    setIsDynamicEnabled(true);
    setDynamicPaletteState(null);
    await AsyncStorage.removeItem(THEME_STORAGE_KEY);
  }, []);

  // Calculate the current theme based on mode and settings
  const currentTheme = useMemo(() => {
    // Handle DYNAMIC theme mode
    if (themeMode === ThemeMode.DYNAMIC) {
      if (dynamicPalette) {
        // Use system theme preference for base (light/dark)
        const isDark = systemTheme === 'dark';
        const baseTheme = getBaseThemeForDynamic(isDark);
        return createDynamicTheme(dynamicPalette, baseTheme);
      }
      // If no palette available, fall back to AUTO mode behavior
      return systemTheme === 'dark' ? darkTheme : lightTheme;
    }

    // TODO: Remove isDynamicEnabled flag in future version
    // The isDynamicEnabled flag is legacy and should be replaced with ThemeMode.DYNAMIC
    // Keeping for backward compatibility - users should use ThemeMode.DYNAMIC instead
    // If dynamic theme is enabled and we have a palette (legacy behavior for AUTO mode)
    if (isDynamicEnabled && dynamicPalette && themeMode === ThemeMode.AUTO) {
      const isDark = systemTheme === 'dark';
      const baseTheme = getBaseThemeForDynamic(isDark);
      return createDynamicTheme(dynamicPalette, baseTheme);
    }

    // Otherwise, use the selected theme mode
    switch (themeMode) {
      case ThemeMode.LIGHT:
        return lightTheme;
      case ThemeMode.DARK:
        return darkTheme;
      case ThemeMode.AUTO:
        return systemTheme === 'dark' ? darkTheme : lightTheme;
      default:
        return lightTheme;
    }
  }, [themeMode, systemTheme, isDynamicEnabled, dynamicPalette]);

  const contextValue = useMemo<ThemeContextData>(
    () => ({
      theme: currentTheme,
      themeMode,
      dynamicPalette,
      isDynamicEnabled,
      isLoading,
      setThemeMode,
      setDynamicPalette,
      toggleDynamicTheme,
      resetToDefaults,
    }),
    [
      currentTheme,
      themeMode,
      dynamicPalette,
      isDynamicEnabled,
      isLoading,
      setThemeMode,
      setDynamicPalette,
      toggleDynamicTheme,
      resetToDefaults,
    ]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

// Hook to use theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
