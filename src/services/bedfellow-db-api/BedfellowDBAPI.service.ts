import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { TrackWithSamples } from '../../types/whosampled';

export const postToBedfellowDB = async (requestBody: TrackWithSamples) => {
  try {
    const response = await axios.post(`${Config.BEDFELLOW_DB_API_BASE_URL}/samples`, requestBody);
    return response.status === 204;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 409) {
      throw new Error('Sample already exists!');
    }
    return false;
  }
};

export const getBedfellowDBData = async (artist: string, track: string): Promise<BedfellowTrackSamples | null> => {
  if (!artist || !track) {
    return null;
  }

  try {
    const url = `/samples?artist_name=${artist}&track_name=${track}`;
    const result = await axios.get(`${Config.BEDFELLOW_DB_API_BASE_URL}${url}`);
    return result.data;
  } catch (error) {
    return null;
  }
};
