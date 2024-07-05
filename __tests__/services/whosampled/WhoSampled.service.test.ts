import axios, { AxiosError, AxiosResponse } from 'axios';
import { SearchResponse, TrackWithSamples } from '../../../src/types/whosampled';
import * as WhoSampledService from '../../../src/services/whosampled/WhoSampled.service';
import { ArtistObjectSimplified } from '../../../src/types/spotify-api';
import sampleMultiple0 from '../../fixtures/api/whosampled/sample-multiple.0';
import sampleSingle0 from '../../fixtures/api/whosampled/sample-single.0';

import sampleResults from '../../fixtures/api/bedfellow-db-api/sample-info.0';

Date.now = () => 1720182766616;

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WhoSampled.service Test Suite', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('searchAndRetrieveParsedWhoSampledPage', () => {
    it('searches, fails, finds correct page and parses correctly', async () => {
      const singleSampleResult: TrackWithSamples = {
        artist_name: 'Kanye West',
        track_name: 'Bound 2',
        samples: [
          {
            artist: 'Hubert Laws',
            image: 'https://www.whosampled.com/static/images/media/track_images_200/lr2825_20101222_62421395633.jpg',
            track: 'The Rite of Spring',
            year: 1972,
          },
        ],
      };
      const artists: ArtistObjectSimplified[] = [
        {
          name: 'Kanye West',
          id: '234635737',
          type: 'artist',
          href: '',
          external_urls: {
            spotify: '',
          },
          uri: '',
        },
      ];
      const name: string = 'Bound 2';
      // we start by searching
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          tracks: [
            {
              id: 124124,
              url: '/Kanye-West/Bound-2',
              artist_name: 'Kanye West',
              track_name: 'Bound 2',
              image_url: 'https://localhost/ba',
              counts: 'Like a bunch',
            },
          ],
        },
        status: 200,
      });

      // first we fail to get the doc because /samples isn't found (ie not enough for WhoSampled to have its own page for that tracks samples)
      mockedAxios.get.mockRejectedValueOnce({
        data: null,
        response: {
          status: 404,
        },
      });

      // then we get the document correctly using the url sans '/samples'
      mockedAxios.get.mockResolvedValueOnce({
        data: sampleSingle0,
        status: 200,
      });

      // then finally, we fail to download images for coverage reasons
      mockedAxios.get.mockRejectedValueOnce({
        status: 404,
      });

      const result = await WhoSampledService.searchAndRetrieveParsedWhoSampledPage(artists, name);
      expect(result).toEqual(singleSampleResult);
      expect(mockedAxios.get).toHaveBeenCalledTimes(4);
    });

    it('searches and parses correctly', async () => {
      const artists: ArtistObjectSimplified[] = [
        {
          name: 'Kanye West',
          id: '234635737',
          type: 'artist',
          href: '',
          external_urls: {
            spotify: '',
          },
          uri: '',
        },
      ];
      const name: string = 'Bound 2';
      // we start by searching
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          tracks: [
            {
              id: 124124,
              url: '/Kanye-West/Bound-2',
              artist_name: 'Kanye West',
              track_name: 'Bound 2',
              image_url: 'https://localhost/ba',
              counts: 'Like a bunch',
            },
          ],
        },
        status: 200,
      });

      // then we get the document
      mockedAxios.get.mockResolvedValueOnce({
        data: sampleMultiple0,
        status: 200,
      });

      // then finally, we download the images
      mockedAxios.get.mockResolvedValue({
        data: 'data:image/jpeg;base64,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',
      });

      const result = await WhoSampledService.searchAndRetrieveParsedWhoSampledPage(artists, name);
      expect(result).toEqual(sampleResults);
      expect(mockedAxios.get).toHaveBeenCalledTimes(6);
    });

    it('returns null early if search results come up with nothing', async () => {
      const artists: ArtistObjectSimplified[] = [
        {
          name: 'Kanye East',
          id: '234635737',
          type: 'artist',
          href: '',
          external_urls: {
            spotify: '',
          },
          uri: '',
        },
      ];
      const name: string = 'Bound';

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          tracks: [],
        },
        status: 200,
      });

      const result = await WhoSampledService.searchAndRetrieveParsedWhoSampledPage(artists, name);
      expect(result).toEqual(null);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
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

  describe('getParsedWhoSampledPage', () => {
    it('returns null when http call succeeds but fails to parse', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: 'this is not html' });
      mockedAxios.get.mockResolvedValueOnce(null);
      const result = await WhoSampledService.getParsedWhoSampledPage('/Dryjacket/Bill-Gates-Ringtone');
      expect(result).toEqual(null);
    });
    it('returns null when http call gets a 404 is falsey', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        status: 404,
        data: null,
      });
      const result = await WhoSampledService.getParsedWhoSampledPage('/Dryjacket/Bill-Gates-Ringtone');
      expect(result).toEqual(null);
    });
    it('returns null when urlFragment is falsey', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        status: 404,
        data: null,
      });
      const result = await WhoSampledService.getParsedWhoSampledPage('');
      expect(result).toEqual(null);
    });
  });

  describe('getWhoSampledImage', () => {
    beforeEach(() => jest.resetAllMocks());
    it('returns null when url is falsey', async () => {
      expect(await WhoSampledService.getWhoSampledImage(null)).toEqual(null);
    });
  });
});
