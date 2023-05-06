import axios from 'axios';
import * as SpotifyServiceModule from '../../../src/service/spotify/SpotifyAPI.service';
import { SpotifyAuthentication } from '../../../src/context/SpotifyAuthContext';
import SpotifySearchResult from '../../fixtures/api/spotify/search-result-success.0';
import { WhoSampledData } from '../../../src/types';

const mockSpotifyAuth: SpotifyAuthentication = {
  accessToken: 'fakeAccessToken',
  expirationDate: '',
  expired: false,
  refreshToken: 'refreshingToken',
  scope: 'scope',
};

const mockHeaders = {
  headers: {
    Authorization: 'Bearer fakeAccessToken',
    'Content-Type': 'application/json',
  },
};

const TEST_URL = 'test/url';
const MOCK_URL_FULL = 'https://api.spotify.com/test/url';

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
      // @ts-ignore
      axios.post.mockResolvedValueOnce(okResponse);
      const result = await SpotifyServiceModule.spotifyPOSTData(
        'test/url',
        mockSpotifyAuth,
      );
      expect(result.status).toEqual(200);
      expect(axios.post).toHaveBeenCalledWith(MOCK_URL_FULL, {}, mockHeaders);
    });

    it('returns NOT OK response', () => {
      // @ts-ignore
      axios.post.mockRejectedValueOnce(badResponse);
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
      // @ts-ignore
      axios.get.mockResolvedValueOnce(okResponse);
      const result = await SpotifyServiceModule.spotifyGETData(
        'test/url',
        mockSpotifyAuth,
      );
      expect(result.status).toEqual(200);
      expect(axios.get).toHaveBeenCalledWith(MOCK_URL_FULL, mockHeaders);
    });

    it('returns NOT OK response', async () => {
      // @ts-ignore
      axios.get.mockResolvedValueOnce(okResponse);
      SpotifyServiceModule.spotifyGETData(TEST_URL, mockSpotifyAuth).catch(
        err => {
          expect(err.status).toEqual(500);
          expect(axios.get).toHaveBeenCalledWith(MOCK_URL_FULL, mockHeaders);
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
      // @ts-ignore
      axios.get.mockResolvedValueOnce({ data: SpotifySearchResult });
      // @ts-ignore
      axios.post.mockResolvedValueOnce({
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
      // @ts-ignore
      axios.get.mockResolvedValueOnce({ data: SpotifySearchResult });
      // @ts-ignore
      axios.post.mockRejectedValueOnce({
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
      expect(axios.get).toHaveBeenCalledWith(expectedSearchURL, mockHeaders);
      expect(axios.post).toHaveBeenCalledWith(expectedPOSTURL, {}, mockHeaders);
    });

    it('does not find track and returns early', async () => {
      const selectedTrackNotFound: WhoSampledData = {
        track_name: 'Haunted Mansion Man Duder',
        artist: 'Haunted',
        year: 0,
        images: [],
      };
      const expectedURL =
        'https://api.spotify.com/v1/search?q=%2620track%3AHaunted%2BMansion+Man+Duder%2520artist%3AHaunted&type=track&limit=50';

      // @ts-ignore
      axios.get.mockResolvedValueOnce({ data: SpotifySearchResult });

      const result = await SpotifyServiceModule.findAndQueueTrack(
        selectedTrackNotFound,
        mockSpotifyAuth,
      );
      expect(result).toEqual(
        'Unable to find Haunted Mansion Man Duder in search results',
      );
      expect(axios.get).toHaveBeenCalledWith(expectedURL, mockHeaders);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });
});
