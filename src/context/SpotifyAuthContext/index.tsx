import React, { createContext, useState, useCallback, ReactNode, useEffect, Context, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { AuthorizeResult } from 'react-native-app-auth';
import Config from 'react-native-config';
import { type SpotifyAuthContextData, type SpotifyAuthToken, type SpotifyAuthState } from './types';

const SPOTIFY_AUTH_STORAGE_KEY = '@bedfellow/spotify_auth';
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

  // Check if token is expiring soon
  const isTokenExpiring = useCallback((): boolean => {
    if (!authState.token?.expiresAt) return true;

    const expiresAt = new Date(authState.token.expiresAt).getTime();
    const now = Date.now();
    return expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;
  }, [authState.token]);

  // Store token in AsyncStorage
  const persistToken = useCallback(async (token: SpotifyAuthToken | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem(SPOTIFY_AUTH_STORAGE_KEY, JSON.stringify(token));
      } else {
        await AsyncStorage.removeItem(SPOTIFY_AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist auth token:', error);
    }
  }, []);

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
        await persistToken(token);
      } catch (error) {
        safeSetAuthState({
          token: null,
          isLoading: false,
          error: 'Failed to save authentication',
        });
        throw error;
      }
    },
    [convertToAuthToken, persistToken, safeSetAuthState]
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

        await persistToken(newToken);
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
          await persistToken(null);
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
  }, [authState.token, persistToken, safeSetAuthState]);

  // Logout
  const logout = useCallback(async () => {
    safeSetAuthState({
      token: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
    });
    await persistToken(null);
    activeRefreshPromise = null;
  }, [persistToken, safeSetAuthState]);

  // Clear error
  const clearError = useCallback(() => {
    safeSetAuthState({ error: null });
  }, [safeSetAuthState]);

  // Load stored token on mount
  useEffect(() => {
    let mounted = true;

    const loadStoredAuth = async () => {
      try {
        const storedData = await AsyncStorage.getItem(SPOTIFY_AUTH_STORAGE_KEY);

        if (!mounted) return;

        if (storedData) {
          const token = JSON.parse(storedData) as SpotifyAuthToken;

          // Check if token needs refresh
          const expiresAt = new Date(token.expiresAt).getTime();
          const now = Date.now();
          const needsRefresh = expiresAt - TOKEN_REFRESH_BUFFER_MS <= now;

          if (needsRefresh && token.refreshToken) {
            // Set token temporarily and trigger refresh
            safeSetAuthState({
              token,
              isLoading: false,
              isRefreshing: true,
            });
            // Don't await - let it refresh in background
            refreshToken();
          } else {
            safeSetAuthState({
              token,
              isLoading: false,
            });
          }
        } else {
          safeSetAuthState({ isLoading: false });
        }
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
  }, []); // Only run on mount

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
