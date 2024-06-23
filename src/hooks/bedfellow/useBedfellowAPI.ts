import axios from 'axios';
import { useEffect, useState } from 'react';
import { BedfellowTrackSamples } from '../../types';
import { TrackObjectFull } from '../../types/spotify-api';

const BASE_URL = process.env.BEDFELLOW_DB_API_BASE_URL;

// TODO we'll use this when calling whosampled
// tl;dr we strip out forward slashes in the title
// remove extra spaces so there's only one
// then replace all spaces with - to fit whosampled's URL scheme
// const normalizeString = (string: string) =>
//   string?.replace(/\//g, '').replace(/  +/g, ' ').replace(/\s/g, '-');
// const normalizeString = r

type BedfellowAPIResponse = {
  loading: boolean;
  error: boolean;
  sampleData?: BedfellowTrackSamples;
};

function useBedfellowAPI(trackInfo: TrackObjectFull): BedfellowAPIResponse {
  const [sampleData, setSampleData] = useState<BedfellowTrackSamples>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const url = `/samples?artist_name=${trackInfo.album.artists[0]?.name}&track_name=${trackInfo?.name}`;

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
        if (url) {
          console.log('INFO:: url:', `${BASE_URL}${url}`);
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
  }, [url]);

  return { sampleData, loading, error };
}

export default useBedfellowAPI;
