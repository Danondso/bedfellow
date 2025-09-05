import useGetSamples from './useGetSamples';
import useSubmitSamples from './useSubmitSamples';
import { TrackWithSamples } from '../../types/whosampled';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';

/**
 * Domain hook for all Bedfellow sample-related data and actions.
 * This is the main entry point for consuming Bedfellow functionality in the application.
 *
 * @returns {Object} An object containing:
 * - samples: Methods and state for fetching sample data from the Bedfellow database
 *   - getBedfellowData: Fetch samples for a specific artist and track
 *   - samples: The fetched sample data
 *   - loading: Loading state for sample fetching
 *   - error: Any error that occurred during fetching
 * - mutations: Methods for modifying sample data
 *   - submitBedfellowData: Submit new sample data to the database
 * - getSamplesWithFallback: Orchestration method that tries DB first, then falls back to scraping
 *
 * @example
 * ```tsx
 * const { samples, mutations, getSamplesWithFallback } = useBedfellow();
 *
 * // Fetch samples with fallback to scraping
 * const samplesData = await getSamplesWithFallback(
 *   'Artist Name',
 *   'Track Name',
 *   async () => await scrapeSamplesFromWhoSampled(artist, track)
 * );
 *
 * // Or fetch directly from DB
 * await samples.getBedfellowData('Artist Name', 'Track Name');
 *
 * // Submit new samples manually
 * const success = await mutations.submitBedfellowData.submitBedfellowData(whoSampledData);
 * ```
 */
const useBedfellow = () => {
  const samples = useGetSamples();
  const submitBedfellowData = useSubmitSamples();

  /**
   * Attempts to get samples from the database first, then falls back to a provided fetcher.
   * This orchestrates the common pattern of "check DB, scrape if needed, save, and return".
   *
   * @param artist - The artist name to search for
   * @param track - The track name to search for
   * @param fallbackFetcher - Optional async function to fetch samples if not in DB
   * @returns The samples data if found or fetched, null otherwise
   */
  const getSamplesWithFallback = async (
    artist: string,
    track: string,
    fallbackFetcher?: () => Promise<TrackWithSamples | null>
  ): Promise<BedfellowTrackSamples | null> => {
    // Try to get from DB first
    const dbSamples = await samples.getBedfellowData(artist, track);

    // If we have samples, return them
    if (dbSamples) {
      return dbSamples;
    }

    // If no samples and we have a fallback fetcher, try to get and save them
    if (!dbSamples && fallbackFetcher) {
      try {
        const fallbackData = await fallbackFetcher();
        if (fallbackData) {
          const success = await submitBedfellowData.submitBedfellowData(fallbackData);
          if (success) {
            // Fetch the newly saved samples and return them
            const freshSamples = await samples.getBedfellowData(artist, track);
            return freshSamples;
          }
        }
      } catch (error) {
        console.error('Error in fallback fetcher:', error);
      }
    }

    return null;
  };

  return {
    samples,
    mutations: {
      submitBedfellowData,
    },
    getSamplesWithFallback,
  };
};

export default useBedfellow;
