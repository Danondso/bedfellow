import { useContext } from 'react';
import { SpotifyAuthContext, type SpotifyAuthContextData } from '../../context/SpotifyAuthContext';

const useSpotify = () => {
  const { authState, refreshToken, isAuthenticated, isTokenExpiring } =
    useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  return {
    token: authState.token,
    isLoading: authState.isLoading,
    isRefreshing: authState.isRefreshing,
    error: authState.error,
    refreshToken,
    isAuthenticated,
    isTokenExpiring,
  };
};

export default useSpotify;
