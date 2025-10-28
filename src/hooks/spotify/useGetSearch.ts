import { spotifyGETData } from '@services/spotify/SpotifyAPI.service';
import { useState } from 'react';
import type { UseGetSearchHookResponse } from './types';
import { useAuth } from '../useAuth';

/**
 * @private
 * Internal hook for searching tracks on Spotify.
 * This hook is intended to be used exclusively by the useSpotify domain hook.
 *
 * @returns Hook response with getData method and loading/error states
 *
 * @internal
 */
const useGetSearch = (): UseGetSearchHookResponse => {
  const { token } = useAuth();
  const [searchResults, setSearchResults] = useState<SpotifyApi.SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const search = async (query: string) => {
    setLoading(true);
    setError(null);
    if (!token) throw new Error('No access token available');

    try {
      const { data } = await spotifyGETData(`v1/search?q=${encodeURIComponent(query)}&type=track`, token);
      setSearchResults(data);
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
    search,
    searchResults,
    error,
    loading,
  };
};

export default useGetSearch;
