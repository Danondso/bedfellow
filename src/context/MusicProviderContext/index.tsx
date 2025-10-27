import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MUSIC_PROVIDER_DESCRIPTORS,
  createNotImplementedAdapter,
  getProviderDescriptor,
} from '@services/music-providers/registry';
import {
  MusicProviderAdapter,
  MusicProviderDescriptor,
  MusicProviderId,
  ProviderAuthSession,
} from '@services/music-providers/types';

export const MUSIC_PROVIDER_STORAGE_KEYS = {
  sessions: '@bedfellow/music-provider/sessions',
  activeProvider: '@bedfellow/music-provider/active',
} as const;

import { createSpotifyAdapter } from '@services/music-providers/adapters/spotifyAdapter';

type ProviderSessions = Partial<Record<MusicProviderId, ProviderAuthSession | null>>;

type AdapterRegistry = Partial<Record<MusicProviderId, MusicProviderAdapter>>;

type AuthState = {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

type MusicProviderContextValue = {
  availableProviders: MusicProviderDescriptor[];
  activeProviderId: MusicProviderId;
  isLoading: boolean;
  sessions: ProviderSessions;
  authState: AuthState;
  setSession: (providerId: MusicProviderId, session: ProviderAuthSession | null) => Promise<void>;
  clearSession: (providerId: MusicProviderId) => Promise<void>;
  getSession: (providerId?: MusicProviderId) => ProviderAuthSession | null;
  setActiveProvider: (providerId: MusicProviderId) => Promise<void>;
  isProviderAvailable: (providerId: MusicProviderId) => boolean;
  getAdapter: (providerId?: MusicProviderId) => MusicProviderAdapter;
  authorize: (providerId?: MusicProviderId) => Promise<ProviderAuthSession>;
  refreshSession: (providerId?: MusicProviderId) => Promise<ProviderAuthSession | null>;
  logout: (providerId?: MusicProviderId) => Promise<void>;
  clearError: () => void;
  isTokenExpiring: (providerId?: MusicProviderId) => boolean;
};

const MusicProviderContext = createContext<MusicProviderContextValue | undefined>(undefined);

export const useMusicProvider = (): MusicProviderContextValue => {
  const context = useContext(MusicProviderContext);
  if (!context) {
    throw new Error('useMusicProvider must be used within a MusicProviderContextProvider');
  }
  return context;
};

export interface MusicProviderContextProviderProps {
  children: ReactNode;
  initialProviderId?: MusicProviderId;
  adapters?: AdapterRegistry;
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

const resolveActiveProvider = (stored: string | null, defaultProvider: MusicProviderId): MusicProviderId => {
  if (stored && Object.values(MusicProviderId).includes(stored as MusicProviderId)) {
    return stored as MusicProviderId;
  }
  return defaultProvider;
};

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes
const TOKEN_REFRESH_CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

const MusicProviderContextProvider: React.FC<MusicProviderContextProviderProps> = ({
  children,
  initialProviderId = MusicProviderId.Spotify,
  adapters = {},
}) => {
  const availableProviders = MUSIC_PROVIDER_DESCRIPTORS;
  const [sessions, setSessions] = useState<ProviderSessions>({});
  const [activeProviderId, setActiveProviderId] = useState<MusicProviderId>(initialProviderId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isRefreshing: false,
    error: null,
    isAuthenticated: false,
  });

  // Use refs for values that need synchronous access without triggering re-renders
  const sessionsRef = useRef<ProviderSessions>({});
  const adaptersRef = useRef<Partial<Record<MusicProviderId, MusicProviderAdapter>>>({});
  // Use ref instead of module-level singleton to prevent memory leaks on unmount
  const activeRefreshPromisesRef = useRef<Partial<Record<MusicProviderId, Promise<ProviderAuthSession | null>>>>({});
  // Queue for serializing persistence operations to prevent race conditions
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Memoize adapters prop to prevent unnecessary rebuilds
  const adaptersOverride = useMemo(() => adapters, [adapters]);

  // Build adapter registry once on mount and when override adapters change
  useEffect(() => {
    // Lazy-load createSpotifyAdapter to avoid premature native module initialization
    const buildRegistry = async () => {
      const registry = MUSIC_PROVIDER_DESCRIPTORS.reduce(
        (acc, descriptor) => {
          const override = adaptersOverride[descriptor.id];
          if (override) {
            acc[descriptor.id] = override;
            return acc;
          }

          if (descriptor.id === MusicProviderId.Spotify) {
            acc[descriptor.id] = createSpotifyAdapter({
              getSession: () => sessionsRef.current[MusicProviderId.Spotify] ?? null,
            });
            return acc;
          }

          acc[descriptor.id] = createNotImplementedAdapter(descriptor);
          return acc;
        },
        {} as Record<MusicProviderId, MusicProviderAdapter>
      );

      adaptersRef.current = registry;
    };

    buildRegistry();
  }, [adaptersOverride]);

  const persistSessions = useCallback(async (nextSessions: ProviderSessions) => {
    try {
      await AsyncStorage.setItem(MUSIC_PROVIDER_STORAGE_KEYS.sessions, JSON.stringify(nextSessions));
    } catch (error) {
      console.error('Failed to persist music provider sessions', error);
    }
  }, []);

  const persistActiveProvider = useCallback(async (providerId: MusicProviderId) => {
    try {
      await AsyncStorage.setItem(MUSIC_PROVIDER_STORAGE_KEYS.activeProvider, providerId);
    } catch (error) {
      console.error('Failed to persist active music provider', error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const [storedSessionsRaw, storedActiveRaw] = await Promise.all([
          AsyncStorage.getItem(MUSIC_PROVIDER_STORAGE_KEYS.sessions),
          AsyncStorage.getItem(MUSIC_PROVIDER_STORAGE_KEYS.activeProvider),
        ]);

        if (!isMounted) {
          return;
        }

        const hydratedSessions = parseStoredSessions(storedSessionsRaw);
        sessionsRef.current = hydratedSessions;
        setSessions(hydratedSessions);

        const resolvedActive = resolveActiveProvider(storedActiveRaw, initialProviderId);
        setActiveProviderId(resolvedActive);

        // Update auth state based on active session
        const activeSession = hydratedSessions[resolvedActive];
        if (activeSession) {
          const expiresAt = activeSession.expiresAt ? new Date(activeSession.expiresAt).getTime() : 0;
          const now = Date.now();
          const isExpiring = expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;

          setAuthState({
            isLoading: false,
            isRefreshing: false,
            error: null,
            isAuthenticated: !isExpiring,
          });
        } else {
          setAuthState({
            isLoading: false,
            isRefreshing: false,
            error: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Failed to hydrate music provider state', error);
        setAuthState({
          isLoading: false,
          isRefreshing: false,
          error: 'Failed to load authentication',
          isAuthenticated: false,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [initialProviderId]);

  const setSession = useCallback(
    async (providerId: MusicProviderId, session: ProviderAuthSession | null) => {
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
          console.error('Persistence failed', error);
          // Don't break the queue on error
        });

      await persistenceQueueRef.current;
    },
    [persistSessions]
  );

  const clearSession = useCallback(
    async (providerId: MusicProviderId) => {
      await setSession(providerId, null);
    },
    [setSession]
  );

  const getSession = useCallback(
    (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      return sessionsRef.current[id] ?? null;
    },
    [activeProviderId]
  );

  const setActiveProvider = useCallback(
    async (providerId: MusicProviderId) => {
      if (!adaptersRef.current[providerId]) {
        throw new Error(`Unsupported music provider: ${providerId}`);
      }

      setActiveProviderId(providerId);
      await persistActiveProvider(providerId);
    },
    [persistActiveProvider]
  );

  const isProviderAvailable = useCallback((providerId: MusicProviderId) => {
    return Boolean(adaptersRef.current[providerId]);
  }, []);

  const getAdapter = useCallback(
    (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      const adapter = adaptersRef.current[id];

      if (adapter) {
        return adapter;
      }

      const descriptor = getProviderDescriptor(id);
      if (!descriptor) {
        throw new Error(`Unknown music provider: ${id}`);
      }

      const fallback = createNotImplementedAdapter(descriptor);
      adaptersRef.current[id] = fallback;
      return fallback;
    },
    [activeProviderId]
  );

  // Check if token is expiring soon
  const isTokenExpiring = useCallback(
    (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      const session = sessionsRef.current[id];

      if (!session?.expiresAt) return true;

      const expiresAt = new Date(session.expiresAt).getTime();
      const now = Date.now();
      return expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;
    },
    [activeProviderId]
  );

  // Authorize with a provider
  const authorize = useCallback(
    async (providerId?: MusicProviderId): Promise<ProviderAuthSession> => {
      const id = providerId ?? activeProviderId;
      const adapter = getAdapter(id);

      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const session = await adapter.auth.authorize();
        await setSession(id, session);

        setAuthState({
          isLoading: false,
          isRefreshing: false,
          error: null,
          isAuthenticated: true,
        });

        return session;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to authorize';
        setAuthState({
          isLoading: false,
          isRefreshing: false,
          error: errorMessage,
          isAuthenticated: false,
        });
        throw error;
      }
    },
    [activeProviderId, getAdapter, setSession]
  );

  // Refresh session token
  const refreshSession = useCallback(
    async (providerId?: MusicProviderId): Promise<ProviderAuthSession | null> => {
      const id = providerId ?? activeProviderId;

      // If already refreshing this provider, wait for the existing refresh to complete
      if (activeRefreshPromisesRef.current[id]) {
        try {
          const session = await activeRefreshPromisesRef.current[id]!;
          return session;
        } catch {
          return null;
        }
      }

      const session = sessionsRef.current[id];
      if (!session) {
        setAuthState((prev) => ({
          ...prev,
          isRefreshing: false,
          error: 'No session available to refresh',
          isAuthenticated: false,
        }));
        return null;
      }

      const adapter = getAdapter(id);

      // Create new refresh promise for this provider
      const refreshPromise = (async () => {
        setAuthState((prev) => ({ ...prev, isRefreshing: true, error: null }));

        try {
          const refreshedSession = await adapter.auth.refresh(session);
          await setSession(id, refreshedSession);

          setAuthState({
            isLoading: false,
            isRefreshing: false,
            error: null,
            isAuthenticated: true,
          });

          return refreshedSession;
        } catch (error) {
          const errorMessage =
            error instanceof Error && (error.message.includes('401') || error.message.includes('400'))
              ? 'Session expired. Please log in again.'
              : 'Failed to refresh session';

          setAuthState((prev) => ({
            ...prev,
            isRefreshing: false,
            error: errorMessage,
            isAuthenticated: false,
          }));

          // Clear session if refresh failed with auth error
          if (errorMessage.includes('Session expired')) {
            await clearSession(id);
          }

          return null;
        } finally {
          delete activeRefreshPromisesRef.current[id];
        }
      })();

      activeRefreshPromisesRef.current[id] = refreshPromise;

      try {
        const result = await refreshPromise;
        return result;
      } catch {
        return null;
      }
    },
    [activeProviderId, getAdapter, setSession, clearSession]
  );

  // Logout from a provider
  const logout = useCallback(
    async (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      const adapter = getAdapter(id);
      const session = sessionsRef.current[id];

      try {
        if (session && adapter.auth.revoke) {
          await adapter.auth.revoke(session);
        }
      } catch (error) {
        console.error('Failed to revoke session:', error);
      }

      await clearSession(id);
      setAuthState({
        isLoading: false,
        isRefreshing: false,
        error: null,
        isAuthenticated: false,
      });
      // Clean up any active refresh promises for this provider
      delete activeRefreshPromisesRef.current[id];
    },
    [activeProviderId, getAdapter, clearSession]
  );

  // Clear error
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  // Store refs for callbacks to avoid recreating interval
  const isTokenExpiringRef = useRef(isTokenExpiring);
  const refreshSessionRef = useRef(refreshSession);

  // Sync refs when callbacks change
  useEffect(() => {
    isTokenExpiringRef.current = isTokenExpiring;
    refreshSessionRef.current = refreshSession;
  }, [isTokenExpiring, refreshSession]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    const activeSession = sessionsRef.current[activeProviderId];
    if (!activeSession || authState.isRefreshing) return;

    const checkAndRefresh = () => {
      if (isTokenExpiringRef.current(activeProviderId)) {
        refreshSessionRef.current(activeProviderId);
      }
    };

    // Check immediately
    checkAndRefresh();

    // Set up interval to check periodically
    const interval = setInterval(checkAndRefresh, TOKEN_REFRESH_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activeProviderId, authState.isRefreshing]); // Stable dependencies only

  const contextValue = useMemo<MusicProviderContextValue>(
    () => ({
      availableProviders,
      activeProviderId,
      isLoading,
      sessions,
      authState,
      setSession,
      clearSession,
      getSession,
      setActiveProvider,
      isProviderAvailable,
      getAdapter,
      authorize,
      refreshSession,
      logout,
      clearError,
      isTokenExpiring,
    }),
    [
      availableProviders,
      activeProviderId,
      isLoading,
      sessions,
      authState,
      setSession,
      clearSession,
      getSession,
      setActiveProvider,
      isProviderAvailable,
      getAdapter,
      authorize,
      refreshSession,
      logout,
      clearError,
      isTokenExpiring,
    ]
  );

  return <MusicProviderContext.Provider value={contextValue}>{children}</MusicProviderContext.Provider>;
};

export default MusicProviderContextProvider;
