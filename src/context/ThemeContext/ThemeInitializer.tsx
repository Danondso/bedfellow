import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './index';
import ThemeService from '../../services/theme/ThemeService';
import { ThemeMode, ThemePreference } from '../../theme/types';
import { systemThemeManager } from './systemTheme';
import { lightTheme } from '../../theme/themes';

interface ThemeInitializerProps {
  children: React.ReactNode;
  onThemeLoaded?: (preferences: ThemePreference | null) => void;
  fallbackMode?: ThemeMode;
  showLoadingScreen?: boolean;
  loadingComponent?: React.ReactNode;
}

/**
 * ThemeInitializer component that loads theme preferences before rendering the app
 * This ensures the correct theme is applied from the start, preventing flashes
 */
export const ThemeInitializer: React.FC<ThemeInitializerProps> = ({
  children,
  onThemeLoaded,
  fallbackMode = ThemeMode.AUTO,
  showLoadingScreen = true,
  loadingComponent,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeTheme();
  }, []);

  const initializeTheme = async () => {
    try {
      // Start initialization tasks in parallel for better performance
      const [preferences] = await Promise.all([
        ThemeService.loadThemePreferences(),
        ThemeService.migrateFromOldStorage(),
      ]);

      // If no preferences exist, create default ones
      let finalPreferences = preferences;
      if (!preferences) {
        finalPreferences = {
          mode: fallbackMode,
          dynamicEnabled: true,
        };

        // Save default preferences
        await ThemeService.saveThemePreferences(finalPreferences);
      }

      // Initialize system theme manager
      systemThemeManager.refresh();

      // Preload any cached palettes
      // This is done in background to not block initialization
      preloadCachedPalettes();

      onThemeLoaded?.(finalPreferences);
      setIsInitialized(true);
    } catch (err) {
      // Error occurred: 'Failed to initialize theme:', err

      // Fall back to default theme on error
      const fallbackPreferences: ThemePreference = {
        mode: fallbackMode,
        dynamicEnabled: true,
      };

      onThemeLoaded?.(fallbackPreferences);
      setIsInitialized(true);
    }
  };

  const preloadCachedPalettes = async () => {
    try {
      // This runs in background and doesn't block initialization
      // It preloads the palette cache for faster access later
      const cacheData = await AsyncStorage.getItem('@bedfellow_dynamic_palette_cache');
      if (cacheData) {
        // Cache is already loaded into ThemeService memory
      }
    } catch (err) {
      // Non-critical error, just log it
    }
  };

  if (!isInitialized) {
    if (showLoadingScreen) {
      return <>{loadingComponent || <DefaultLoadingScreen />}</>;
    }

    // If not showing loading screen, render with default theme immediately
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  // Render the app with initialized theme
  return <ThemeProvider>{children}</ThemeProvider>;
};

// Default loading screen component
const DefaultLoadingScreen: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={lightTheme.colors.primary[500]} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background[500],
  },
});

// Hook to check if theme is initialized
export const useThemeInitialized = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    checkInitialization();
  }, []);

  const checkInitialization = async () => {
    const preferences = await ThemeService.loadThemePreferences();
    setIsInitialized(preferences !== null);
  };

  return isInitialized;
};

// App wrapper that includes theme initialization
export const ThemeApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeInitializer showLoadingScreen={true}>{children}</ThemeInitializer>;
};

export default ThemeInitializer;
