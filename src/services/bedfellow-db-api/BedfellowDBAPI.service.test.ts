import axios from 'axios';
import { postToBedfellowDB, getBedfellowDBData, searchSamples } from './BedfellowDBAPI.service';
import { SearchQueryParams } from '../../types/bedfellow-api';

jest.mock('axios');
jest.mock('react-native-config', () => ({
  BEDFELLOW_DB_API_BASE_URL: 'http://test-api.com',
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BedfellowDBAPI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('postToBedfellowDB', () => {
    it('should return true when post is successful', async () => {
      mockedAxios.post.mockResolvedValueOnce({ status: 204 });

      const result = await postToBedfellowDB({
        artist: 'Test Artist',
        track: 'Test Track',
        samples: [],
      });

      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('http://test-api.com/samples', {
        artist: 'Test Artist',
        track: 'Test Track',
        samples: [],
      });
    });

    it('should throw error when sample already exists', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 409 },
      });

      await expect(
        postToBedfellowDB({
          artist: 'Test Artist',
          track: 'Test Track',
          samples: [],
        })
      ).rejects.toThrow('Sample already exists!');
    });

    it('should return false for other errors', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 500 },
      });

      const result = await postToBedfellowDB({
        artist: 'Test Artist',
        track: 'Test Track',
        samples: [],
      });

      expect(result).toBe(false);
    });
  });

  describe('getBedfellowDBData', () => {
    it('should return data when successful', async () => {
      const mockData = {
        artist_name: 'Test Artist',
        track_name: 'Test Track',
        samples: [],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getBedfellowDBData('Test Artist', 'Test Track');

      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://test-api.com/samples?artist_name=Test Artist&track_name=Test Track'
      );
    });

    it('should return null when artist is missing', async () => {
      const result = await getBedfellowDBData('', 'Test Track');
      expect(result).toBeNull();
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should return null when track is missing', async () => {
      const result = await getBedfellowDBData('Test Artist', '');
      expect(result).toBeNull();
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should return null on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await getBedfellowDBData('Test Artist', 'Test Track');

      expect(result).toBeNull();
    });
  });

  describe('searchSamples', () => {
    const mockResponse = {
      samples: [
        {
          id: 1,
          artist_name: 'Artist 1',
          track_name: 'Track 1',
          year: 2020,
        },
      ],
      pagination: {
        cursor: 'eyJpZCI6MSwidmFsdWUiOiJBcnRpc3QgMSJ9',
        limit: 20,
        has_more: true,
      },
    };

    it('should search with query parameter', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const params: SearchQueryParams = { q: 'test search' };
      const result = await searchSamples(params);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://test-api.com/samples/search?q=test+search');
    });

    it('should include cursor parameter when provided', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const params: SearchQueryParams = {
        q: 'test',
        cursor: 'eyJpZCI6MSwidmFsdWUiOiJBcnRpc3QgMSJ9',
      };
      const result = await searchSamples(params);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://test-api.com/samples/search?q=test&cursor=eyJpZCI6MSwidmFsdWUiOiJBcnRpc3QgMSJ9'
      );
    });

    it('should include all optional parameters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const params: SearchQueryParams = {
        q: 'test',
        cursor: 'abc123',
        limit: 10,
        sort: 'year',
        order: 'desc',
      };
      const result = await searchSamples(params);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://test-api.com/samples/search?q=test&cursor=abc123&limit=10&sort=year&order=desc'
      );
    });

    it('should handle empty query parameters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const params: SearchQueryParams = {};
      const result = await searchSamples(params);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://test-api.com/samples/search');
    });

    it('should throw error on network failure', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        message: 'Network error',
      });

      const params: SearchQueryParams = { q: 'test' };

      await expect(searchSamples(params)).rejects.toThrow('Failed to search samples');
    });

    it('should log error message before throwing', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockedAxios.get.mockRejectedValueOnce({
        message: 'Connection timeout',
      });

      const params: SearchQueryParams = { q: 'test' };

      try {
        await searchSamples(params);
      } catch {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith('Search samples error:', 'Connection timeout');
      consoleSpy.mockRestore();
    });
  });
});
