import axios from 'axios';
import * as SpotifyServiceModule from '../../../src/service/spotify/SpotifyAPI.service';
import {
  AuthResult,
  initialState,
} from '../../../src/context/SpotifyAuthContext';
import SpotifySearchResult from '../../fixtures/api/spotify/search-result-success.0';
import { WhoSampledData } from '../../../src/types';

const mockSpotifyAuth: AuthResult = {
  ...initialState,
  accessToken: 'fakeAccessToken',
  expired: false,
  refreshToken: 'refreshingToken',
};

const mockHeaders = {
  headers: {
    Authorization: 'Bearer fakeAccessToken',
    'Content-Type': 'application/json',
  },
};

const TEST_URL = 'test/url';
const MOCK_URL_FULL = 'https://api.spotify.com/test/url';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SpotifyAPI Service Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const okResponse = {
    data: {},
    status: 200,
  };

  const badResponse = {
    data: {},
    status: 500,
  };

  describe('spotifyPOSTData', () => {
    it('returns OK response', async () => {
      mockedAxios.post.mockResolvedValueOnce(okResponse);
      const result = await SpotifyServiceModule.spotifyPOSTData(
        'test/url',
        mockSpotifyAuth,
      );
      expect(result.status).toEqual(200);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        MOCK_URL_FULL,
        {},
        mockHeaders,
      );
    });

    it('returns NOT OK response', () => {
      mockedAxios.post.mockRejectedValueOnce(badResponse);
      SpotifyServiceModule.spotifyPOSTData(TEST_URL, mockSpotifyAuth).catch(
        err => {
          expect(err.status).toEqual(500);
          expect(axios.post).toHaveBeenCalledWith(
            MOCK_URL_FULL,
            {},
            mockHeaders,
          );
        },
      );
    });
  });

  describe('spotifyGETData', () => {
    it('returns OK response', async () => {
      mockedAxios.get.mockResolvedValueOnce(okResponse);
      const result = await SpotifyServiceModule.spotifyGETData(
        'test/url',
        mockSpotifyAuth,
      );
      expect(result.status).toEqual(200);
      expect(mockedAxios.get).toHaveBeenCalledWith(MOCK_URL_FULL, mockHeaders);
    });

    it('returns NOT OK response', async () => {
      mockedAxios.get.mockResolvedValueOnce(okResponse);
      SpotifyServiceModule.spotifyGETData(TEST_URL, mockSpotifyAuth).catch(
        err => {
          expect(err.status).toEqual(500);
          expect(mockedAxios.get).toHaveBeenCalledWith(
            MOCK_URL_FULL,
            mockHeaders,
          );
        },
      );
    });
  });

  describe('findAndQueueTrack', () => {
    const selectedTrack: WhoSampledData = {
      track_name: 'Haunted',
      artist: 'Haunted',
      year: 0,
      images: [],
    };
    const expectedSearchURL =
      'https://api.spotify.com/v1/search?q=%2620track%3AHaunted%2520artist%3AHaunted&type=track&limit=50';
    const expectedPOSTURL =
      'https://api.spotify.com/v1/me/player/queue?uri=spotify:track:09W5eWtrWsCJts8jAodFbP';

    it('finds and queues track', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: SpotifySearchResult });
      mockedAxios.post.mockResolvedValueOnce({
        status: 204,
      });
      const result = await SpotifyServiceModule.findAndQueueTrack(
        selectedTrack,
        mockSpotifyAuth,
      );
      expect(result).toEqual('Queued Haunted by Haunted');
      expect(axios.get).toHaveBeenCalledWith(expectedSearchURL, mockHeaders);
      expect(axios.post).toHaveBeenCalledWith(expectedPOSTURL, {}, mockHeaders);
    });

    it('finds track but is unable to post to queue', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: SpotifySearchResult });
      mockedAxios.post.mockRejectedValueOnce({
        error: {
          status: 400,
          message: 'Bad Request',
        },
      });
      const result = await SpotifyServiceModule.findAndQueueTrack(
        selectedTrack,
        mockSpotifyAuth,
      );
      expect(result).toEqual(
        'Unable to queue track, status: 400, message: Bad Request',
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expectedSearchURL,
        mockHeaders,
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expectedPOSTURL,
        {},
        mockHeaders,
      );
    });

    it('finds track that matches but is skipped due to word count difference in track name', async () => {
      const selectedTrackNotFound: WhoSampledData = {
        track_name: 'Haunted Mansion Man Duder Hollywood',
        artist: 'Haunted',
        year: 0,
        images: [],
      };
      const expectedURL =
        'https://api.spotify.com/v1/search?q=%2620track%3AHaunted%2BMansion+Man+Duder+Hollywood%2520artist%3AHaunted&type=track&limit=50';

      mockedAxios.get.mockResolvedValueOnce({ data: SpotifySearchResult });

      const result = await SpotifyServiceModule.findAndQueueTrack(
        selectedTrackNotFound,
        mockSpotifyAuth,
      );
      expect(result).toEqual(
        'Unable to find Haunted Mansion Man Duder Hollywood in search results',
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, mockHeaders);
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
    });

    it('finds track that matches and does not exceed word count of selected track', async () => {
      const selectedTrackNotFound: WhoSampledData = {
        track_name: 'Haunted - Acoustic',
        artist: 'Taylor Swift',
        year: 0,
        images: [],
      };
      const expectedURL =
        'https://api.spotify.com/v1/search?q=%2620track%3AHaunted%2B-+Acoustic%2520artist%3ATaylor%2BSwift&type=track&limit=50';
      const expectedPOSTURLFuzzyMatch =
        'https://api.spotify.com/v1/me/player/queue?uri=spotify:track:62rlxI6g2PNaWsHoiRryto';

      mockedAxios.get.mockResolvedValueOnce({ data: SpotifySearchResult });

      const result = await SpotifyServiceModule.findAndQueueTrack(
        selectedTrackNotFound,
        mockSpotifyAuth,
      );
      expect(result).toEqual(
        'Queued Haunted - Acoustic Version by Taylor Swift',
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, mockHeaders);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expectedPOSTURLFuzzyMatch,
        {},
        mockHeaders,
      );
    });
  });
});
