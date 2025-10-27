import { authorize } from 'react-native-app-auth';
import axios from 'axios';
import { createSpotifyAdapter } from '@services/music-providers/adapters/spotifyAdapter';
import { MusicProviderId, type ProviderAuthSession } from '@services/music-providers/types';
import { performPlaybackAction, spotifyGETData, spotifyPOSTData } from '@services/spotify/SpotifyAPI.service';

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

jest.mock('axios');

jest.mock('@services/spotify/SpotifyAPI.service', () => ({
  performPlaybackAction: jest.fn(),
  spotifyGETData: jest.fn(),
  spotifyPOSTData: jest.fn(),
  spotifyPUTData: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  SPOTIFY_CLIENT_ID: 'client-id',
  SPOTIFY_REDIRECT_URI: 'myapp://callback',
  SPOTIFY_REDIRECT_URI_ANDROID: 'myapp://android-callback',
  BEDFELLOW_API_BASE_URL: 'https://api.example.com',
}));

type SessionGetter = () => ProviderAuthSession | null;

describe('createSpotifyAdapter', () => {
  const authorizeMock = authorize as jest.Mock;
  const axiosPostMock = axios.post as jest.Mock;
  const playbackMock = performPlaybackAction as jest.Mock;
  const getMock = spotifyGETData as jest.Mock;
  const postMock = spotifyPOSTData as jest.Mock;

  const createSession = (overrides: Partial<ProviderAuthSession> = {}): ProviderAuthSession => ({
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    tokenType: 'Bearer',
    scopes: ['scope'],
    ...overrides,
  });

  const buildAdapter = (session: ProviderAuthSession | null = createSession()) => {
    const sessionGetter: SessionGetter = jest.fn(() => session);
    const adapter = createSpotifyAdapter({ getSession: sessionGetter });
    return { adapter, sessionGetter };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the Spotify descriptor information', () => {
    const { adapter } = buildAdapter();
    expect(adapter.id).toBe(MusicProviderId.Spotify);
    expect(adapter.displayName).toBe('Spotify');
    expect(adapter.capabilities).toMatchObject({ playback: true, search: true });
  });

  it('authorizes via react-native-app-auth and returns a provider session', async () => {
    authorizeMock.mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      accessTokenExpirationDate: new Date(Date.now() + 3600000).toISOString(),
      tokenType: 'Bearer',
      scopes: ['scope'],
    });

    const { adapter } = buildAdapter(null);
    const session = await adapter.auth.authorize();

    expect(session).toMatchObject({
      accessToken: 'token',
      refreshToken: 'refresh',
      tokenType: 'Bearer',
    });
    expect(session.expiresAt).toBeDefined();
  });

  it('refreshes tokens via the backend and returns the updated session', async () => {
    axiosPostMock.mockResolvedValue({
      data: {
        access_token: 'new-token',
        expires_in: 3600,
      },
    });

    const originalSession = createSession();
    const { adapter } = buildAdapter(originalSession);

    const refreshed = await adapter.auth.refresh(originalSession);

    expect(axiosPostMock).toHaveBeenCalledWith('https://api.example.com/refresh', {
      refresh_token: originalSession.refreshToken,
    });

    expect(refreshed).toMatchObject({
      accessToken: 'new-token',
      refreshToken: originalSession.refreshToken,
    });
  });

  it('throws if playback actions are invoked without a session', async () => {
    const { adapter } = buildAdapter(null);
    await expect(adapter.playback.play()).rejects.toThrow(/No Spotify session/);
  });

  it('delegates playback controls to Spotify API service', async () => {
    const { adapter } = buildAdapter();

    await adapter.playback.play();
    await adapter.playback.pause();
    await adapter.playback.skipNext();
    await adapter.playback.skipPrevious();

    expect(playbackMock).toHaveBeenCalledWith('play', expect.any(Object));
    expect(playbackMock).toHaveBeenCalledWith('pause', expect.any(Object));
    expect(playbackMock).toHaveBeenCalledWith('forward', expect.any(Object));
    expect(playbackMock).toHaveBeenCalledWith('backward', expect.any(Object));
  });

  it('retrieves playback state', async () => {
    getMock.mockResolvedValue({ data: { item: { id: 1 } } });
    const { adapter } = buildAdapter();
    const state = await adapter.playback.refreshState();
    expect(getMock).toHaveBeenCalledWith('v1/me/player/currently-playing', expect.any(Object));
    expect(state).toEqual({ item: { id: 1 } });
  });

  it('queues tracks and performs searches using Spotify API helpers', async () => {
    postMock.mockResolvedValue({});
    getMock.mockResolvedValueOnce({ data: { tracks: [] } });

    const { adapter } = buildAdapter();
    await adapter.queue.addToQueue('spotify:track:123');
    await adapter.search.searchTracks('query');

    expect(postMock).toHaveBeenCalledWith('v1/me/player/queue?uri=spotify:track:123', expect.any(Object));
    expect(getMock).toHaveBeenCalledWith('/search?q=query&type=track', expect.any(Object));
  });

  it('fetches profile information', async () => {
    getMock.mockResolvedValue({ data: { id: 'me' } });
    const { adapter } = buildAdapter();
    const profile = await adapter.profile.getProfile();
    expect(getMock).toHaveBeenCalledWith('v1/me/', expect.any(Object));
    expect(profile).toEqual({ id: 'me' });
  });
});
