import axios, { AxiosError, AxiosResponse } from 'axios';
import { Sample, SearchResponse, TrackWithSamples } from '../../../src/types/whosampled';
import * as WhoSampledService from '../../../src/services/whosampled/WhoSampled.service';

Date.now = () => 1720182766616;

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WhoSampled.service Test Suite', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('searchWhoSampled', () => {
    it('retrieves search results successfully', async () => {
      const searchResultsResponse: AxiosResponse<SearchResponse> = {
        data: {
          tracks: [
            {
              id: 123,
              url: '/Milo/souvenir',
              artist_name: 'Milo',
              track_name: 'souvenir',
              image_url: 'https://image.url',
              counts: '300 samples',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          // @ts-ignore
          headers: undefined,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(searchResultsResponse);

      const result: SearchResponse | null = await WhoSampledService.searchWhoSampled('Milo', 'souvenir');

      expect(result).toEqual(searchResultsResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.whosampled.com/ajax/search/?q=Milo souvenir&_=1720182766616'
      );
    });

    it('returns null if status code is not 200', async () => {
      const searchResultsResponse: AxiosResponse<null> = {
        data: null,
        status: 204,
        statusText: 'OK',
        headers: {},
        config: {
          // @ts-ignore
          headers: undefined,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(searchResultsResponse);

      const result: SearchResponse | null = await WhoSampledService.searchWhoSampled(
        'Notorious B.I.G.',
        'Folk-Metaphysics'
      );

      expect(result).toEqual(searchResultsResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.whosampled.com/ajax/search/?q=Notorious B.I.G. Folk-Metaphysics&_=1720182766616'
      );
    });

    it('returns null if failure to call API occurs', async () => {
      const searchResultsResponse: AxiosError<null> = {
        data: null,
        status: 404,
        statusText: 'NOT_FOUND',
        headers: {},
        config: {
          // @ts-ignore
          headers: undefined,
        },
      };
      mockedAxios.get.mockRejectedValueOnce(searchResultsResponse);

      const result: SearchResponse | null = await WhoSampledService.searchWhoSampled(
        'Notorious B.I.G.',
        'Folk-Metaphysics'
      );

      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.whosampled.com/ajax/search/?q=Notorious B.I.G. Folk-Metaphysics&_=1720182766616'
      );
    });
  });
});
