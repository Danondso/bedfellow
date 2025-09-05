import useGetSamples from './useGetSamples';
import useSubmitSamples from './useSubmitSamples';

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
 *
 * @example
 * ```tsx
 * const { samples, mutations } = useBedfellow();
 *
 * // Fetch samples for a track
 * await samples.getBedfellowData('Artist Name', 'Track Name');
 *
 * // Access the fetched samples
 * if (samples.samples) {
 *   console.log('Found samples:', samples.samples);
 * }
 *
 * // Submit new samples from WhoSampled
 * const whoSampledData = await parseWhoSampled(artists, track);
 * const success = await mutations.submitBedfellowData.submitBedfellowData(whoSampledData);
 * ```
 */
const useBedfellow = () => {
  const samples = useGetSamples();
  const submitBedfellowData = useSubmitSamples();

  return {
    samples,
    mutations: {
      submitBedfellowData,
    },
  };
};

export default useBedfellow;
