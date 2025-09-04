import { Appearance, ColorSchemeName, NativeEventSubscription } from 'react-native';
import { useState, useEffect } from 'react';

// Type for theme change callback
type ThemeChangeCallback = (theme: ColorSchemeName) => void;

// Singleton class for managing system theme detection
class SystemThemeManager {
  private listeners: Set<ThemeChangeCallback> = new Set();

  private subscription: NativeEventSubscription | null = null;

  private currentTheme: ColorSchemeName = null;

  constructor() {
    this.currentTheme = Appearance.getColorScheme();
    this.setupListener();
  }

  private setupListener() {
    this.subscription = Appearance.addChangeListener(({ colorScheme }) => {
      this.currentTheme = colorScheme;
      this.notifyListeners(colorScheme);
    });
  }

  private notifyListeners(theme: ColorSchemeName) {
    this.listeners.forEach((callback) => callback(theme));
  }

  public getSystemTheme(): ColorSchemeName {
    return this.currentTheme || Appearance.getColorScheme();
  }

  public subscribe(callback: ThemeChangeCallback): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  public destroy() {
    this.subscription?.remove();
    this.listeners.clear();
  }

  // Check if system is in dark mode
  public isDarkMode(): boolean {
    return this.getSystemTheme() === 'dark';
  }

  // Check if system is in light mode
  public isLightMode(): boolean {
    return this.getSystemTheme() === 'light';
  }

  // Force refresh the current theme
  public refresh(): ColorSchemeName {
    this.currentTheme = Appearance.getColorScheme();
    this.notifyListeners(this.currentTheme);
    return this.currentTheme;
  }
}

// Create singleton instance
export const systemThemeManager = new SystemThemeManager();

// Hook to use system theme
export const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(systemThemeManager.getSystemTheme());

  useEffect(() => {
    // Set initial value
    setSystemTheme(systemThemeManager.getSystemTheme());

    // Subscribe to changes
    const unsubscribe = systemThemeManager.subscribe((theme) => {
      setSystemTheme(theme);
    });

    return unsubscribe;
  }, []);

  return systemTheme;
};

// Hook to check if system is in dark mode
export const useIsDarkMode = (): boolean => {
  const systemTheme = useSystemTheme();
  return systemTheme === 'dark';
};

// Hook to check if system is in light mode
export const useIsLightMode = (): boolean => {
  const systemTheme = useSystemTheme();
  return systemTheme === 'light';
};

// Hook to get theme-aware values
export const useThemedValue = <T>(lightValue: T, darkValue: T): T => {
  const isDark = useIsDarkMode();
  return isDark ? darkValue : lightValue;
};

// Utility to check if device supports dark mode
export const supportsDarkMode = (): boolean => {
  // React Native's Appearance API supports dark mode on:
  // - iOS 13+
  // - Android 10+ (API 29+)
  return Appearance.getColorScheme() !== null;
};

// Utility to get initial theme with fallback
export const getInitialTheme = (fallback: 'light' | 'dark' = 'light'): 'light' | 'dark' => {
  const systemTheme = Appearance.getColorScheme();
  if (systemTheme === 'dark' || systemTheme === 'light') {
    return systemTheme;
  }
  return fallback;
};

// Hook for responsive theme detection with debouncing
export const useDebouncedSystemTheme = (delay: number = 300) => {
  const [debouncedTheme, setDebouncedTheme] = useState<ColorSchemeName>(systemThemeManager.getSystemTheme());
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = systemThemeManager.subscribe((theme) => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout
      const id = setTimeout(() => {
        setDebouncedTheme(theme);
      }, delay);

      setTimeoutId(id);
    });

    return () => {
      unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  return debouncedTheme;
};

// Export default manager
export default systemThemeManager;
