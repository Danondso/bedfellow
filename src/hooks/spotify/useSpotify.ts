import useGetSearch from './useGetSearch';
import type { UseSpotifyHookResponse } from './types';
import usePlayer from './usePlayer';
import useProfile from './useProfile';

/**
 * Domain hook for all Spotify-related data and actions.
 * This is the main entry point for consuming Spotify functionality in the application.
 *
 * @returns {UseSpotifyHookResponse} An object containing:
 * - search: Methods and state for searching Spotify tracks
 * - playback: Methods for controlling Spotify playback (play, pause, skip, etc.)
 * - profile: Methods and state for fetching user profile information
 *
 * @example
 * ```tsx
 * const { search, playback, profile } = useSpotify();
 *
 * // Search for tracks
 * await search.search('artist name');
 *
 * // Control playback
 * playback.actions.play();
 * playback.actions.pause();
 *
 * // Access profile data
 * if (profile.profile) {
 *   console.log(profile.profile.display_name);
 * }
 * ```
 */
const useSpotify = (): UseSpotifyHookResponse => {
  const search = useGetSearch();
  const playback = usePlayer();
  const profile = useProfile();

  return {
    search,
    playback,
    profile,
  };
};

export default useSpotify;
