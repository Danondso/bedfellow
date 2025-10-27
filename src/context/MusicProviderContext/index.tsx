import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MUSIC_PROVIDER_DESCRIPTORS,
  createNotImplementedAdapter,
  getProviderDescriptor,
} from '@services/music-providers/registry';
import { createSpotifyAdapter } from '@services/music-providers/adapters/spotifyAdapter';
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

type ProviderSessions = Partial<Record<MusicProviderId, ProviderAuthSession | null>>;

type AdapterRegistry = Partial<Record<MusicProviderId, MusicProviderAdapter>>;

type MusicProviderContextValue = {
  availableProviders: MusicProviderDescriptor[];
  activeProviderId: MusicProviderId;
  isLoading: boolean;
  sessions: ProviderSessions;
  setSession: (providerId: MusicProviderId, session: ProviderAuthSession | null) => Promise<void>;
  clearSession: (providerId: MusicProviderId) => Promise<void>;
  getSession: (providerId?: MusicProviderId) => ProviderAuthSession | null;
  setActiveProvider: (providerId: MusicProviderId) => Promise<void>;
  isProviderAvailable: (providerId: MusicProviderId) => boolean;
  getAdapter: (providerId?: MusicProviderId) => MusicProviderAdapter;
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

const MusicProviderContextProvider: React.FC<MusicProviderContextProviderProps> = ({
  children,
  initialProviderId = MusicProviderId.Spotify,
  adapters = {},
}) => {
  const availableProviders = useMemo(() => MUSIC_PROVIDER_DESCRIPTORS, []);
  const [sessions, setSessions] = useState<ProviderSessions>({});
  const [activeProviderId, setActiveProviderId] = useState<MusicProviderId>(initialProviderId);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use refs for values that need synchronous access without triggering re-renders
  const sessionsRef = useRef<ProviderSessions>({});
  const adaptersRef = useRef<Partial<Record<MusicProviderId, MusicProviderAdapter>>>({});

  // Memoize adapters prop to prevent unnecessary rebuilds
  const adaptersOverride = useMemo(() => adapters, [adapters]);

  // Build adapter registry once on mount and when override adapters change
  useEffect(() => {
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
      } catch (error) {
        console.error('Failed to hydrate music provider state', error);
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
      await persistSessions(nextSessions);
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

  const contextValue = useMemo<MusicProviderContextValue>(
    () => ({
      availableProviders,
      activeProviderId,
      isLoading,
      sessions,
      setSession,
      clearSession,
      getSession,
      setActiveProvider,
      isProviderAvailable,
      getAdapter,
    }),
    [
      availableProviders,
      activeProviderId,
      isLoading,
      sessions,
      setSession,
      clearSession,
      getSession,
      setActiveProvider,
      isProviderAvailable,
      getAdapter,
    ]
  );

  return <MusicProviderContext.Provider value={contextValue}>{children}</MusicProviderContext.Provider>;
};

export default MusicProviderContextProvider;
