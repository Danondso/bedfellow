import { useMemo } from 'react';
import { useMusicProvider } from '../context/MusicProviderContext';
import type { SpotifyAuthToken } from '../types/auth';

/**
 * Convenience hook to access authentication state and methods from MusicProviderContext
 *
 * @returns Auth state and methods for the active provider
 */
export const useAuth = () => {
  const { authState, authorize, refreshSession, logout, clearError, isTokenExpiring, getSession, activeProviderId } =
    useMusicProvider();

  const session = getSession(activeProviderId);

  // Convert ProviderAuthSession to SpotifyAuthToken format for backward compatibility
  const token = useMemo<SpotifyAuthToken | null>(() => {
    if (!session) return null;

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken ?? '',
      expiresAt: session.expiresAt ?? new Date(Date.now() + 3600000).toISOString(),
      tokenType: session.tokenType ?? 'Bearer',
      scopes: session.scopes ?? [],
    };
  }, [session]);

  return {
    // Auth state
    authState,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    isRefreshing: authState.isRefreshing,
    error: authState.error,

    // Session data
    session,
    token,

    // Auth methods
    authorize: () => authorize(activeProviderId),
    refreshSession: () => refreshSession(activeProviderId),
    logout: () => logout(activeProviderId),
    clearError,
    isTokenExpiring: () => isTokenExpiring(activeProviderId),

    // Provider info
    activeProviderId,
  };
};

export default useAuth;
