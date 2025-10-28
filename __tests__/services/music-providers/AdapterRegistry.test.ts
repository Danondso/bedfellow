import { adapterRegistry } from '@services/music-providers/AdapterRegistry';
import { MusicProviderId, MusicProviderAdapter } from '@services/music-providers/types';

// Mock dependencies
jest.mock('react-native-app-auth', () => ({ authorize: jest.fn() }));
jest.mock('axios', () => ({ post: jest.fn() }));
jest.mock('react-native-config', () => ({
  SPOTIFY_CLIENT_ID: 'client-id',
  SPOTIFY_REDIRECT_URI: 'app://callback',
  SPOTIFY_REDIRECT_URI_ANDROID: 'app://android-callback',
  BEDFELLOW_API_BASE_URL: 'https://api.example.com',
}));
jest.mock('@services/spotify/SpotifyAPI.service', () => ({
  performPlaybackAction: jest.fn(),
  spotifyGETData: jest.fn(),
  spotifyPOSTData: jest.fn(),
}));

describe('AdapterRegistry', () => {
  const mockGetSession = jest.fn();

  const createMockAdapter = (id: MusicProviderId): MusicProviderAdapter => ({
    id,
    displayName: `Mock ${id}`,
    capabilities: {
      playback: true,
      queue: true,
      search: true,
      profile: true,
    },
    auth: {
      authorize: jest.fn(),
      refresh: jest.fn(),
      revoke: jest.fn(),
    },
    playback: {
      play: jest.fn(),
      pause: jest.fn(),
      skipNext: jest.fn(),
      skipPrevious: jest.fn(),
    },
    queue: {
      add: jest.fn(),
      getQueue: jest.fn(),
    },
    search: {
      searchTracks: jest.fn(),
    },
    profile: {
      getCurrentUser: jest.fn(),
    },
  });

  beforeEach(() => {
    // Clear the registry before each test
    adapterRegistry.clear();
    mockGetSession.mockReset();
  });

  describe('initialization', () => {
    it('should not be initialized by default', () => {
      expect(adapterRegistry.initialized).toBe(false);
    });

    it('should initialize with default adapters', () => {
      adapterRegistry.initialize(mockGetSession);

      expect(adapterRegistry.initialized).toBe(true);
      expect(adapterRegistry.has(MusicProviderId.Spotify)).toBe(true);
      expect(adapterRegistry.has(MusicProviderId.YouTubeMusic)).toBe(true);
    });

    it('should not re-initialize if already initialized', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      adapterRegistry.initialize(mockGetSession);
      expect(adapterRegistry.initialized).toBe(true);

      adapterRegistry.initialize(mockGetSession);
      expect(consoleWarnSpy).toHaveBeenCalledWith('AdapterRegistry already initialized. Skipping re-initialization.');

      consoleWarnSpy.mockRestore();
    });

    it('should create Spotify adapter with getSession callback', () => {
      adapterRegistry.initialize(mockGetSession);

      const spotifyAdapter = adapterRegistry.get(MusicProviderId.Spotify);
      expect(spotifyAdapter).toBeDefined();
      expect(spotifyAdapter?.id).toBe(MusicProviderId.Spotify);
      expect(spotifyAdapter?.displayName).toBe('Spotify');
    });

    it('should create not-implemented adapters for unsupported providers', () => {
      adapterRegistry.initialize(mockGetSession);

      const youtubeAdapter = adapterRegistry.get(MusicProviderId.YouTubeMusic);
      expect(youtubeAdapter).toBeDefined();
      expect(youtubeAdapter?.id).toBe(MusicProviderId.YouTubeMusic);
      expect(youtubeAdapter?.displayName).toBe('YouTube Music');
      expect(youtubeAdapter?.capabilities.playback).toBe(false);
    });
  });

  describe('register', () => {
    it('should register a custom adapter', () => {
      const customAdapter = createMockAdapter(MusicProviderId.Spotify);

      adapterRegistry.register(MusicProviderId.Spotify, customAdapter);

      const retrieved = adapterRegistry.get(MusicProviderId.Spotify);
      expect(retrieved).toBe(customAdapter);
    });

    it('should allow overriding existing adapters', () => {
      adapterRegistry.initialize(mockGetSession);

      const originalAdapter = adapterRegistry.get(MusicProviderId.Spotify);
      const customAdapter = createMockAdapter(MusicProviderId.Spotify);

      adapterRegistry.register(MusicProviderId.Spotify, customAdapter);

      const retrieved = adapterRegistry.get(MusicProviderId.Spotify);
      expect(retrieved).not.toBe(originalAdapter);
      expect(retrieved).toBe(customAdapter);
    });
  });

  describe('unregister', () => {
    it('should unregister an adapter', () => {
      const customAdapter = createMockAdapter(MusicProviderId.Spotify);
      adapterRegistry.register(MusicProviderId.Spotify, customAdapter);

      expect(adapterRegistry.has(MusicProviderId.Spotify)).toBe(true);

      adapterRegistry.unregister(MusicProviderId.Spotify);

      expect(adapterRegistry.has(MusicProviderId.Spotify)).toBe(false);
      expect(adapterRegistry.get(MusicProviderId.Spotify)).toBeUndefined();
    });

    it('should handle unregistering non-existent adapter gracefully', () => {
      expect(() => {
        adapterRegistry.unregister(MusicProviderId.Spotify);
      }).not.toThrow();

      expect(adapterRegistry.has(MusicProviderId.Spotify)).toBe(false);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      adapterRegistry.initialize(mockGetSession);
    });

    it('should get an adapter by ID', () => {
      const adapter = adapterRegistry.get(MusicProviderId.Spotify);

      expect(adapter).toBeDefined();
      expect(adapter?.id).toBe(MusicProviderId.Spotify);
    });

    it('should return undefined for non-existent adapter', () => {
      adapterRegistry.clear();

      const adapter = adapterRegistry.get(MusicProviderId.Spotify);

      expect(adapter).toBeUndefined();
    });
  });

  describe('getAll', () => {
    beforeEach(() => {
      adapterRegistry.initialize(mockGetSession);
    });

    it('should return all registered adapters', () => {
      const adapters = adapterRegistry.getAll();

      expect(adapters.length).toBeGreaterThan(0);
      expect(adapters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: MusicProviderId.Spotify }),
          expect.objectContaining({ id: MusicProviderId.YouTubeMusic }),
        ])
      );
    });

    it('should return empty array when no adapters registered', () => {
      adapterRegistry.clear();

      const adapters = adapterRegistry.getAll();

      expect(adapters).toEqual([]);
    });

    it('should return a new array each time', () => {
      const adapters1 = adapterRegistry.getAll();
      const adapters2 = adapterRegistry.getAll();

      expect(adapters1).not.toBe(adapters2);
      expect(adapters1).toEqual(adapters2);
    });
  });

  describe('has', () => {
    beforeEach(() => {
      adapterRegistry.initialize(mockGetSession);
    });

    it('should return true for registered adapter', () => {
      expect(adapterRegistry.has(MusicProviderId.Spotify)).toBe(true);
    });

    it('should return false for non-existent adapter', () => {
      adapterRegistry.clear();

      expect(adapterRegistry.has(MusicProviderId.Spotify)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all adapters', () => {
      adapterRegistry.initialize(mockGetSession);

      expect(adapterRegistry.getAll().length).toBeGreaterThan(0);
      expect(adapterRegistry.initialized).toBe(true);

      adapterRegistry.clear();

      expect(adapterRegistry.getAll()).toEqual([]);
      expect(adapterRegistry.initialized).toBe(false);
    });

    it('should allow re-initialization after clear', () => {
      adapterRegistry.initialize(mockGetSession);
      adapterRegistry.clear();

      expect(adapterRegistry.initialized).toBe(false);

      adapterRegistry.initialize(mockGetSession);

      expect(adapterRegistry.initialized).toBe(true);
      expect(adapterRegistry.has(MusicProviderId.Spotify)).toBe(true);
    });
  });

  describe('singleton behavior', () => {
    it('should maintain state across imports', () => {
      const customAdapter = createMockAdapter(MusicProviderId.Spotify);
      adapterRegistry.register(MusicProviderId.Spotify, customAdapter);

      // Re-import to simulate usage from different files
      const { adapterRegistry: reimportedRegistry } = require('@services/music-providers/AdapterRegistry');

      const retrieved = reimportedRegistry.get(MusicProviderId.Spotify);
      expect(retrieved).toBe(customAdapter);
    });
  });

  describe('integration with getSession callback', () => {
    it('should pass getSession callback to Spotify adapter', () => {
      const mockSession = {
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        scopes: ['user-read-playback-state'],
      };

      mockGetSession.mockReturnValue(mockSession);

      adapterRegistry.initialize(mockGetSession);

      const spotifyAdapter = adapterRegistry.get(MusicProviderId.Spotify);
      expect(spotifyAdapter).toBeDefined();

      // The adapter should use the getSession callback internally
      // This is verified by the adapter's own tests
    });
  });
});
