import axios from 'axios';
import * as BedfellowDBAPIService from '../../../src/services/bedfellow-db-api/BedfellowDBAPI.service';
import sampleInfo0 from '../../fixtures/api/bedfellow-db-api/sample-info.0';
import parseResult0 from '../../fixtures/api/whosampled/parseResults/parse-result.0';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BedfellowDBAPI.service.test.ts', () => {
  const artist: string = 'Kanye West';
  const track: string = 'Bound 2';
  const expectedURL: string = 'http://localhost:8000/api/samples?artist_name=Kanye West&track_name=Bound 2';
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('postToBedfellowDB', () => {
    it('posts samples', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: null,
        status: 204,
      });
      const result = await BedfellowDBAPIService.postToBedfellowDB(parseResult0);
      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/api/samples', parseResult0);
    });

    it('posts samples and throws error because samples exist', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 409,
        },
      });
      try {
        await BedfellowDBAPIService.postToBedfellowDB(parseResult0);
      } catch (error) {
        expect(error.message).toEqual('Sample already exists!');
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/api/samples', parseResult0);
      }
    });

    it('posts samples and fails due to unknown error and returns false', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        error: 'I am not what you expect!',
      });

      const result = await BedfellowDBAPIService.postToBedfellowDB(parseResult0);
      expect(result).toBe(false);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/api/samples', parseResult0);
    });
  });

  describe('getBedfellowDBData', () => {
    it('returns samples', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: sampleInfo0,
      });
      const result = await BedfellowDBAPIService.getBedfellowDBData(artist, track);
      expect(result).toEqual(sampleInfo0);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL);
    });

    it('returns null when response is 404', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          message: 'Not found',
        },
      });
      const result = await BedfellowDBAPIService.getBedfellowDBData('Kanye West', 'Bound 2');
      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL);
    });

    it('returns null when inputs are falsy', async () => {
      const result = await BedfellowDBAPIService.getBedfellowDBData('', '');
      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(0);
    });
  });
});
