import { useContext, useEffect } from 'react';
import { SpotifyAuthContext, type SpotifyAuthContextData } from '@context/SpotifyAuthContext';
import { performPlaybackAction, spotifyGETData } from '@services/spotify/SpotifyAPI.service';
import { useState } from 'react';
import type { UsePlayerHookResponse } from './types';

type PlaybackAction = 'play' | 'pause' | 'forward' | 'backward';

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
      const { data } = await spotifyGETData('v1/me/player/currently-playing', token);
      setCurrentTrack(data);
      setLoading(false);
      return data;
    } catch (error: any) {
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

  const playbackWrapper = (action: PlaybackAction) => performPlaybackAction(action, token);

  const forward = async () => await playbackWrapper('forward');

  const pause = async () => {
    try {
      await playbackWrapper('pause');
      setIsPaused(true);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const backward = async () => await playbackWrapper('backward');

  const play = async () => {
    try {
      await playbackWrapper('play');
      setIsPaused(false);
    } catch (err: any) {
      setError(err);
      throw err;
    }
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
