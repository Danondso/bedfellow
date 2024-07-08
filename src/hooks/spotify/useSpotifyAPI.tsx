import { useContext, useState } from 'react';
import { AxiosError } from 'axios';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../context/SpotifyAuthContext';
import { CurrentPlaybackResponse } from '../../types/spotify-api';
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
  const { spotifyAuth } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const [response, setResponse] = useState<CurrentPlaybackResponse | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function resetState() {
    setResponse(undefined);
    setError(null);
    setLoading(false);
  }

  async function loadData() {
    resetState();
    setLoading(true);
    // TODO, handle not founds and maybe implement memoizing the result based on the constructed URL
    // so we don't spam it
    try {
      const result = await spotifyGETData(url, spotifyAuth);
      setResponse(result.data);
      setError(null);
    } catch (e) {
      const apiError = e as AxiosError;
      setError({
        message: apiError.message,
        status: apiError.response?.status || 0,
      });
    }
    setLoading(false);
  }

  return { response, loading, error, loadData };
}

export default useSpotifyAPI;
