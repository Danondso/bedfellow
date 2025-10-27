import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MusicProviderContextProvider, {
  useMusicProvider,
  MUSIC_PROVIDER_STORAGE_KEYS,
} from '@context/MusicProviderContext';
import type { MusicProviderAdapter, ProviderAuthSession } from '@services/music-providers/types';
import { MusicProviderId } from '@services/music-providers/types';

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

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

type ContextCallback = jest.MockedFunction<(value: ReturnType<typeof useMusicProvider>) => void>;

const createAdapter = (overrides: Partial<MusicProviderAdapter> = {}): MusicProviderAdapter => {
  const fallback: MusicProviderAdapter = {
    id: MusicProviderId.Spotify,
    displayName: 'Spotify',
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
      refreshState: jest.fn(),
    },
    queue: {
      addToQueue: jest.fn(),
    },
    search: {
      searchTracks: jest.fn(),
    },
    profile: {
      getProfile: jest.fn(),
    },
  };
  return {
    ...fallback,
    ...overrides,
  };
};

const Collector: React.FC<{ onUpdate: ContextCallback }> = ({ onUpdate }) => {
  const context = useMusicProvider();
  React.useEffect(() => {
    onUpdate(context);
  }, [context, onUpdate]);
  return null;
};

const buildDefaultAdapters = () => ({
  [MusicProviderId.Spotify]: createAdapter(),
});

describe('MusicProviderContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  const latestContext = (callback: ContextCallback) => callback.mock.calls[callback.mock.calls.length - 1]?.[0];

  it('initialises with Spotify as the active provider by default', async () => {
    const onUpdate = jest.fn();
    render(
      <MusicProviderContextProvider adapters={buildDefaultAdapters()}>
        <Collector onUpdate={onUpdate} />
      </MusicProviderContextProvider>
    );

    await waitFor(() => {
      const context = latestContext(onUpdate);
      expect(context).toBeDefined();
      expect(context?.isLoading).toBe(false);
    });

    const context = latestContext(onUpdate);
    expect(context?.activeProviderId).toBe(MusicProviderId.Spotify);
    expect(context?.availableProviders.map((provider) => provider.id)).toEqual(
      expect.arrayContaining([MusicProviderId.Spotify, MusicProviderId.YouTubeMusic])
    );
  });

  it('stores sessions per provider and persists them', async () => {
    const onUpdate = jest.fn();
    render(
      <MusicProviderContextProvider adapters={buildDefaultAdapters()}>
        <Collector onUpdate={onUpdate} />
      </MusicProviderContextProvider>
    );

    await waitFor(() => expect(latestContext(onUpdate)?.isLoading).toBe(false));

    const session: ProviderAuthSession = {
      accessToken: 'abc',
      refreshToken: 'ref',
      expiresAt: '2025-01-01T00:00:00.000Z',
    };

    await act(async () => {
      await latestContext(onUpdate)?.setSession(MusicProviderId.Spotify, session);
    });

    await waitFor(() => expect(latestContext(onUpdate)?.sessions[MusicProviderId.Spotify]).toEqual(session));

    const sessionsCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
      ([key]) => key === MUSIC_PROVIDER_STORAGE_KEYS.sessions
    );
    expect(sessionsCall).toBeDefined();
    expect(JSON.parse(sessionsCall?.[1] as string)).toEqual({
      [MusicProviderId.Spotify]: session,
    });
  });

  it('updates and persists the active provider', async () => {
    const onUpdate = jest.fn();
    render(
      <MusicProviderContextProvider adapters={buildDefaultAdapters()}>
        <Collector onUpdate={onUpdate} />
      </MusicProviderContextProvider>
    );

    await waitFor(() => expect(latestContext(onUpdate)?.isLoading).toBe(false));

    await act(async () => {
      await latestContext(onUpdate)?.setActiveProvider(MusicProviderId.YouTubeMusic);
    });

    await waitFor(() => expect(latestContext(onUpdate)?.activeProviderId).toBe(MusicProviderId.YouTubeMusic));

    const activeCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
      ([key]) => key === MUSIC_PROVIDER_STORAGE_KEYS.activeProvider
    );

    expect(activeCall).toBeDefined();
    expect(activeCall?.[1]).toBe(MusicProviderId.YouTubeMusic);
  });

  it('hydrates state from persisted storage on mount', async () => {
    const storedSession: ProviderAuthSession = {
      accessToken: 'stored',
      tokenType: 'Bearer',
    };

    (AsyncStorage.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === MUSIC_PROVIDER_STORAGE_KEYS.sessions) {
        return JSON.stringify({
          [MusicProviderId.Spotify]: storedSession,
        });
      }

      if (key === MUSIC_PROVIDER_STORAGE_KEYS.activeProvider) {
        return MusicProviderId.YouTubeMusic;
      }

      return null;
    });

    const onUpdate = jest.fn();
    render(
      <MusicProviderContextProvider adapters={buildDefaultAdapters()}>
        <Collector onUpdate={onUpdate} />
      </MusicProviderContextProvider>
    );

    await waitFor(() => expect(latestContext(onUpdate)?.isLoading).toBe(false));

    const context = latestContext(onUpdate);

    expect(context?.activeProviderId).toBe(MusicProviderId.YouTubeMusic);
    expect(context?.sessions[MusicProviderId.Spotify]).toEqual(storedSession);
  });

  it('allows custom adapters to be injected and retrieved', async () => {
    const customAdapter = createAdapter({ id: MusicProviderId.YouTubeMusic, displayName: 'Custom' });

    const onUpdate = jest.fn();
    render(
      <MusicProviderContextProvider
        adapters={{
          [MusicProviderId.Spotify]: createAdapter(),
          [MusicProviderId.YouTubeMusic]: customAdapter,
        }}
      >
        <Collector onUpdate={onUpdate} />
      </MusicProviderContextProvider>
    );

    await waitFor(() => expect(latestContext(onUpdate)?.isLoading).toBe(false));

    const adapter = latestContext(onUpdate)?.getAdapter(MusicProviderId.YouTubeMusic);
    expect(adapter?.displayName).toBe('Custom');
  });
});
