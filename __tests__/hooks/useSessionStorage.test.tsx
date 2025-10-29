import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSessionStorage, MUSIC_PROVIDER_STORAGE_KEYS } from '@hooks/useSessionStorage';
import { MusicProviderId, ProviderAuthSession } from '@services/music-providers/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('useSessionStorage', () => {
  const mockSession: ProviderAuthSession = {
    accessToken: 'test-token',
    refreshToken: 'test-refresh',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    scopes: ['user-read-playback-state'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('hydration', () => {
    it('should hydrate sessions from AsyncStorage on mount', async () => {
      const storedSessions = {
        [MusicProviderId.Spotify]: mockSession,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedSessions));

      const { result } = renderHook(() => useSessionStorage());

      expect(result.current.isHydrated).toBe(false);

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.sessions).toEqual(storedSessions);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(MUSIC_PROVIDER_STORAGE_KEYS.sessions);
    });

    it('should handle empty storage gracefully', async () => {
      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.sessions).toEqual({});
    });

    it('should handle corrupt JSON data gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{ invalid json }');

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.sessions).toEqual({});
    });

    it('should filter out invalid provider IDs during hydration', async () => {
      const storedData = {
        [MusicProviderId.Spotify]: mockSession,
        'invalid-provider': { accessToken: 'should-be-filtered' },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedData));

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.sessions).toEqual({
        [MusicProviderId.Spotify]: mockSession,
      });
      expect(result.current.sessions).not.toHaveProperty('invalid-provider');
    });
  });

  describe('setSession', () => {
    it('should set a session and persist to AsyncStorage', async () => {
      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      await act(async () => {
        await result.current.setSession(MusicProviderId.Spotify, mockSession);
      });

      expect(result.current.sessions[MusicProviderId.Spotify]).toEqual(mockSession);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        MUSIC_PROVIDER_STORAGE_KEYS.sessions,
        JSON.stringify({ [MusicProviderId.Spotify]: mockSession })
      );
    });

    it('should handle multiple rapid setSession calls without race conditions', async () => {
      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      const session1 = { ...mockSession, accessToken: 'token-1' };
      const session2 = { ...mockSession, accessToken: 'token-2' };
      const session3 = { ...mockSession, accessToken: 'token-3' };

      await act(async () => {
        // Fire off multiple updates rapidly
        const promises = [
          result.current.setSession(MusicProviderId.Spotify, session1),
          result.current.setSession(MusicProviderId.Spotify, session2),
          result.current.setSession(MusicProviderId.Spotify, session3),
        ];
        await Promise.all(promises);
      });

      // The last session should win
      expect(result.current.sessions[MusicProviderId.Spotify]).toEqual(session3);

      // AsyncStorage.setItem should be called 3 times (queued)
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
    });

    it('should set storageError when AsyncStorage fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage full'));

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      await act(async () => {
        await result.current.setSession(MusicProviderId.Spotify, mockSession);
      });

      expect(result.current.storageError).toBe('Unable to save login state. You may be logged out on app restart.');
    });

    it('should clear storageError after successful persistence', async () => {
      // First fail
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage full'));

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      await act(async () => {
        await result.current.setSession(MusicProviderId.Spotify, mockSession);
      });

      expect(result.current.storageError).not.toBeNull();

      // Now succeed
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await act(async () => {
        await result.current.setSession(MusicProviderId.Spotify, mockSession);
      });

      expect(result.current.storageError).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should clear a session by setting it to null', async () => {
      const storedSessions = {
        [MusicProviderId.Spotify]: mockSession,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedSessions));

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      await act(async () => {
        await result.current.clearSession(MusicProviderId.Spotify);
      });

      expect(result.current.sessions[MusicProviderId.Spotify]).toBeNull();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        MUSIC_PROVIDER_STORAGE_KEYS.sessions,
        JSON.stringify({ [MusicProviderId.Spotify]: null })
      );
    });
  });

  describe('getSession', () => {
    it('should get a session synchronously', async () => {
      const storedSessions = {
        [MusicProviderId.Spotify]: mockSession,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedSessions));

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      const session = result.current.getSession(MusicProviderId.Spotify);
      expect(session).toEqual(mockSession);
    });

    it('should return null for non-existent session', async () => {
      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      const session = result.current.getSession(MusicProviderId.Spotify);
      expect(session).toBeNull();
    });
  });

  describe('persistActiveProvider', () => {
    it('should persist active provider to AsyncStorage', async () => {
      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      await act(async () => {
        await result.current.persistActiveProvider(MusicProviderId.Spotify);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        MUSIC_PROVIDER_STORAGE_KEYS.activeProvider,
        MusicProviderId.Spotify
      );
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      // Should not throw
      await act(async () => {
        await expect(result.current.persistActiveProvider(MusicProviderId.Spotify)).resolves.not.toThrow();
      });
    });
  });

  describe('hydrateActiveProvider', () => {
    it('should hydrate active provider from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(null) // sessions
        .mockResolvedValueOnce(MusicProviderId.Spotify); // active provider

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      let activeProvider: MusicProviderId | null = null;
      await act(async () => {
        activeProvider = await result.current.hydrateActiveProvider();
      });

      expect(activeProvider).toBe(MusicProviderId.Spotify);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(MUSIC_PROVIDER_STORAGE_KEYS.activeProvider);
    });

    it('should return null for invalid provider ID', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(null) // sessions
        .mockResolvedValueOnce('invalid-provider'); // active provider

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      let activeProvider: MusicProviderId | null = MusicProviderId.Spotify;
      await act(async () => {
        activeProvider = await result.current.hydrateActiveProvider();
      });

      expect(activeProvider).toBeNull();
    });

    it('should return null when no active provider is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      let activeProvider: MusicProviderId | null = MusicProviderId.Spotify;
      await act(async () => {
        activeProvider = await result.current.hydrateActiveProvider();
      });

      expect(activeProvider).toBeNull();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(null) // sessions (initial hydration)
        .mockRejectedValueOnce(new Error('Storage error')); // active provider

      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      let activeProvider: MusicProviderId | null = MusicProviderId.Spotify;
      await act(async () => {
        activeProvider = await result.current.hydrateActiveProvider();
      });

      expect(activeProvider).toBeNull();
    });
  });

  describe('persistence queue', () => {
    it('should serialize persistence operations to prevent corruption', async () => {
      const { result } = renderHook(() => useSessionStorage());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      let callOrder: string[] = [];

      (AsyncStorage.setItem as jest.Mock).mockImplementation(async (key, value) => {
        callOrder.push(value);
        // Simulate async delay
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      await act(async () => {
        const session1 = { ...mockSession, accessToken: 'token-1' };
        const session2 = { ...mockSession, accessToken: 'token-2' };

        await Promise.all([
          result.current.setSession(MusicProviderId.Spotify, session1),
          result.current.setSession(MusicProviderId.Spotify, session2),
        ]);
      });

      // Verify calls were made in order (serialized)
      expect(callOrder.length).toBe(2);
      expect(callOrder[0]).toContain('token-1');
      expect(callOrder[1]).toContain('token-2');
    });
  });
});
