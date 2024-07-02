import axios from 'axios';
import { useEffect, useState } from 'react';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { TrackObjectFull } from '../../types/spotify-api';

const BASE_URL = process.env.BEDFELLOW_DB_API_BASE_URL;

type BedfellowAPIResponse = {
  loading: boolean;
  error: boolean;
  sampleData?: BedfellowTrackSamples;
};
function useBedfellowAPI(trackInfo: TrackObjectFull): BedfellowAPIResponse {
  const [sampleData, setSampleData] = useState<BedfellowTrackSamples>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const resetState = () => {
      setSampleData(undefined);
      setLoading(false);
      setError(false);
    };
    const loadData = async () => {
      resetState();
      setLoading(true);
      try {
        if (!trackInfo) {
          setError(true);
          setLoading(false);
          setSampleData(undefined);
        } else {
          const url = `/samples?artist_name=${trackInfo?.album.artists[0]?.name}&track_name=${trackInfo?.name}`;
          const result = await axios.get(`${BASE_URL}${url}`);
          setSampleData(result.data as BedfellowTrackSamples);
        }
      } catch (e) {
        console.error('ERROR:: useBedfellowAPI', e);
        setError(true);
      }
      setLoading(false);
    };
    loadData();
  }, [trackInfo]);

  return { sampleData, loading, error };
}

export default useBedfellowAPI;
