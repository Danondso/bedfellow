import { useContext, useEffect } from 'react';
import { SpotifyAuthContext, type SpotifyAuthContextData } from '@context/SpotifyAuthContext';
import { performPlaybackAction, spotifyGETData } from '@services/spotify/SpotifyAPI.service';
import { useState } from 'react';
import type { UsePlayerHookResponse } from './types';
import { type AxiosError } from 'axios';

const usePlayer = (): UsePlayerHookResponse => {
  const { authState } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { token } = authState;
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.CurrentPlaybackResponse | null>(null);
  const [error, setError] = useState<SpotifyApi.ErrorObject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(currentTrack?.is_playing === false);

  const getData = async () => {
    setLoading(true);
    setError(null);
    if (!token) throw new Error('No access token available');

    try {
      console.log('Fetching current playback data from Spotify');
      const { data } = await spotifyGETData('v1/me/player/currently-playing', token);
      setCurrentTrack(data);
      setLoading(false);
      return data;
    } catch (error: AxiosError<SpotifyApi.ErrorObject> | any) {
      console.error('Failed to fetch Spotify data:', error);
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);

  const refresh = async () => await getData();

  const playbackWrapper = (action: string) => performPlaybackAction(action, token);

  const forward = () => playbackWrapper('forward');

  const pause = () => {
    setIsPaused(true);
    playbackWrapper('pause');
  };
  const backward = () => playbackWrapper('backward');
  const play = () => {
    setIsPaused(false);
    playbackWrapper('play');
  };

  return {
    actions: {
      forward,
      isPaused,
      pause,
      play,
      backward,
    },
    playing: {
      refresh,
      track: currentTrack,
      error,
      loading,
    },
  };
};

export default usePlayer;
