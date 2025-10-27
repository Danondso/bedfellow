import { Platform } from 'react-native';
import { authorize } from 'react-native-app-auth';

import type { AuthorizeResult } from 'react-native-app-auth';
import axios from 'axios';
import Config from 'react-native-config';
import { MusicProviderId, type MusicProviderAdapter, type ProviderAuthSession } from '../types';
import { performPlaybackAction, spotifyGETData, spotifyPOSTData } from '@services/spotify/SpotifyAPI.service';
import type { SpotifyAuthToken } from '../../../types/auth';

const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-follow-read',
  'user-read-currently-playing',
];

type SpotifyAdapterOptions = {
  getSession: () => ProviderAuthSession | null;
};

const requireEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing Spotify configuration value: ${name}`);
  }
  return value;
};

const authorizeConfig = () => ({
  clientId: requireEnv(Config.SPOTIFY_CLIENT_ID, 'SPOTIFY_CLIENT_ID'),
  redirectUrl:
    Platform.OS === 'ios'
      ? requireEnv(Config.SPOTIFY_REDIRECT_URI, 'SPOTIFY_REDIRECT_URI')
      : requireEnv(Config.SPOTIFY_REDIRECT_URI_ANDROID, 'SPOTIFY_REDIRECT_URI_ANDROID'),
  scopes: SPOTIFY_SCOPES,
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: `${requireEnv(Config.BEDFELLOW_API_BASE_URL, 'BEDFELLOW_API_BASE_URL')}/token`,
  },
});

const sessionFromAuthorizeResult = (result: AuthorizeResult): ProviderAuthSession => ({
  accessToken: result.accessToken,
  refreshToken: result.refreshToken,
  expiresAt: result.accessTokenExpirationDate
    ? new Date(result.accessTokenExpirationDate).toISOString()
    : new Date(Date.now() + 3600000).toISOString(),
  tokenType: result.tokenType ?? 'Bearer',
  scopes: result.scopes ?? [],
});

const sessionToSpotifyToken = (session: ProviderAuthSession): SpotifyAuthToken => ({
  accessToken: session.accessToken,
  refreshToken: session.refreshToken ?? '',
  expiresAt: session.expiresAt ?? new Date(Date.now() + 3600000).toISOString(),
  tokenType: session.tokenType ?? 'Bearer',
  scopes: session.scopes ?? [],
});

const requireSession = (getSession: () => ProviderAuthSession | null): ProviderAuthSession => {
  const session = getSession();
  if (!session) {
    throw new Error('No Spotify session available');
  }
  return session;
};

const withToken = async <T>(
  getSession: () => ProviderAuthSession | null,
  action: (token: SpotifyAuthToken) => Promise<T>
): Promise<T> => {
  const session = requireSession(getSession);
  const token = sessionToSpotifyToken(session);
  return action(token);
};

export const createSpotifyAdapter = ({ getSession }: SpotifyAdapterOptions): MusicProviderAdapter => {
  const capabilities = {
    playback: true,
    queue: true,
    search: true,
    profile: true,
  } as const;

  return {
    id: MusicProviderId.Spotify,
    displayName: 'Spotify',
    capabilities,
    auth: {
      authorize: async () => {
        const result = await authorize(authorizeConfig());
        return sessionFromAuthorizeResult(result);
      },
      refresh: async (session: ProviderAuthSession) => {
        if (!session.refreshToken) {
          throw new Error('Spotify session has no refresh token');
        }

        const response = await axios.post(
          `${requireEnv(Config.BEDFELLOW_API_BASE_URL, 'BEDFELLOW_API_BASE_URL')}/refresh`,
          {
            refresh_token: session.refreshToken,
          }
        );

        const expiresAt = response.data.expires_in
          ? new Date(Date.now() + response.data.expires_in * 1000).toISOString()
          : new Date(Date.now() + 3600000).toISOString();

        return {
          accessToken: response.data.access_token,
          refreshToken: session.refreshToken,
          expiresAt,
          tokenType: session.tokenType ?? 'Bearer',
          scopes: session.scopes ?? [],
        } satisfies ProviderAuthSession;
      },
      revoke: async () => {
        // Spotify does not provide a revoke endpoint for user tokens; noop.
        return;
      },
    },
    playback: {
      play: () => withToken(getSession, async (token) => performPlaybackAction('play', token)),
      pause: () => withToken(getSession, async (token) => performPlaybackAction('pause', token)),
      skipNext: () => withToken(getSession, async (token) => performPlaybackAction('forward', token)),
      skipPrevious: () => withToken(getSession, async (token) => performPlaybackAction('backward', token)),
      refreshState: () =>
        withToken(getSession, async (token) => {
          const response = await spotifyGETData('v1/me/player/currently-playing', token);
          return response.data;
        }),
    },
    queue: {
      addToQueue: (trackUri: string) =>
        withToken(getSession, async (token) => {
          await spotifyPOSTData(`v1/me/player/queue?uri=${trackUri}`, token);
        }),
    },
    search: {
      searchTracks: (query: string) =>
        withToken(getSession, async (token) => {
          const response = await spotifyGETData(`/search?q=${encodeURIComponent(query)}&type=track`, token);
          return response.data;
        }),
    },
    profile: {
      getProfile: () =>
        withToken(getSession, async (token) => {
          const response = await spotifyGETData('v1/me/', token);
          return response.data;
        }),
    },
  };
};

export type { ProviderAuthSession };
