import axios, { AxiosError } from 'axios';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { TrackWithSamples } from '../../types/whosampled';

const { BEDFELLOW_DB_API_BASE_URL } = process.env;

export const postToBedfellowDB = async (requestBody: TrackWithSamples) => {
  try {
    const response = await axios.post(`${BEDFELLOW_DB_API_BASE_URL}/samples`, requestBody);
    return response.status === 204;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 409) {
      throw new Error('Sample already exists!');
    }
  }
};

export const getBedfellowDBData = async (artist: string, track: string): Promise<BedfellowTrackSamples | null> => {
  if (!artist || !track) {
    return null;
  }

  try {
    const BASE_URL = process.env.BEDFELLOW_DB_API_BASE_URL;
    const url = `/samples?artist_name=${artist}&track_name=${track}`;
    const result = await axios.get(`${BASE_URL}${url}`);
    return result.data;
  } catch (error) {
    return null;
  }
};
