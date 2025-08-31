import { useContext, useState, useCallback, useRef, useEffect } from 'react';
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

  // Keep a ref to the latest token to use after refresh
  const tokenRef = useRef(authState.token);

  // Update the ref whenever authState.token changes
  useEffect(() => {
    tokenRef.current = authState.token;
  }, [authState.token]);

  function resetState() {
    setResponse(undefined);
    setError(null);
    setLoading(false);
  }

  const loadData = useCallback(async () => {
    resetState();
    setLoading(true);

    try {
      const result = await spotifyGETData(url, tokenRef.current);
      setResponse(result.data);
      setError(null);
    } catch (e) {
      const apiError = e as AxiosError;

      // If we get a 401, try to refresh the token and retry
      if (apiError.response?.status === 401 && tokenRef.current) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // After refresh, tokenRef will be updated via the useEffect
          // Wait a tick for the context to update
          await new Promise((resolve) => setTimeout(resolve, 0));

          try {
            // Now use the updated token from the ref
            const result = await spotifyGETData(url, tokenRef.current);
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
  }, [url, refreshToken]);

  return { response, loading, error, loadData };
}

export default useSpotifyAPI;
