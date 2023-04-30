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

function useSpotifyAPI(spotifyAuth: SpotifyAuthentication, url: string) {
  const [currentSongInfo, setCurrentSongInfo] =
    useState<CurrentPlaybackResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function resetState() {
    setCurrentSongInfo(undefined);
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
      setCurrentSongInfo(result.data);
    } catch (e) {
      console.error(e);
      setError(true);
    }
    setLoading(false);
  }

  return { currentSongInfo, loading, error, loadData }; // TODO make a type for this so we can share it
}

export default useSpotifyAPI;
