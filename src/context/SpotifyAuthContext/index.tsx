import React, { createContext, useState, useCallback, ReactNode, useEffect, Context, useRef, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { AuthorizeResult } from 'react-native-app-auth';
import Config from 'react-native-config';
import { type SpotifyAuthContextData, type SpotifyAuthToken, type SpotifyAuthState } from './types';
import { useMusicProvider } from '../MusicProviderContext';
import { MusicProviderId, type ProviderAuthSession } from '@services/music-providers/types';

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

const initialAuthState: SpotifyAuthState = {
  token: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
};

export const SpotifyAuthContext: Context<SpotifyAuthContextData> = createContext<SpotifyAuthContextData>({
  authState: initialAuthState,
  setAuthToken: async () => {},
  refreshToken: async () => null,
  logout: async () => {},
  isTokenExpiring: () => true,
  isAuthenticated: false,
  clearError: () => {},
});

// Singleton refresh promise to prevent multiple simultaneous refresh attempts
let activeRefreshPromise: Promise<SpotifyAuthToken | null> | null = null;

function SpotifyAuthContextProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<SpotifyAuthState>(initialAuthState);
  const isMountedRef = useRef(true);
  const musicProvider = useMusicProvider();

  // Helper function to safely update state only if component is mounted
  const safeSetAuthState = useCallback(
    (updater: Partial<SpotifyAuthState> | ((prev: SpotifyAuthState) => SpotifyAuthState)) => {
      if (isMountedRef.current) {
        if (typeof updater === 'function') {
          setAuthState(updater);
        } else {
          setAuthState((prev) => ({ ...prev, ...updater }));
        }
      }
    },
    []
  );

  // Convert AuthorizeResult to our token format
  const convertToAuthToken = useCallback((authResult: AuthorizeResult): SpotifyAuthToken => {
    const expiresAt = authResult.accessTokenExpirationDate
      ? new Date(authResult.accessTokenExpirationDate).toISOString()
      : new Date(Date.now() + 3600000).toISOString(); // Default 1 hour

    return {
      accessToken: authResult.accessToken,
      refreshToken: authResult.refreshToken || '',
      expiresAt,
      tokenType: authResult.tokenType || 'Bearer',
      scopes: authResult.scopes || [],
    };
  }, []);

  const providerSessionToSpotifyToken = useCallback((session: ProviderAuthSession | null): SpotifyAuthToken | null => {
    if (!session) {
      return null;
    }

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken ?? '',
      expiresAt: session.expiresAt ?? new Date(Date.now() + 3600000).toISOString(),
      tokenType: session.tokenType ?? 'Bearer',
      scopes: session.scopes ?? [],
    };
  }, []);

  const spotifyTokenToProviderSession = useCallback((token: SpotifyAuthToken | null): ProviderAuthSession | null => {
    if (!token) {
      return null;
    }

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: token.expiresAt,
      tokenType: token.tokenType,
      scopes: token.scopes,
    };
  }, []);

  // Check if token is expiring soon
  const isTokenExpiring = useCallback((): boolean => {
    if (!authState.token?.expiresAt) return true;

    const expiresAt = new Date(authState.token.expiresAt).getTime();
    const now = Date.now();
    return expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;
  }, [authState.token]);

  // Set auth token from login
  const setAuthToken = useCallback(
    async (authResult: AuthorizeResult) => {
      try {
        const token = convertToAuthToken(authResult);
        safeSetAuthState({
          token,
          isLoading: false,
          isRefreshing: false,
          error: null,
        });
        await musicProvider.setSession(MusicProviderId.Spotify, spotifyTokenToProviderSession(token));
      } catch (error) {
        safeSetAuthState({
          token: null,
          isLoading: false,
          error: 'Failed to save authentication',
        });
        throw error;
      }
    },
    [convertToAuthToken, musicProvider, safeSetAuthState, spotifyTokenToProviderSession]
  );

  // Refresh the access token
  const refreshToken = useCallback(async (): Promise<SpotifyAuthToken | null> => {
    // If already refreshing, wait for the existing refresh to complete
    if (activeRefreshPromise) {
      try {
        const token = await activeRefreshPromise;
        return token;
      } catch {
        return null;
      }
    }

    // No token to refresh
    if (!authState.token?.refreshToken) {
      safeSetAuthState({
        token: null,
        isRefreshing: false,
        error: 'No refresh token available',
      });
      return null;
    }

    // Create new refresh promise
    activeRefreshPromise = (async () => {
      safeSetAuthState({ isRefreshing: true, error: null });

      try {
        const tokenUrl = `${Config.BEDFELLOW_API_BASE_URL}/refresh`;
        const response = await axios.post(tokenUrl, {
          refresh_token: authState.token!.refreshToken,
        });

        const newToken: SpotifyAuthToken = {
          accessToken: response.data.access_token,
          refreshToken: authState.token!.refreshToken,
          tokenType: authState.token!.tokenType,
          scopes: authState.token!.scopes,
          expiresAt: response.data.expires_in
            ? new Date(Date.now() + response.data.expires_in * 1000).toISOString()
            : new Date(Date.now() + 3600000).toISOString(),
        };

        safeSetAuthState({
          token: newToken,
          isRefreshing: false,
          error: null,
        });

        await musicProvider.setSession(MusicProviderId.Spotify, spotifyTokenToProviderSession(newToken));
        return newToken;
      } catch (error) {
        const axiosError = error as AxiosError;

        const errorMessage =
          axiosError.response?.status === 400 || axiosError.response?.status === 401
            ? 'Session expired. Please log in again.'
            : 'Failed to refresh token';

        safeSetAuthState({
          token: axiosError.response?.status === 400 || axiosError.response?.status === 401 ? null : authState.token,
          isRefreshing: false,
          error: errorMessage,
        });

        // Clear stored token if refresh failed with auth error
        if (axiosError.response?.status === 400 || axiosError.response?.status === 401) {
          await musicProvider.clearSession(MusicProviderId.Spotify);
        }

        return null;
      } finally {
        activeRefreshPromise = null;
      }
    })();

    try {
      const token = await activeRefreshPromise;
      return token;
    } catch {
      return null;
    }
  }, [authState.token, musicProvider, safeSetAuthState, spotifyTokenToProviderSession]);

  // Logout
  const logout = useCallback(async () => {
    safeSetAuthState({
      token: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
    });
    await musicProvider.clearSession(MusicProviderId.Spotify);
    activeRefreshPromise = null;
  }, [musicProvider, safeSetAuthState]);

  // Clear error
  const clearError = useCallback(() => {
    safeSetAuthState({ error: null });
  }, [safeSetAuthState]);

  // Load stored token on mount from the music provider context
  useEffect(() => {
    let mounted = true;

    const loadStoredAuth = async () => {
      try {
        if (!mounted || musicProvider.isLoading) {
          return;
        }

        const session = musicProvider.getSession(MusicProviderId.Spotify);

        if (session) {
          const token = providerSessionToSpotifyToken(session);

          if (token) {
            const expiresAt = new Date(token.expiresAt).getTime();
            const now = Date.now();
            const needsRefresh = expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;

            if (needsRefresh && token.refreshToken) {
              safeSetAuthState({
                token,
                isLoading: false,
                isRefreshing: true,
              });
              refreshToken();
              return;
            }

            safeSetAuthState({
              token,
              isLoading: false,
            });
            return;
          }
        }

        safeSetAuthState({ isLoading: false });
      } catch (error) {
        console.error('Failed to load stored auth:', error);
        if (mounted) {
          safeSetAuthState({
            isLoading: false,
            error: 'Failed to load authentication',
          });
        }
      }
    };

    loadStoredAuth();

    return () => {
      mounted = false;
      isMountedRef.current = false;
    };
  }, [musicProvider, providerSessionToSpotifyToken, refreshToken, safeSetAuthState]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!authState.token || authState.isRefreshing) return;

    const checkAndRefresh = () => {
      if (isTokenExpiring()) {
        refreshToken();
      }
    };

    // Check immediately
    checkAndRefresh();

    // Set up interval to check periodically (every minute)
    const interval = setInterval(checkAndRefresh, 60000);

    return () => clearInterval(interval);
  }, [authState.token, authState.isRefreshing, isTokenExpiring, refreshToken]);

  // Calculate isAuthenticated separately to avoid circular dependency
  const isAuthenticated = useMemo(() => {
    if (!authState.token?.expiresAt) return false;

    const expiresAt = new Date(authState.token.expiresAt).getTime();
    const now = Date.now();
    const isExpiringSoon = expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;

    return !isExpiringSoon;
  }, [authState.token]);

  const contextValue: SpotifyAuthContextData = useMemo(
    () => ({
      authState,
      setAuthToken,
      refreshToken,
      logout,
      isTokenExpiring,
      isAuthenticated,
      clearError,
    }),
    [authState, setAuthToken, refreshToken, logout, isTokenExpiring, isAuthenticated, clearError]
  );

  return <SpotifyAuthContext.Provider value={contextValue}>{children}</SpotifyAuthContext.Provider>;
}

export default SpotifyAuthContextProvider;
export { type SpotifyAuthContextData, type SpotifyAuthToken, type SpotifyAuthState } from './types';
