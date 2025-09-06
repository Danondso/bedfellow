import { postToBedfellowDB } from '@services/bedfellow-db-api/BedfellowDBAPI.service';
import { TrackWithSamples } from '../../types/whosampled';
import { useState } from 'react';

/**
 * Hook for submitting new sample data to the Bedfellow database.
 * Handles the creation of sample records parsed from WhoSampled or other sources.
 *
 * @returns {Object} An object containing:
 * - submitBedfellowData: Async function to submit sample data to the database
 * - loading: Boolean indicating if a submission is in progress
 * - error: Error object if the submission failed, null otherwise
 *
 * @example
 * ```tsx
 * const { submitBedfellowData, loading, error } = useSubmitSamples();
 *
 * // Parse sample data from WhoSampled
 * const whoSampledData = await searchAndRetrieveParsedWhoSampledPage(artists, trackName);
 *
 * // Submit the data
 * const success = await submitBedfellowData(whoSampledData);
 *
 * if (success) {
 *   console.log('Samples saved successfully');
 *   // Refresh the samples list
 *   await fetchSamples();
 * } else {
 *   console.error('Failed to save samples', error);
 * }
 * ```
 */
const useSubmitSamples = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Submits sample data to the Bedfellow database.
   * Creates new records for artists, tracks, and sample relationships as needed.
   *
   * @param {TrackWithSamples} request - The sample data to submit, typically parsed from WhoSampled
   * @returns {Promise<boolean>} Returns true if submission was successful, false otherwise
   */
  const submitBedfellowData = async (request: TrackWithSamples) => {
    setLoading(true);
    setError(null);
    try {
      await postToBedfellowDB(request);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      return false;
    }
  };

  return { submitBedfellowData, loading, error };
};

export default useSubmitSamples;
