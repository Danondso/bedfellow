import axios from 'axios';
import { useState } from 'react';
import { SpotifyAuthentication } from '../../context/SpotifyAuthContext';
import { CurrentPlaybackResponse } from '../../types/spotify-api';

const BASE_URL = 'https://api.spotify.com/';

const buildHeaders = (spotifyAuth: SpotifyAuthentication): Object => ({
  headers: {
    Authorization: `Bearer ${spotifyAuth.accessToken}`,
    'Content-Type': 'application/json',
  },
});

type SpotifyAPIHookResponse = {
  loadData: () => void;
  loading: boolean;
  error: boolean;
  response?: unknown;
};

function useSpotifyAPI(
  spotifyAuth: SpotifyAuthentication,
  url: string,
): SpotifyAPIHookResponse {
  const [response, setResponse] = useState<CurrentPlaybackResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function resetState() {
    setResponse(undefined);
    setLoading(true);
    setLoading(false);
  }

  async function loadData() {
    resetState();
    setLoading(true);
    try {
      const result = await axios.get<CurrentPlaybackResponse>(
        `${BASE_URL}${url}`,
        buildHeaders(spotifyAuth),
      );
      setResponse(result.data);
    } catch (e) {
      console.error(e);
      setError(true);
    }
    setLoading(false);
  }

  return { response, loading, error, loadData };
}

export default useSpotifyAPI;
