import axios from 'axios';
import { useEffect, useState } from 'react';
import { WhoSampledResponse } from '../../types';
import { TrackObjectFull } from '../../types/spotify-api';

const BASE_URL = 'https://bedfellow-api.tunnelto.dev/sample-info/';

const normalizeString = (string: string) => string?.replace(/\s/g, '-');

type WhoSampledAPIHookResponse = {
  loading: boolean;
  error: boolean;
  sampleData?: WhoSampledResponse;
};

function useWhoSampledAPI(
  trackInfo: TrackObjectFull,
): WhoSampledAPIHookResponse {
  const [sampleData, setSampleData] = useState<WhoSampledResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const url = trackInfo
    ? `${normalizeString(trackInfo.artists[0].name)}/${normalizeString(
        trackInfo.name,
      )}`
    : '';

  useEffect(() => {
    const resetState = () => {
      setSampleData(undefined);
      setLoading(true);
      setLoading(false);
    };
    const loadData = async () => {
      resetState();
      setLoading(true);
      try {
        if (url) {
          const result = await axios.get(`${BASE_URL}${url}`);
          setSampleData(result.data as WhoSampledResponse);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
      setLoading(false);
    };
    loadData();
  }, [url]);

  return { sampleData, loading, error };
}

export default useWhoSampledAPI;
