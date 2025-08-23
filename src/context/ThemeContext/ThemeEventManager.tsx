import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Appearance, ColorSchemeName, NativeEventSubscription } from 'react-native';
import { ThemeMode } from '../../theme/types';
import ThemeService from '../../services/theme/ThemeService';

// Event types for theme changes
export type ThemeChangeEvent = {
  type: 'system' | 'manual' | 'auto';
  from: ThemeMode | ColorSchemeName;
  to: ThemeMode | ColorSchemeName;
  timestamp: number;
};

// Callback type for theme change listeners
export type ThemeChangeListener = (event: ThemeChangeEvent) => void;

/**
 * ThemeEventManager handles all theme-related events including:
 * - System theme changes
 * - App state changes (foreground/background)
 * - Manual theme switches
 * - Auto theme updates based on time
 */
class ThemeEventManager {
  private static instance: ThemeEventManager;

  private listeners: Set<ThemeChangeListener> = new Set();

  private systemThemeSubscription: NativeEventSubscription | null = null;

  private appStateSubscription: NativeEventSubscription | null = null;

  private lastSystemTheme: ColorSchemeName = null;

  private lastThemeMode: ThemeMode | null = null;

  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): ThemeEventManager {
    if (!ThemeEventManager.instance) {
      ThemeEventManager.instance = new ThemeEventManager();
    }
    return ThemeEventManager.instance;
  }

  private initialize() {
    if (this.isInitialized) return;

    // Listen for system theme changes
    this.setupSystemThemeListener();

    // Listen for app state changes
    this.setupAppStateListener();

    // Store initial values
    this.lastSystemTheme = Appearance.getColorScheme();

    this.isInitialized = true;
  }

  private setupSystemThemeListener() {
    this.systemThemeSubscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme !== this.lastSystemTheme) {
        this.handleSystemThemeChange(this.lastSystemTheme, colorScheme);
        this.lastSystemTheme = colorScheme;
      }
    });
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      this.handleAppStateChange(nextAppState);
    });
  }

  private handleSystemThemeChange(from: ColorSchemeName, to: ColorSchemeName) {
    const event: ThemeChangeEvent = {
      type: 'system',
      from: from || 'light',
      to: to || 'light',
      timestamp: Date.now(),
    };

    // Notify all listeners
    this.notifyListeners(event);

    // Log theme change for analytics
    this.logThemeChange(event);
  }

  private handleAppStateChange(nextAppState: AppStateStatus) {
    if (nextAppState === 'active') {
      // App came to foreground, check if system theme changed while in background
      const currentSystemTheme = Appearance.getColorScheme();
      if (currentSystemTheme !== this.lastSystemTheme) {
        this.handleSystemThemeChange(this.lastSystemTheme, currentSystemTheme);
        this.lastSystemTheme = currentSystemTheme;
      }
    }
  }

  public handleManualThemeChange(from: ThemeMode, to: ThemeMode) {
    const event: ThemeChangeEvent = {
      type: 'manual',
      from,
      to,
      timestamp: Date.now(),
    };

    this.lastThemeMode = to;
    this.notifyListeners(event);
    this.logThemeChange(event);

    // Save to history
    ThemeService.addToThemeHistory(to);
  }

  private notifyListeners(event: ThemeChangeEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        // Error occurred: 'Error in theme change listener:', error
      }
    });
  }

  private logThemeChange(_event: ThemeChangeEvent) {}

  public addEventListener(listener: ThemeChangeListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  public removeEventListener(listener: ThemeChangeListener) {
    this.listeners.delete(listener);
  }

  public destroy() {
    // Clean up subscriptions
    this.systemThemeSubscription?.remove();
    this.appStateSubscription?.remove();

    // Clear listeners
    this.listeners.clear();

    this.isInitialized = false;
  }

  // Get current system theme
  public getCurrentSystemTheme(): ColorSchemeName {
    return Appearance.getColorScheme();
  }

  // Force refresh system theme
  public refreshSystemTheme() {
    const currentTheme = Appearance.getColorScheme();
    if (currentTheme !== this.lastSystemTheme) {
      this.handleSystemThemeChange(this.lastSystemTheme, currentTheme);
      this.lastSystemTheme = currentTheme;
    }
  }
}

// Export singleton instance
export const themeEventManager = ThemeEventManager.getInstance();

// Hook to listen for theme changes
export const useThemeChangeListener = (callback: ThemeChangeListener, deps: React.DependencyList = []) => {
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const listener: ThemeChangeListener = (event) => {
      callbackRef.current(event);
    };

    const unsubscribe = themeEventManager.addEventListener(listener);

    return unsubscribe;
  }, deps);
};

// Hook to track theme change events
export const useThemeEvents = () => {
  const [events, setEvents] = React.useState<ThemeChangeEvent[]>([]);

  useThemeChangeListener((event) => {
    setEvents((prev) => [...prev, event].slice(-10)); // Keep last 10 events
  });

  return events;
};

// Hook to detect if system supports dark mode
export const useSystemDarkModeSupport = () => {
  const [isSupported, setIsSupported] = React.useState(false);

  useEffect(() => {
    // Check if system theme changes are supported
    const checkSupport = () => {
      const theme = Appearance.getColorScheme();
      setIsSupported(theme !== null);
    };

    checkSupport();

    const subscription = Appearance.addChangeListener(() => {
      checkSupport();
    });

    return () => subscription?.remove();
  }, []);

  return isSupported;
};

// Hook to sync with system theme
export const useSyncWithSystemTheme = (enabled: boolean = true) => {
  const [systemTheme, setSystemTheme] = React.useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    if (!enabled) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, [enabled]);

  return systemTheme;
};

export default themeEventManager;
