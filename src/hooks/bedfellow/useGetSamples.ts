import { getBedfellowDBData } from '@services/bedfellow-db-api/BedfellowDBAPI.service';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { useState } from 'react';

/**
 * Hook for fetching sample data from the Bedfellow database.
 * Manages loading state, error handling, and caching of sample data.
 *
 * @returns {Object} An object containing:
 * - getBedfellowData: Async function to fetch samples for a specific artist and track
 * - samples: The fetched sample data (null if no data or not yet fetched)
 * - loading: Boolean indicating if a fetch operation is in progress
 * - error: Error object if the fetch failed, null otherwise
 *
 * @example
 * ```tsx
 * const { getBedfellowData, samples, loading, error } = useGetSamples();
 *
 * // Fetch samples
 * await getBedfellowData('Pink Floyd', 'Money');
 *
 * // Check results
 * if (loading) {
 *   return <LoadingSpinner />;
 * }
 *
 * if (error) {
 *   return <ErrorMessage error={error} />;
 * }
 *
 * if (samples) {
 *   return <SampleList samples={samples.samples} />;
 * }
 * ```
 */
const useGetSamples = () => {
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<BedfellowTrackSamples | null>(null);
  const [error, setError] = useState(null);

  /**
   * Fetches sample data for a specific track from the Bedfellow database.
   * Updates the hook's state with the fetched data or error.
   *
   * @param {string} artist - The name of the artist
   * @param {string} name - The name of the track
   * @returns {Promise<BedfellowTrackSamples | null>} The fetched sample data or null if not found/error
   */
  const getBedfellowData = async (artist: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBedfellowDBData(artist, name);
      setSamples(data);
      setLoading(false);
      return data;
    } catch (error: any) {
      setError(error);
      setLoading(false);
      return null;
    }
  };

  return {
    getBedfellowData,
    samples,
    error,
    loading,
  };
};

export default useGetSamples;
