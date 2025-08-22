import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { ThemeInitializer } from '../context/ThemeContext/ThemeInitializer';
import { ThemePreference } from '../theme/types';
import { lightTheme } from '../theme/themes';

interface AppStartupProps {
  children: React.ReactNode;
  splashDuration?: number;
  showSplash?: boolean;
  onReady?: () => void;
}

/**
 * AppStartup component that handles app initialization including:
 * - Theme loading and initialization
 * - Splash screen animation
 * - Other app initialization tasks
 */
export const AppStartup: React.FC<AppStartupProps> = ({
  children,
  splashDuration = 2000,
  showSplash = true,
  onReady,
}) => {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [isSplashComplete, setIsSplashComplete] = useState(!showSplash);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isThemeLoaded && !showSplash) {
      onReady?.();
    }
  }, [isThemeLoaded, showSplash, onReady]);

  const handleThemeLoaded = (preferences: ThemePreference | null) => {
    console.log('Theme loaded with preferences:', preferences);
    setIsThemeLoaded(true);

    if (showSplash) {
      // Start splash screen fade out after theme is loaded
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsSplashComplete(true);
          onReady?.();
        });
      }, splashDuration);
    }
  };

  const renderSplashScreen = () => {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <View style={styles.splashContent}>
          {/* Add your app logo here */}
          <Text style={styles.appName}>Bedfellow</Text>
          <Text style={styles.tagline}>Discover the samples behind the music</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ThemeInitializer
      onThemeLoaded={handleThemeLoaded}
      showLoadingScreen={false}
      loadingComponent={showSplash ? renderSplashScreen() : null}
    >
      {isSplashComplete ? children : renderSplashScreen()}
    </ThemeInitializer>
  );
};

// Simplified startup for apps that don't need splash screen
export const QuickStartup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeInitializer showLoadingScreen={false}>{children}</ThemeInitializer>;
};

// Hook to track app startup status
export const useAppStartup = () => {
  const [status, setStatus] = useState<{
    isThemeLoaded: boolean;
    isReady: boolean;
    error: Error | null;
  }>({
    isThemeLoaded: false,
    isReady: false,
    error: null,
  });

  useEffect(() => {
    const checkStartupStatus = async () => {
      try {
        // Check if theme is loaded
        const ThemeService = require('../services/theme/ThemeService').default;
        const preferences = await ThemeService.loadThemePreferences();

        setStatus((prev) => ({
          ...prev,
          isThemeLoaded: preferences !== null,
          isReady: true,
        }));
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          error: error as Error,
          isReady: true,
        }));
      }
    };

    checkStartupStatus();
  }, []);

  return status;
};

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightTheme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: lightTheme.colors.text[50],
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: lightTheme.colors.text[100],
    opacity: 0.9,
  },
});

export default AppStartup;
