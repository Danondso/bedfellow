import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicProviderId, ProviderAuthSession } from '@services/music-providers/types';

export const MUSIC_PROVIDER_STORAGE_KEYS = {
  sessions: '@bedfellow/music-provider/sessions',
  activeProvider: '@bedfellow/music-provider/active',
} as const;

export type ProviderSessions = Partial<Record<MusicProviderId, ProviderAuthSession | null>>;

export interface UseSessionStorageReturn {
  sessions: ProviderSessions;
  isHydrated: boolean;
  storageError: string | null;
  setSession: (providerId: MusicProviderId, session: ProviderAuthSession | null) => Promise<void>;
  clearSession: (providerId: MusicProviderId) => Promise<void>;
  getSession: (providerId: MusicProviderId) => ProviderAuthSession | null;
  hydrateActiveProvider: () => Promise<MusicProviderId | null>;
  persistActiveProvider: (providerId: MusicProviderId) => Promise<void>;
}

const parseStoredSessions = (raw: string | null): ProviderSessions => {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, ProviderAuthSession | null>;
    return Object.entries(parsed).reduce<ProviderSessions>((acc, [key, value]) => {
      if (Object.values(MusicProviderId).includes(key as MusicProviderId)) {
        acc[key as MusicProviderId] = value;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to parse stored music provider sessions', error);
    return {};
  }
};

/**
 * Hook for managing persistent session storage for music providers.
 *
 * Handles:
 * - Persisting provider sessions to AsyncStorage
 * - Hydrating sessions on mount
 * - Managing active provider persistence
 * - Serializing persistence operations to prevent race conditions
 * - Error handling and reporting
 *
 * @returns {UseSessionStorageReturn} An object containing:
 *   - `sessions`: The current provider sessions.
 *   - `isHydrated`: Whether the sessions have been loaded from storage.
 *   - `storageError`: Any error encountered during storage operations.
 *   - `setSession(providerId, session)`: Persists a session for a provider.
 *   - `clearSession(providerId)`: Removes a provider's session.
 *   - `getSession(providerId)`: Retrieves a session for a provider.
 *   - `hydrateActiveProvider()`: Loads the active provider from storage.
 *   - `persistActiveProvider(providerId)`: Persists the active provider to storage.
 */
export const useSessionStorage = (): UseSessionStorageReturn => {
  const [sessions, setSessions] = useState<ProviderSessions>({});
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  /**
   * We maintain both state (sessions) and ref (sessionsRef) for the sessions data:
   * - sessions (state) is used to trigger re-renders and update the UI when session data changes.
   * - sessionsRef (ref) provides synchronous access to the latest session data in async operations
   *   without causing re-renders. This is critical for avoiding stale closures and ensuring
   *   consistency during persistence operations and when accessed by provider adapters.
   */
  const sessionsRef = useRef<ProviderSessions>({});

  // Queue for serializing persistence operations to prevent race conditions
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());

  /**
   * Persists sessions to AsyncStorage with error handling
   */
  const persistSessions = useCallback(async (nextSessions: ProviderSessions): Promise<void> => {
    try {
      await AsyncStorage.setItem(MUSIC_PROVIDER_STORAGE_KEYS.sessions, JSON.stringify(nextSessions));
      setStorageError(null);
    } catch (error) {
      const message = 'Unable to save login state. You may be logged out on app restart.';
      console.error('Failed to persist music provider sessions', error);
      setStorageError(message);
    }
  }, []);

  /**
   * Sets a session for a provider and persists to storage.
   * Operations are queued to prevent race conditions.
   */
  const setSession = useCallback(
    async (providerId: MusicProviderId, session: ProviderAuthSession | null): Promise<void> => {
      const nextSessions = {
        ...sessionsRef.current,
        [providerId]: session,
      };

      sessionsRef.current = nextSessions;
      setSessions(nextSessions);

      // Serialize persistence operations to prevent race conditions
      persistenceQueueRef.current = persistenceQueueRef.current
        .then(() => persistSessions(nextSessions))
        .catch((error) => {
          console.error('Failed to persist session for provider', providerId, error);
          // Don't break the queue on error
        });

      await persistenceQueueRef.current;
    },
    [persistSessions]
  );

  /**
   * Clears a session for a provider
   */
  const clearSession = useCallback(
    async (providerId: MusicProviderId): Promise<void> => {
      await setSession(providerId, null);
    },
    [setSession]
  );

  /**
   * Gets the current session for a provider (synchronous)
   */
  const getSession = useCallback((providerId: MusicProviderId): ProviderAuthSession | null => {
    return sessionsRef.current[providerId] ?? null;
  }, []);

  /**
   * Persists the active provider to AsyncStorage
   */
  const persistActiveProvider = useCallback(async (providerId: MusicProviderId): Promise<void> => {
    try {
      await AsyncStorage.setItem(MUSIC_PROVIDER_STORAGE_KEYS.activeProvider, providerId);
    } catch (error) {
      console.error('Failed to persist active music provider', error);
    }
  }, []);

  /**
   * Hydrates the active provider from AsyncStorage
   */
  const hydrateActiveProvider = useCallback(async (): Promise<MusicProviderId | null> => {
    try {
      const stored = await AsyncStorage.getItem(MUSIC_PROVIDER_STORAGE_KEYS.activeProvider);
      if (stored && Object.values(MusicProviderId).includes(stored as MusicProviderId)) {
        return stored as MusicProviderId;
      }
      return null;
    } catch (error) {
      console.error('Failed to hydrate active music provider', error);
      return null;
    }
  }, []);

  /**
   * Hydrate sessions from AsyncStorage on mount
   */
  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const storedSessionsRaw = await AsyncStorage.getItem(MUSIC_PROVIDER_STORAGE_KEYS.sessions);

        if (!isMounted) {
          return;
        }

        const hydratedSessions = parseStoredSessions(storedSessionsRaw);
        sessionsRef.current = hydratedSessions;
        setSessions(hydratedSessions);
      } catch (error) {
        console.error('Failed to hydrate music provider sessions', error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    sessions,
    isHydrated,
    storageError,
    setSession,
    clearSession,
    getSession,
    hydrateActiveProvider,
    persistActiveProvider,
  };
};
