import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../theme/types';
import ThemeService from '../services/theme/ThemeService';

/**
 * Hook for managing theme mode with additional utilities
 */
export const useThemeMode = () => {
  const { theme, themeMode, setThemeMode, isDynamicEnabled, toggleDynamicTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check if current theme is dark
  const isDarkMode =
    theme.mode === ThemeMode.DARK || (theme.mode === ThemeMode.AUTO && theme.colors.background[500] === '#212121');

  // Check if current theme is light
  const isLightMode =
    theme.mode === ThemeMode.LIGHT || (theme.mode === ThemeMode.AUTO && theme.colors.background[500] !== '#212121');

  // Check specific modes
  const isAutoMode = themeMode === ThemeMode.AUTO;
  const isDynamicMode = themeMode === ThemeMode.DYNAMIC;

  // Switch to a specific theme with transition
  const switchTheme = useCallback(
    async (mode: ThemeMode, animated: boolean = true) => {
      if (animated) {
        setIsTransitioning(true);
      }

      await setThemeMode(mode);

      if (animated) {
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
    },
    [setThemeMode]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(async () => {
    const newMode = isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK;
    await switchTheme(newMode);
  }, [isDarkMode, switchTheme]);

  // Cycle through theme modes
  const cycleTheme = useCallback(async () => {
    const modes = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.AUTO];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    await switchTheme(modes[nextIndex]);
  }, [themeMode, switchTheme]);

  // Set to system theme
  const useSystemTheme = useCallback(async () => {
    await switchTheme(ThemeMode.AUTO);
  }, [switchTheme]);

  // Enable/disable dynamic theming
  const setDynamicTheming = useCallback(
    async (enabled: boolean) => {
      if (enabled !== isDynamicEnabled) {
        await toggleDynamicTheme();
      }
    },
    [isDynamicEnabled, toggleDynamicTheme]
  );

  return {
    // Current state
    currentMode: themeMode,
    isDarkMode,
    isLightMode,
    isAutoMode,
    isDynamicMode,
    isDynamicEnabled,
    isTransitioning,

    // Actions
    setThemeMode: switchTheme,
    toggleTheme,
    cycleTheme,
    useSystemTheme,
    setDynamicTheming,

    // Quick setters
    setLightMode: () => switchTheme(ThemeMode.LIGHT),
    setDarkMode: () => switchTheme(ThemeMode.DARK),
    setAutoMode: () => switchTheme(ThemeMode.AUTO),
  };
};

/**
 * Hook to get theme mode with schedule support
 */
export const useScheduledTheme = (lightModeStartHour: number = 6, darkModeStartHour: number = 18) => {
  const { themeMode, setThemeMode } = useTheme();
  const [scheduledMode, setScheduledMode] = useState<ThemeMode>(ThemeMode.LIGHT);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= darkModeStartHour || currentHour < lightModeStartHour) {
        setScheduledMode(ThemeMode.DARK);
      } else {
        setScheduledMode(ThemeMode.LIGHT);
      }
    };

    checkSchedule();

    // Check every minute
    const interval = setInterval(checkSchedule, 60000);

    return () => clearInterval(interval);
  }, [lightModeStartHour, darkModeStartHour]);

  const enableScheduledTheme = useCallback(async () => {
    await setThemeMode(scheduledMode);
  }, [scheduledMode, setThemeMode]);

  return {
    scheduledMode,
    currentMode: themeMode,
    enableScheduledTheme,
    isScheduledDark: scheduledMode === ThemeMode.DARK,
  };
};

/**
 * Hook to sync theme with a specific preference
 */
export const useThemePreference = () => {
  const { themeMode, setThemeMode } = useTheme();
  const [preference, setPreference] = useState<ThemeMode>(themeMode);
  const [isLoading, setIsLoading] = useState(false);

  // Load preference from storage
  const loadPreference = useCallback(async () => {
    setIsLoading(true);
    try {
      const prefs = await ThemeService.loadThemePreferences();
      if (prefs) {
        setPreference(prefs.mode);
      }
    } catch (error) {
      // Error occurred: 'Failed to load theme preference:', error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preference to storage
  const savePreference = useCallback(
    async (mode: ThemeMode) => {
      setIsLoading(true);
      try {
        await setThemeMode(mode);
        setPreference(mode);
      } catch (error) {
        // Error occurred: 'Failed to save theme preference:', error
      } finally {
        setIsLoading(false);
      }
    },
    [setThemeMode]
  );

  // Get most used theme
  const getMostUsedTheme = useCallback(async () => {
    const mostUsed = await ThemeService.getMostUsedTheme();
    return mostUsed || ThemeMode.AUTO;
  }, []);

  // Apply most used theme
  const applyMostUsedTheme = useCallback(async () => {
    const mostUsed = await getMostUsedTheme();
    await savePreference(mostUsed);
  }, [getMostUsedTheme, savePreference]);

  useEffect(() => {
    loadPreference();
  }, []);

  return {
    preference,
    isLoading,
    savePreference,
    loadPreference,
    getMostUsedTheme,
    applyMostUsedTheme,
  };
};

/**
 * Hook for theme mode with gesture support
 */
export const useThemeGestures = () => {
  const { toggleTheme, cycleTheme } = useThemeMode();
  const [gestureEnabled, setGestureEnabled] = useState(true);

  // Handler for swipe gestures
  const handleSwipeLeft = useCallback(() => {
    if (gestureEnabled) {
      cycleTheme();
    }
  }, [gestureEnabled, cycleTheme]);

  const handleSwipeRight = useCallback(() => {
    if (gestureEnabled) {
      cycleTheme();
    }
  }, [gestureEnabled, cycleTheme]);

  // Handler for double tap
  const handleDoubleTap = useCallback(() => {
    if (gestureEnabled) {
      toggleTheme();
    }
  }, [gestureEnabled, toggleTheme]);

  return {
    gestureEnabled,
    setGestureEnabled,
    handleSwipeLeft,
    handleSwipeRight,
    handleDoubleTap,
  };
};

export default useThemeMode;
