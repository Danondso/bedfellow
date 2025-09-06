import { useCallback, useContext } from 'react';
import { SpotifyAuthContext, type SpotifyAuthContextData } from '@context/SpotifyAuthContext';
import { findAndQueueTrack } from '../../services/spotify/SpotifyAPI.service';
import { BedfellowSample } from '../../types/bedfellow-api';

/**
 * Hook for managing Spotify queue operations.
 * Provides methods to add tracks to the Spotify playback queue.
 *
 * @returns {Object} An object containing:
 * - addToQueue: Function to add a sample track to the Spotify queue
 *
 * @example
 * ```tsx
 * const { addToQueue } = useQueue();
 *
 * // Add a track to queue
 * const result = await addToQueue(sampleItem);
 * ```
 */
const useQueue = () => {
  const { authState } = useContext(SpotifyAuthContext) as SpotifyAuthContextData;

  const addToQueue = useCallback(
    async (item: BedfellowSample): Promise<string> => {
      if (!authState.token) {
        return 'Not authenticated with Spotify';
      }

      try {
        const result = await findAndQueueTrack(item, authState.token);
        return result;
      } catch (error) {
        console.error('Error adding to queue:', error);
        return 'Failed to add track to queue';
      }
    },
    [authState.token]
  );

  return {
    addToQueue,
  };
};

export default useQueue;
