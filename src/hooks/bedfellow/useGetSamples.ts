import { getBedfellowDBData } from '@services/bedfellow-db-api/BedfellowDBAPI.service';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { useState } from 'react';

const useGetSamples = () => {
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<BedfellowTrackSamples | null>(null);
  const [error, setError] = useState(null);

  const getBedfellowData = async (artist: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBedfellowDBData(artist, name);
      setSamples(data);
    } catch (error: any) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    getBedfellowData,
    samples,
    error,
    loading,
  };
};

export default useGetSamples;
