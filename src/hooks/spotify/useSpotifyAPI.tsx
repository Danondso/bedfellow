import { useContext, useState } from 'react';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
} from '../../context/SpotifyAuthContext';
import { CurrentPlaybackResponse } from '../../types/spotify-api';
import {
  spotifyGETData,
  spotifyPOSTData,
} from '../../service/spotify/SpotifyAPI.service';

type SpotifyAPIHookResponse = {
  loadData: () => void;
  loading: boolean;
  error: boolean;
  response?: unknown;
};

function useSpotifyAPI(
  url: string,
  httpMethod: string = 'GET',
  body: object = {},
): SpotifyAPIHookResponse {
  const { spotifyAuth } =
    useContext<SpotifyAuthContextData>(SpotifyAuthContext);
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
      if (httpMethod === 'GET') {
        const result = await spotifyGETData(url, spotifyAuth);
        setResponse(result.data);
      } else if (httpMethod === 'POST') {
        const result = await spotifyPOSTData(url, spotifyAuth, body);
        setResponse(result.data);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    }
    setLoading(false);
  }

  return { response, loading, error, loadData };
}

export default useSpotifyAPI;
