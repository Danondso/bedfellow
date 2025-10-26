import React, { createContext, useState, useCallback, ReactNode, useEffect, Context, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastFmAuthContextData, LastFmAuthToken, LastFmAuthState } from './types';

const LASTFM_AUTH_STORAGE_KEY = '@bedfellow/lastfm_auth';

const initialAuthState: LastFmAuthState = {
  token: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
};

export const LastFmAuthContext: Context<LastFmAuthContextData> = createContext<LastFmAuthContextData>({
  authState: initialAuthState,
  setAuthToken: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  clearError: () => {},
});

function LastFmAuthContextProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<LastFmAuthState>(initialAuthState);
  const isMountedRef = useRef(true);

  // Helper function to safely update state only if component is mounted
  const safeSetAuthState = useCallback(
    (updater: Partial<LastFmAuthState> | ((prev: LastFmAuthState) => LastFmAuthState)) => {
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

  // Store token in AsyncStorage
  const persistToken = useCallback(async (token: LastFmAuthToken | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem(LASTFM_AUTH_STORAGE_KEY, JSON.stringify(token));
      } else {
        await AsyncStorage.removeItem(LASTFM_AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist last.fm auth token:', error);
    }
  }, []);

  // Set auth token from login
  const setAuthToken = useCallback(
    async (sessionKey: string, username: string) => {
      try {
        // TODO: Fetch API key from config or backend
        const apiKey = 'placeholder_api_key';
        
        const token: LastFmAuthToken = {
          sessionKey,
          username,
          apiKey,
        };
        
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
    [persistToken, safeSetAuthState]
  );

  // Logout
  const logout = useCallback(async () => {
    safeSetAuthState({
      token: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
    });
    await persistToken(null);
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
        const storedData = await AsyncStorage.getItem(LASTFM_AUTH_STORAGE_KEY);

        if (!mounted) return;

        if (storedData) {
          const token = JSON.parse(storedData) as LastFmAuthToken;

          safeSetAuthState({
            token,
            isLoading: false,
          });
        } else {
          safeSetAuthState({ isLoading: false });
        }
      } catch (error) {
        console.error('Failed to load stored last.fm auth:', error);
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

  // Calculate isAuthenticated separately to avoid circular dependency
  const isAuthenticated = useMemo(() => {
    return authState.token !== null && !authState.isLoading;
  }, [authState.token, authState.isLoading]);

  const contextValue: LastFmAuthContextData = useMemo(
    () => ({
      authState,
      setAuthToken,
      logout,
      isAuthenticated,
      clearError,
    }),
    [authState, setAuthToken, logout, isAuthenticated, clearError]
  );

  return <LastFmAuthContext.Provider value={contextValue}>{children}</LastFmAuthContext.Provider>;
}

// Hook for using the context
export function useLastFmAuth(): LastFmAuthContextData {
  const context = React.useContext(LastFmAuthContext);
  if (!context) {
    throw new Error('useLastFmAuth must be used within a LastFmAuthContextProvider');
  }
  return context;
}

export { LastFmAuthContext };
export default LastFmAuthContextProvider;
export { type LastFmAuthContextData, type LastFmAuthToken, type LastFmAuthState } from './types';

