import { SpotifyAuthState } from '@context/SpotifyAuthContext';
import { performPlaybackAction } from '@services/spotify/SpotifyAPI.service';
import { useState } from 'react';
import type { UsePlaybackHookResponse } from './types';

/**
 * @private
 * Internal hook for controlling Spotify playback.
 * This hook is intended to be used exclusively by the useSpotify domain hook.
 *
 * @param token - The Spotify authentication token
 * @returns Hook response with playback control methods and pause state
 *
 * @internal
 */
const usePlayback = (): UsePlaybackHookResponse => {
  // @ts-expect-error
  const { token } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  // TODO: likely need some error handling in here whenever the auth state changes or there's nothing playing
  // is refresh needed in here?
  const [isPaused, setIsPaused] = useState(false);
  const forward = () => performPlaybackAction('forward', token);

  const pause = () => {
    setIsPaused(true);
    performPlaybackAction('pause', token);
  };
  const backward = () => performPlaybackAction('backward', token);
  const play = () => {
    setIsPaused(false);
    performPlaybackAction('play', token);
  };

  return {
    forward,
    pause,
    backward,
    play,
    isPaused,
  };
};

export default usePlayback;
