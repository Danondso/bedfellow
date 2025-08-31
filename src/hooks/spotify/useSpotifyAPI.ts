import { useContext, useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../context/SpotifyAuthContext';
// Types from @types/spotify-api are available globally via SpotifyApi namespace
import { spotifyGETData } from '../../services/spotify/SpotifyAPI.service';

type SpotifyAPIHookResponse = {
  loadData: () => void;
  loading: boolean;
  error: ApiError | null;
  response?: unknown;
};

type ApiError = {
  message: string;
  status: number;
};

function useSpotifyAPI(url: string): SpotifyAPIHookResponse {
  const { authState, refreshToken } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const [response, setResponse] = useState<SpotifyApi.CurrentPlaybackResponse | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function resetState() {
    setResponse(undefined);
    setError(null);
    setLoading(false);
  }

  const loadData = useCallback(async () => {
    resetState();
    setLoading(true);

    try {
      const result = await spotifyGETData(url, authState.token);
      setResponse(result.data);
      setError(null);
    } catch (e) {
      const apiError = e as AxiosError;

      // If we get a 401, try to refresh the token and retry
      if (apiError.response?.status === 401 && authState.token) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request with the new token
          try {
            const result = await spotifyGETData(url, authState.token);
            setResponse(result.data);
            setError(null);
            setLoading(false);
            return;
          } catch (retryError) {
            // Retry failed, fall through to error handling
          }
        }
      }

      setError({
        message: apiError.message,
        status: apiError.response?.status || 0,
      });
    }
    setLoading(false);
  }, [url, authState.token, refreshToken]);

  return { response, loading, error, loadData };
}

export default useSpotifyAPI;
