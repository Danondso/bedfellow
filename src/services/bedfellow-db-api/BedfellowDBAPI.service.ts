import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { BedfellowTrackSamples, PaginatedSearchResponse, SearchQueryParams } from '../../types/bedfellow-api';
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

export const searchSamples = async (params: SearchQueryParams): Promise<PaginatedSearchResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append('q', params.q);
    if (params.cursor) queryParams.append('cursor', params.cursor);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const url = `/samples/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const result = await axios.get<PaginatedSearchResponse>(`${Config.BEDFELLOW_DB_API_BASE_URL}${url}`);
    return result.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error('Search samples error:', err.message);
    throw new Error('Failed to search samples');
  }
};
