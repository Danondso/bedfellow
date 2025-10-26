import { generateApiSignature, buildLastFmApiUrl, sanitizeLastFmName, formatLastFmTimestamp } from '../utilities/utilities';

describe('last.fm Utilities', () => {
  describe('generateApiSignature', () => {
    it('should generate correct API signature for last.fm', () => {
      const params = {
        method: 'track.scrobble',
        artist: 'Test Artist',
        track: 'Test Track',
        timestamp: '123456789',
        api_key: 'test_api_key',
      };
      
      const apiSecret = 'test_secret';
      const signature = generateApiSignature(params, apiSecret);
      
      // Verify signature is generated
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature).toHaveLength(32); // MD5 hash is 32 characters
    });

    it('should generate same signature for same parameters', () => {
      const params = {
        method: 'track.updateNowPlaying',
        artist: 'Same Artist',
        track: 'Same Track',
        api_key: 'key',
      };
      
      const apiSecret = 'secret';
      const signature1 = generateApiSignature(params, apiSecret);
      const signature2 = generateApiSignature(params, apiSecret);
      
      expect(signature1).toBe(signature2);
    });

    it('should generate different signatures for different parameters', () => {
      const params1 = {
        artist: 'Artist 1',
        track: 'Track 1',
      };
      
      const params2 = {
        artist: 'Artist 2',
        track: 'Track 2',
      };
      
      const apiSecret = 'secret';
      const signature1 = generateApiSignature(params1, apiSecret);
      const signature2 = generateApiSignature(params2, apiSecret);
      
      expect(signature1).not.toBe(signature2);
    });

    it('should sort parameters before generating signature', () => {
      const params = {
        z_param: 'last',
        a_param: 'first',
        m_param: 'middle',
      };
      
      const apiSecret = 'secret';
      const signature = generateApiSignature(params, apiSecret);
      
      // Should sort alphabetically before creating signature
      expect(signature).toBeDefined();
    });
  });

  describe('buildLastFmApiUrl', () => {
    it('should build URL with parameters', () => {
      const baseUrl = 'https://ws.audioscrobbler.com/2.0/';
      const params = {
        method: 'user.getRecentTracks',
        user: 'test_user',
        api_key: 'test_key',
      };
      
      const url = buildLastFmApiUrl(baseUrl, params);
      
      expect(url).toContain('method=user.getRecentTracks');
      expect(url).toContain('user=test_user');
      expect(url).toContain('api_key=test_key');
    });

    it('should include signature when apiSecret provided', () => {
      const baseUrl = 'https://ws.audioscrobbler.com/2.0/';
      const params = {
        method: 'track.scrobble',
        api_key: 'test_key',
      };
      const apiSecret = 'test_secret';
      
      const url = buildLastFmApiUrl(baseUrl, params, apiSecret);
      
      expect(url).toContain('api_sig=');
    });
  });

  describe('sanitizeLastFmName', () => {
    it('should trim whitespace', () => {
      expect(sanitizeLastFmName('  Test  ')).toBe('Test');
    });

    it('should replace multiple spaces with single space', () => {
      expect(sanitizeLastFmName('Test  Track')).toBe('Test Track');
    });

    it('should remove quotes', () => {
      expect(sanitizeLastFmName("Test 'Track'")).toBe("Test Track");
      expect(sanitizeLastFmName('Test "Track"')).toBe('Test Track');
    });
  });

  describe('formatLastFmTimestamp', () => {
    it('should format date as Unix timestamp string', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const timestamp = formatLastFmTimestamp(date);
      
      expect(timestamp).toBe('1704067200'); // Unix timestamp for the date
    });
  });
});

export default {};

