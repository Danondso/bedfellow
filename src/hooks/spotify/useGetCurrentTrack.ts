import { spotifyGETData } from '@services/spotify/SpotifyAPI.service';
import SpotifyAuthContext, { type SpotifyAuthContextData } from '@context/SpotifyAuthContext';
import { useContext, useState } from 'react';
import type { UseGetCurrentTrackHookResponse } from './types';

/**
 * @private
 * Internal hook for fetching current track data from Spotify.
 * This hook is intended to be used exclusively by the useSpotify domain hook.
 *
 * @param authState - The Spotify authentication state
 * @returns Hook response with getData method and loading/error states
 *
 * @internal
 */
const useGetCurrentTrack = (): UseGetCurrentTrackHookResponse => {
  // @ts-expect-error
  const { token } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.CurrentPlaybackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async () => {
    setLoading(true);
    setError(null);
    if (!token) throw new Error('No access token available');

    try {
      const { data } = await spotifyGETData('/me/player/current-track', token);
      setCurrentTrack(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error('Failed to fetch Spotify data:', error);
      setError('Failed to fetch Spotify data');
      setLoading(false);
      throw error;
    }
  };

  return {
    getData,
    currentTrack,
    error,
    loading,
  };
};

export default useGetCurrentTrack;
