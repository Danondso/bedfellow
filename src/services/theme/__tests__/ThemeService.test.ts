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

      const preferences = await ThemeService.loadThemePreferences();

      expect(preferences).toBeNull();
    });

    it('should handle storage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const preferences = await ThemeService.loadThemePreferences();

      expect(preferences).toBeNull();
    });
  });

  describe('saveThemePreferences', () => {
    it('should save theme preferences', async () => {
      const preferences = {
        mode: ThemeMode.DARK,
        dynamicEnabled: true,
      };

      await ThemeService.saveThemePreferences(preferences);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@bedfellow_theme_preferences', JSON.stringify(preferences));
    });

    it('should handle save errors', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Save error'));

      await expect(
        ThemeService.saveThemePreferences({
          mode: ThemeMode.LIGHT,
          dynamicEnabled: false,
        })
      ).rejects.toThrow('Save error');
    });
  });

  describe('clearThemePreferences', () => {
    it('should clear theme preferences', async () => {
      await ThemeService.clearThemePreferences();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@bedfellow_theme_preferences');
    });

    it('should handle clear errors', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Clear error'));

      await expect(ThemeService.clearThemePreferences()).rejects.toThrow('Clear error');
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
        const existingHistory = Array.from({ length: 50 }, (_, i) => ({
          mode: ThemeMode.LIGHT,
          timestamp: Date.now() - i * 1000,
        }));
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingHistory));

        await ThemeService.addToThemeHistory(ThemeMode.DARK);

        const savedHistory = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
        const parsed = JSON.parse(savedHistory);

        expect(parsed).toHaveLength(50);
        expect(parsed[49].mode).toBe(ThemeMode.DARK);
      });
    });

    describe('getThemeHistory', () => {
      it('should return theme history', async () => {
        const history = [
          { mode: ThemeMode.DARK, timestamp: Date.now() },
          { mode: ThemeMode.LIGHT, timestamp: Date.now() - 1000 },
          { mode: ThemeMode.AUTO, timestamp: Date.now() - 2000 },
        ];
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
        const history = [
          { mode: ThemeMode.DARK, timestamp: Date.now() },
          { mode: ThemeMode.DARK, timestamp: Date.now() - 1000 },
          { mode: ThemeMode.LIGHT, timestamp: Date.now() - 2000 },
          { mode: ThemeMode.DARK, timestamp: Date.now() - 3000 },
          { mode: ThemeMode.AUTO, timestamp: Date.now() - 4000 },
        ];
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
        const history = [
          { mode: ThemeMode.LIGHT, timestamp: Date.now() - 3000 },
          { mode: ThemeMode.DARK, timestamp: Date.now() - 2000 },
          { mode: ThemeMode.LIGHT, timestamp: Date.now() - 1000 },
          { mode: ThemeMode.DARK, timestamp: Date.now() },
        ];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(history));

        const result = await ThemeService.getMostUsedTheme();

        // Should return DARK as it appears most recently among tied themes
        expect(result).toBe(ThemeMode.DARK);
      });
    });
  });
});

export default {};
