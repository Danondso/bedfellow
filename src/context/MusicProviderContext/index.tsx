import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { MUSIC_PROVIDER_DESCRIPTORS } from '@services/music-providers/registry';
import {
  MusicProviderAdapter,
  MusicProviderDescriptor,
  MusicProviderId,
  ProviderAuthSession,
} from '@services/music-providers/types';
import { useSessionStorage, type ProviderSessions } from '@hooks/useSessionStorage';
import { adapterRegistry } from '@services/music-providers/AdapterRegistry';

type AdapterOverrides = Partial<Record<MusicProviderId, MusicProviderAdapter>>;

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
  storageError: string | null;
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
  adapters?: AdapterOverrides;
}

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes
const TOKEN_REFRESH_CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

const MusicProviderContextProvider: React.FC<MusicProviderContextProviderProps> = ({
  children,
  initialProviderId = MusicProviderId.Spotify,
  adapters = {},
}) => {
  // Use session storage hook for all persistence logic
  const {
    sessions,
    isHydrated,
    storageError,
    setSession: setStorageSession,
    clearSession: clearStorageSession,
    getSession: getStorageSession,
    hydrateActiveProvider,
    persistActiveProvider,
  } = useSessionStorage();

  const [activeProviderId, setActiveProviderId] = useState<MusicProviderId>(initialProviderId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isRefreshing: false,
    error: null,
    isAuthenticated: false,
  });

  // Use ref instead of module-level singleton to prevent memory leaks on unmount
  const activeRefreshPromisesRef = useRef<Partial<Record<MusicProviderId, Promise<ProviderAuthSession | null>>>>({});
  // Track if this component has attempted initialization to prevent race conditions
  const hasAttemptedInitRef = useRef<boolean>(false);

  // Memoize adapters prop to prevent unnecessary rebuilds
  const adaptersOverride = useMemo(() => adapters, [adapters]);

  // Initialize adapter registry once on mount
  useEffect(() => {
    // Atomically check and set initialization attempt flag
    if (!hasAttemptedInitRef.current && !adapterRegistry.initialized) {
      hasAttemptedInitRef.current = true;
      adapterRegistry.initialize(getStorageSession);
    }

    // Register any custom adapters (for testing)
    const registeredOverrideIds: MusicProviderId[] = [];
    if (adaptersOverride) {
      (Object.keys(adaptersOverride) as MusicProviderId[]).forEach((id) => {
        const adapter = adaptersOverride[id];
        if (adapter) {
          adapterRegistry.register(id, adapter);
          registeredOverrideIds.push(id);
        }
      });
    }

    // Cleanup: unregister custom adapters on unmount or when overrides change
    return () => {
      registeredOverrideIds.forEach((id) => {
        adapterRegistry.unregister(id);
      });
    };
  }, [adaptersOverride, getStorageSession]);

  // Hydrate active provider and update auth state after sessions are hydrated
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let isMounted = true;

    const hydrate = async () => {
      try {
        const storedActiveProvider = await hydrateActiveProvider();

        if (!isMounted) {
          return;
        }

        const resolvedActive = storedActiveProvider ?? initialProviderId;
        setActiveProviderId(resolvedActive);

        // Update auth state based on active session
        const activeSession = sessions[resolvedActive];
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
  }, [isHydrated, sessions, hydrateActiveProvider, initialProviderId]);

  const setSession = useCallback(
    async (providerId: MusicProviderId, session: ProviderAuthSession | null) => {
      await setStorageSession(providerId, session);
    },
    [setStorageSession]
  );

  const clearSession = useCallback(
    async (providerId: MusicProviderId) => {
      await clearStorageSession(providerId);
    },
    [clearStorageSession]
  );

  const getSession = useCallback(
    (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      return getStorageSession(id);
    },
    [activeProviderId, getStorageSession]
  );

  const setActiveProvider = useCallback(
    async (providerId: MusicProviderId) => {
      if (!adapterRegistry.has(providerId)) {
        throw new Error(`Unsupported music provider: ${providerId}`);
      }

      setActiveProviderId(providerId);
      await persistActiveProvider(providerId);
    },
    [persistActiveProvider]
  );

  const isProviderAvailable = useCallback((providerId: MusicProviderId) => {
    return adapterRegistry.has(providerId);
  }, []);

  const getAdapter = useCallback(
    (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      const adapter = adapterRegistry.get(id);

      if (!adapter) {
        throw new Error(`Unknown music provider: ${id}`);
      }

      return adapter;
    },
    [activeProviderId]
  );

  // Check if token is expiring soon
  const isTokenExpiring = useCallback(
    (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      const session = getStorageSession(id);

      if (!session?.expiresAt) return true;

      const expiresAt = new Date(session.expiresAt).getTime();
      const now = Date.now();
      return expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;
    },
    [activeProviderId, getStorageSession]
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

      const session = getStorageSession(id);
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
    [activeProviderId, getAdapter, getStorageSession, setSession, clearSession]
  );

  // Logout from a provider
  const logout = useCallback(
    async (providerId?: MusicProviderId) => {
      const id = providerId ?? activeProviderId;
      const adapter = getAdapter(id);
      const session = getStorageSession(id);

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
    [activeProviderId, getAdapter, getStorageSession, clearSession]
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
    const activeSession = getStorageSession(activeProviderId);
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
  }, [activeProviderId, authState.isRefreshing, getStorageSession]); // Stable dependencies only

  const contextValue = useMemo<MusicProviderContextValue>(
    () => ({
      availableProviders: MUSIC_PROVIDER_DESCRIPTORS,
      activeProviderId,
      isLoading,
      sessions,
      authState,
      storageError,
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
      activeProviderId,
      isLoading,
      sessions,
      authState,
      storageError,
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
