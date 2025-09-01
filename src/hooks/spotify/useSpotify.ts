import { useContext } from 'react';
import { SpotifyAuthContext, type SpotifyAuthContextData } from '../../context/SpotifyAuthContext';
import useGetCurrentTrack from './useGetCurrentTrack';
import useGetSearch from './useGetSearch';
import usePlayback from './usePlayback';
import type { UseSpotifyHookResponse } from './types';

/**
 * Domain hook for all Spotify-related data and actions.
 * This is the main entry point for consuming Spotify functionality in the application.
 *
 * @returns {UseSpotifyHookResponse} An object containing:
 * - currentTrack: Methods and state for fetching current track information
 * - search: Methods and state for searching Spotify tracks
 * - playback: Methods for controlling Spotify playback (play, pause, skip, etc.)
 *
 * @example
 * ```tsx
 * const { currentTrack, search, playback } = useSpotify();
 *
 * // Get current track
 * await currentTrack.getData();
 *
 * // Search for tracks
 * await search.getData('artist name');
 *
 * // Control playback
 * playback.play();
 * playback.pause();
 * ```
 */
const useSpotify = (): UseSpotifyHookResponse => {
  const currentTrack = useGetCurrentTrack();
  const search = useGetSearch();
  const playback = usePlayback();

  return {
    currentTrack,
    search,
    playback,
  };
};

export default useSpotify;
