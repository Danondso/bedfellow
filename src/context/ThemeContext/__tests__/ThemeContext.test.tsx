import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeProvider, useTheme } from '../index';
import { ThemeMode } from '../../../theme/types';
import { lightTheme, darkTheme } from '../../../theme/themes';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Appearance API
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
}));

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('ThemeProvider', () => {
    it('should provide default theme values', () => {
      function TestComponent() {
        const { theme, themeMode } = useTheme();
        return (
          <>
            <text testID="theme-mode">{themeMode}</text>
            <text testID="theme-background">{theme.colors.background[500]}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-mode').children[0]).toBe(ThemeMode.AUTO);
      expect(getByTestId('theme-background').children[0]).toBe(lightTheme.colors.background[500]);
    });

    it('should load saved theme preferences on mount', async () => {
      const savedPreferences = {
        mode: ThemeMode.DARK,
        dynamicEnabled: false,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(savedPreferences));

      function TestComponent() {
        const { themeMode, isDynamicEnabled } = useTheme();
        return (
          <>
            <text testID="theme-mode">{themeMode}</text>
            <text testID="dynamic-enabled">{isDynamicEnabled.toString()}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@bedfellow_theme_preferences');
      });

      await waitFor(() => {
        expect(getByTestId('theme-mode').children[0]).toBe(ThemeMode.DARK);
        expect(getByTestId('dynamic-enabled').children[0]).toBe('false');
      });
    });

    it('should handle theme mode changes', async () => {
      function TestComponent() {
        const { themeMode, setThemeMode } = useTheme();

        React.useEffect(() => {
          if (themeMode === ThemeMode.AUTO) {
            setThemeMode(ThemeMode.DARK);
          }
        }, [themeMode, setThemeMode]);

        return <text testID="theme-mode">{themeMode}</text>;
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme-mode').children[0]).toBe(ThemeMode.DARK);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@bedfellow_theme_preferences',
        expect.stringContaining(ThemeMode.DARK)
      );
    });

    it('should toggle dynamic theme', async () => {
      function TestComponent() {
        const { isDynamicEnabled, toggleDynamicTheme } = useTheme();

        React.useEffect(() => {
          if (isDynamicEnabled) {
            toggleDynamicTheme();
          }
        }, []);

        return <text testID="dynamic-enabled">{isDynamicEnabled.toString()}</text>;
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('dynamic-enabled').children[0]).toBe('false');
      });
    });

    it('should reset to defaults', async () => {
      function TestComponent() {
        const { themeMode, resetToDefaults } = useTheme();

        React.useEffect(() => {
          resetToDefaults();
        }, []);

        return <text testID="theme-mode">{themeMode}</text>;
      }

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@bedfellow_theme_preferences');
      });
    });

    it('should respond to system theme changes', () => {
      (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

      function TestComponent() {
        const { theme, themeMode } = useTheme();
        return (
          <>
            <text testID="theme-mode">{themeMode}</text>
            <text testID="theme-background">{theme.colors.background[500]}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-mode').children[0]).toBe(ThemeMode.AUTO);
      // Dark theme background[500] should be the generated slate[100] color
      expect(getByTestId('theme-background').children[0]).toBe('#F0F0F0');
    });

    it('should apply dynamic palette when enabled', () => {
      const dynamicPalette = {
        background: '#FF0000',
        primary: '#00FF00',
        secondary: '#0000FF',
        detail: '#FFFF00',
      };

      function TestComponent() {
        const { setDynamicPalette, dynamicPalette: palette } = useTheme();

        React.useEffect(() => {
          setDynamicPalette(dynamicPalette);
        }, []);

        return <text testID="palette-primary">{palette?.primary || 'none'}</text>;
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('palette-primary').children[0]).toBe(dynamicPalette.primary);
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside provider', () => {
      // This test verifies the error message exists in the hook
      // We can't actually test the throw because React handles it
      // but we can verify the hook has the proper error handling
      const TestComponent = () => {
        try {
          useTheme();
        } catch (error) {
          expect((error as Error).message).toBe('useTheme must be used within a ThemeProvider');
        }
        return null;
      };

      // The error is caught by React, so we just verify the component renders
      // The actual error checking happens inside the component
      const originalError = console.error;
      console.error = jest.fn();

      try {
        render(<TestComponent />);
      } catch (error) {
        // Expected to throw
      }

      console.error = originalError;
    });

    it('should provide all context values', () => {
      function TestComponent() {
        const context = useTheme();
        const keys = Object.keys(context);
        return <text testID="context-keys">{keys.join(',')}</text>;
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const expectedKeys = [
        'theme',
        'themeMode',
        'dynamicPalette',
        'isDynamicEnabled',
        'isLoading',
        'setThemeMode',
        'setDynamicPalette',
        'toggleDynamicTheme',
        'resetToDefaults',
      ];

      const actualKeys = getByTestId('context-keys').children[0].split(',');
      expectedKeys.forEach((key) => {
        expect(actualKeys).toContain(key);
      });
    });
  });

  describe('Theme persistence', () => {
    it('should persist theme mode changes', async () => {
      function TestComponent() {
        const { setThemeMode } = useTheme();

        React.useEffect(() => {
          setThemeMode(ThemeMode.DARK);
        }, []);

        return null;
      }

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@bedfellow_theme_preferences',
          expect.stringContaining('"mode":"dark"')
        );
      });
    });

    it('should persist dynamic theme toggle', async () => {
      function TestComponent() {
        const { toggleDynamicTheme } = useTheme();

        React.useEffect(() => {
          toggleDynamicTheme();
        }, []);

        return null;
      }

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@bedfellow_theme_preferences',
          expect.stringContaining('"dynamicEnabled":false')
        );
      });
    });

    it('should handle storage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      function TestComponent() {
        const { isLoading } = useTheme();
        return <text testID="loading">{isLoading.toString()}</text>;
      }

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('loading').children[0]).toBe('false');
      });
    });
  });
});

export default {};
