import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, ThemePreference, DynamicPalette } from '../../theme/types';

// Storage keys
const STORAGE_KEYS = {
  THEME_PREFERENCES: '@bedfellow_theme_preferences',
  DYNAMIC_PALETTE_CACHE: '@bedfellow_dynamic_palette_cache',
  THEME_HISTORY: '@bedfellow_theme_history',
} as const;

// Cache duration for dynamic palettes (24 hours)
const PALETTE_CACHE_DURATION = 24 * 60 * 60 * 1000;

interface PaletteCacheEntry {
  palette: DynamicPalette;
  imageUrl: string;
  timestamp: number;
}

interface ThemeHistory {
  mode: ThemeMode;
  timestamp: number;
}

class ThemeService {
  private static instance: ThemeService;

  private paletteCache: Map<string, PaletteCacheEntry> = new Map();

  private constructor() {
    this.loadPaletteCache();
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  // Theme Preferences Management
  async saveThemePreferences(preferences: ThemePreference): Promise<void> {
    try {
      const jsonValue = JSON.stringify(preferences);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCES, jsonValue);

      // Also save to history
      await this.addToThemeHistory(preferences.mode);
    } catch (error) {
      console.error('Failed to save theme preferences:', error);
      throw error;
    }
  }

  async loadThemePreferences(): Promise<ThemePreference | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCES);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      return null;
    } catch (error) {
      console.error('Failed to load theme preferences:', error);
      return null;
    }
  }

  async clearThemePreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.THEME_PREFERENCES);
    } catch (error) {
      console.error('Failed to clear theme preferences:', error);
      throw error;
    }
  }

  // Dynamic Palette Cache Management
  async savePaletteToCache(imageUrl: string, palette: DynamicPalette): Promise<void> {
    try {
      const cacheEntry: PaletteCacheEntry = {
        palette,
        imageUrl,
        timestamp: Date.now(),
      };

      // Add to memory cache
      this.paletteCache.set(imageUrl, cacheEntry);

      // Save to AsyncStorage
      const cache = await this.loadPaletteCache();
      cache.set(imageUrl, cacheEntry);

      // Clean old entries
      this.cleanPaletteCache(cache);

      // Save updated cache
      const cacheArray = Array.from(cache.entries());
      await AsyncStorage.setItem(STORAGE_KEYS.DYNAMIC_PALETTE_CACHE, JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Failed to save palette to cache:', error);
    }
  }

  async getPaletteFromCache(imageUrl: string): Promise<DynamicPalette | null> {
    try {
      // Check memory cache first
      const memoryCacheEntry = this.paletteCache.get(imageUrl);
      if (memoryCacheEntry && this.isPaletteCacheValid(memoryCacheEntry)) {
        return memoryCacheEntry.palette;
      }

      // Check AsyncStorage cache
      const cache = await this.loadPaletteCache();
      const entry = cache.get(imageUrl);

      if (entry && this.isPaletteCacheValid(entry)) {
        // Add to memory cache for faster access
        this.paletteCache.set(imageUrl, entry);
        return entry.palette;
      }

      return null;
    } catch (error) {
      console.error('Failed to get palette from cache:', error);
      return null;
    }
  }

  private async loadPaletteCache(): Promise<Map<string, PaletteCacheEntry>> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.DYNAMIC_PALETTE_CACHE);
      if (jsonValue != null) {
        const cacheArray = JSON.parse(jsonValue);
        const cache = new Map<string, PaletteCacheEntry>(cacheArray);

        // Update memory cache
        this.paletteCache = cache;
        return cache;
      }
      return new Map();
    } catch (error) {
      console.error('Failed to load palette cache:', error);
      return new Map();
    }
  }

  private cleanPaletteCache(cache: Map<string, PaletteCacheEntry>): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];

    cache.forEach((entry, key) => {
      if (!this.isPaletteCacheValid(entry)) {
        entriesToDelete.push(key);
      }
    });

    entriesToDelete.forEach((key) => cache.delete(key));

    // Also limit cache size to 100 entries
    if (cache.size > 100) {
      const sortedEntries = Array.from(cache.entries()).sort((a, b) => b[1].timestamp - a[1].timestamp);

      const entriesToKeep = sortedEntries.slice(0, 100);
      cache.clear();
      entriesToKeep.forEach(([key, value]) => cache.set(key, value));
    }
  }

  private isPaletteCacheValid(entry: PaletteCacheEntry): boolean {
    const age = Date.now() - entry.timestamp;
    return age < PALETTE_CACHE_DURATION;
  }

  async clearPaletteCache(): Promise<void> {
    try {
      this.paletteCache.clear();
      await AsyncStorage.removeItem(STORAGE_KEYS.DYNAMIC_PALETTE_CACHE);
    } catch (error) {
      console.error('Failed to clear palette cache:', error);
      throw error;
    }
  }

  // Theme History Management
  async addToThemeHistory(mode: ThemeMode): Promise<void> {
    try {
      const history = await this.getThemeHistory();
      history.push({
        mode,
        timestamp: Date.now(),
      });

      // Keep only last 50 entries
      const recentHistory = history.slice(-50);

      await AsyncStorage.setItem(STORAGE_KEYS.THEME_HISTORY, JSON.stringify(recentHistory));
    } catch (error) {
      console.error('Failed to add to theme history:', error);
    }
  }

  async getThemeHistory(): Promise<ThemeHistory[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.THEME_HISTORY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      return [];
    } catch (error) {
      console.error('Failed to get theme history:', error);
      return [];
    }
  }

  async getMostUsedTheme(): Promise<ThemeMode | null> {
    try {
      const history = await this.getThemeHistory();
      if (history.length === 0) return null;

      // Count occurrences of each theme mode
      const counts = history.reduce(
        (acc, entry) => {
          acc[entry.mode] = (acc[entry.mode] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Find the most used theme
      let maxCount = 0;
      let mostUsed: ThemeMode | null = null;

      Object.entries(counts).forEach(([mode, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostUsed = mode as ThemeMode;
        }
      });

      return mostUsed;
    } catch (error) {
      console.error('Failed to get most used theme:', error);
      return null;
    }
  }

  // Migration utilities
  async migrateFromOldStorage(): Promise<void> {
    try {
      // Check for old storage keys (if any exist from previous versions)
      const oldKeys = ['@theme_mode', '@dynamic_enabled', '@custom_accent'];

      for (const key of oldKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          // Migrate old data to new format
          // This is a placeholder - implement based on actual old format
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Failed to migrate old storage:', error);
    }
  }

  // Clear all theme data
  async clearAllThemeData(): Promise<void> {
    try {
      await Promise.all([
        this.clearThemePreferences(),
        this.clearPaletteCache(),
        AsyncStorage.removeItem(STORAGE_KEYS.THEME_HISTORY),
      ]);
    } catch (error) {
      console.error('Failed to clear all theme data:', error);
      throw error;
    }
  }

  // Export/Import theme settings (for backup/restore)
  async exportThemeSettings(): Promise<string> {
    try {
      const preferences = await this.loadThemePreferences();
      const history = await this.getThemeHistory();
      const cache = await this.loadPaletteCache();

      const exportData = {
        version: '1.0',
        timestamp: Date.now(),
        preferences,
        history,
        paletteCache: Array.from(cache.entries()),
      };

      return JSON.stringify(exportData);
    } catch (error) {
      console.error('Failed to export theme settings:', error);
      throw error;
    }
  }

  async importThemeSettings(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);

      // Validate version compatibility
      if (data.version !== '1.0') {
        throw new Error('Incompatible theme settings version');
      }

      // Import preferences
      if (data.preferences) {
        await this.saveThemePreferences(data.preferences);
      }

      // Import history
      if (data.history) {
        await AsyncStorage.setItem(STORAGE_KEYS.THEME_HISTORY, JSON.stringify(data.history));
      }

      // Import palette cache
      if (data.paletteCache) {
        await AsyncStorage.setItem(STORAGE_KEYS.DYNAMIC_PALETTE_CACHE, JSON.stringify(data.paletteCache));
      }
    } catch (error) {
      console.error('Failed to import theme settings:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default ThemeService.getInstance();
