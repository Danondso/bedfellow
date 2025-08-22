import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeService from '../ThemeService';
import { ThemeMode } from '../../../theme/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('ThemeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('loadThemePreferences', () => {
    it('should load saved theme preferences', async () => {
      const savedPreferences = {
        mode: ThemeMode.DARK,
        dynamicEnabled: false,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(savedPreferences));

      const preferences = await ThemeService.loadThemePreferences();

      expect(preferences).toEqual(savedPreferences);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@bedfellow_theme_preferences');
    });

    it('should return null when no preferences are saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const preferences = await ThemeService.loadThemePreferences();

      expect(preferences).toBeNull();
    });

    it('should handle invalid JSON gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const preferences = await ThemeService.loadThemePreferences();

      expect(preferences).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle storage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const preferences = await ThemeService.loadThemePreferences();

      expect(preferences).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load theme preferences:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('saveThemePreferences', () => {
    it('should save theme preferences', async () => {
      const preferences = {
        mode: ThemeMode.DARK,
        dynamicEnabled: true,
      };

      const result = await ThemeService.saveThemePreferences(preferences);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@bedfellow_theme_preferences', JSON.stringify(preferences));
    });

    it('should handle save errors', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Save error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ThemeService.saveThemePreferences({
        mode: ThemeMode.LIGHT,
        dynamicEnabled: false,
      });

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save theme preferences:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('clearThemePreferences', () => {
    it('should clear theme preferences', async () => {
      const result = await ThemeService.clearThemePreferences();

      expect(result).toBe(true);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@bedfellow_theme_preferences');
    });

    it('should handle clear errors', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Clear error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await ThemeService.clearThemePreferences();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear theme preferences:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('Theme history', () => {
    beforeEach(() => {
      // Reset theme history
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@bedfellow_theme_history') {
          return Promise.resolve(null);
        }
        return Promise.resolve(null);
      });
    });

    describe('addToThemeHistory', () => {
      it('should add theme to history', async () => {
        await ThemeService.addToThemeHistory(ThemeMode.DARK);

        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@bedfellow_theme_history');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@bedfellow_theme_history',
          expect.stringContaining(ThemeMode.DARK)
        );
      });

      it('should maintain history limit', async () => {
        const existingHistory = new Array(20).fill(ThemeMode.LIGHT);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingHistory));

        await ThemeService.addToThemeHistory(ThemeMode.DARK);

        const savedHistory = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
        const parsed = JSON.parse(savedHistory);

        expect(parsed).toHaveLength(20);
        expect(parsed[0]).toBe(ThemeMode.DARK);
      });
    });

    describe('getThemeHistory', () => {
      it('should return theme history', async () => {
        const history = [ThemeMode.DARK, ThemeMode.LIGHT, ThemeMode.AUTO];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(history));

        const result = await ThemeService.getThemeHistory();

        expect(result).toEqual(history);
      });

      it('should return empty array when no history exists', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const result = await ThemeService.getThemeHistory();

        expect(result).toEqual([]);
      });
    });

    describe('getMostUsedTheme', () => {
      it('should return most frequently used theme', async () => {
        const history = [ThemeMode.DARK, ThemeMode.DARK, ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.AUTO];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(history));

        const result = await ThemeService.getMostUsedTheme();

        expect(result).toBe(ThemeMode.DARK);
      });

      it('should return null when no history exists', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const result = await ThemeService.getMostUsedTheme();

        expect(result).toBeNull();
      });

      it('should handle ties by returning the most recent', async () => {
        const history = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.LIGHT, ThemeMode.DARK];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(history));

        const result = await ThemeService.getMostUsedTheme();

        // Should return DARK as it appears most recently among tied themes
        expect(result).toBe(ThemeMode.DARK);
      });
    });

    describe('clearThemeHistory', () => {
      it('should clear theme history', async () => {
        await ThemeService.clearThemeHistory();

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@bedfellow_theme_history');
      });
    });
  });

  describe('isFirstTimeUser', () => {
    it('should return true for first time users', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await ThemeService.isFirstTimeUser();

      expect(result).toBe(true);
    });

    it('should return false for returning users', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ mode: ThemeMode.LIGHT, dynamicEnabled: true })
      );

      const result = await ThemeService.isFirstTimeUser();

      expect(result).toBe(false);
    });

    it('should mark user as not first time', async () => {
      await ThemeService.markNotFirstTimeUser();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@bedfellow_theme_preferences',
        expect.stringContaining(ThemeMode.AUTO)
      );
    });
  });

  describe('getDefaultThemeForTimeOfDay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return light theme during day hours', () => {
      const date = new Date('2024-01-01T14:00:00');
      jest.setSystemTime(date);

      const result = ThemeService.getDefaultThemeForTimeOfDay();

      expect(result).toBe(ThemeMode.LIGHT);
    });

    it('should return dark theme during night hours', () => {
      const date = new Date('2024-01-01T22:00:00');
      jest.setSystemTime(date);

      const result = ThemeService.getDefaultThemeForTimeOfDay();

      expect(result).toBe(ThemeMode.DARK);
    });

    it('should return dark theme during early morning', () => {
      const date = new Date('2024-01-01T04:00:00');
      jest.setSystemTime(date);

      const result = ThemeService.getDefaultThemeForTimeOfDay();

      expect(result).toBe(ThemeMode.DARK);
    });
  });

  describe('Migration', () => {
    it('should migrate old theme data', async () => {
      const oldData = {
        selectedTheme: 'dark',
        useDynamicColors: true,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@old_theme_key') {
          return Promise.resolve(JSON.stringify(oldData));
        }
        return Promise.resolve(null);
      });

      await ThemeService.migrateOldThemeData('@old_theme_key');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@bedfellow_theme_preferences',
        expect.stringContaining('"mode":"dark"')
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@old_theme_key');
    });

    it('should handle migration errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Migration error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await ThemeService.migrateOldThemeData('@old_theme_key');

      expect(consoleSpy).toHaveBeenCalledWith('Failed to migrate old theme data:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});

export default {};
