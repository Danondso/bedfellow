import axios, { AxiosError, AxiosResponse } from 'axios';
import { SearchResponse, TrackWithSamples } from '../../../src/types/whosampled';
import * as WhoSampledService from '../../../src/services/whosampled/WhoSampled.service';
import { ArtistObjectSimplified } from '../../../src/types/spotify-api';
import sampleMultiple0 from '../../fixtures/api/whosampled/html/sample-multiple-page.0';
import sampleSingle0 from '../../fixtures/api/whosampled/html/sample-single-page.0';

import sampleResults from '../../fixtures/api/bedfellow-db-api/sample-info.0';
import imageSuccess0 from '../../fixtures/api/whosampled/images/image-success.0';
import searchResult0 from '../../fixtures/api/whosampled/search/search-result.0';
import searchResult1 from '../../fixtures/api/whosampled/search/search-result.1';

Date.now = () => 1720182766616;

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WhoSampled.service Test Suite', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('searchAndRetrieveParsedWhoSampledPage', () => {
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

      const name: string = 'Bound 2';
      // we start by searching
      mockedAxios.get.mockResolvedValueOnce({
        data: searchResult0,
        status: 200,
      });

      // first we fail to get the doc because /samples isn't found
      // (ie not enough for WhoSampled to have its own page for that tracks samples)
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
      const name: string = 'Bound 2';
      // we start by searching
      mockedAxios.get.mockResolvedValueOnce({
        data: searchResult0,
        status: 200,
      });

      // then we get the document
      mockedAxios.get.mockResolvedValueOnce({
        data: sampleMultiple0,
        status: 200,
      });

      // then finally, we download the images
      mockedAxios.get.mockResolvedValue(imageSuccess0);

      const result = await WhoSampledService.searchAndRetrieveParsedWhoSampledPage(artists, name);
      expect(result).toEqual(sampleResults);
      expect(mockedAxios.get).toHaveBeenCalledTimes(6);
    });

    it('returns null early if search results come up with nothing', async () => {
      const artistWithoutSamples: ArtistObjectSimplified[] = [
        {
          ...artists[0],
          name: 'Kanye East',
        },
      ];
      const name: string = 'Bound';

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          tracks: [],
        },
        status: 200,
      });

      const result = await WhoSampledService.searchAndRetrieveParsedWhoSampledPage(artistWithoutSamples, name);
      expect(result).toEqual(null);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });
  describe('searchWhoSampled', () => {
    it('retrieves search results successfully', async () => {
      const searchResultsResponse: AxiosResponse<SearchResponse> = {
        data: searchResult1,
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
    it('returns null when http call gets a 404 is falsy', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        status: 404,
        data: null,
      });
      const result = await WhoSampledService.getParsedWhoSampledPage('/Dryjacket/Bill-Gates-Ringtone');
      expect(result).toEqual(null);
    });
    it('returns null when urlFragment is falsy', async () => {
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
    it('returns null when url is falsy', async () => {
      expect(await WhoSampledService.getWhoSampledImage(null)).toEqual(null);
    });
  });
});
