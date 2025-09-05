import { postToBedfellowDB } from '@services/bedfellow-db-api/BedfellowDBAPI.service';
import { TrackWithSamples } from '../../types/whosampled';
import { useState } from 'react';

const useSubmitSamples = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const submitBedfellowData = async (request: TrackWithSamples) => {
    setLoading(true);
    setError(null);
    try {
      await postToBedfellowDB(request);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      return false;
    }
  };

  return { submitBedfellowData, loading, error };
};

export default useSubmitSamples;
