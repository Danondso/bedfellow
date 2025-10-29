import {
  MusicProviderId,
  MUSIC_PROVIDER_DESCRIPTORS,
  MUSIC_PROVIDER_IDS,
  MUSIC_PROVIDER_CAPABILITY_KEYS,
  createNotImplementedAdapter,
} from '@services/music-providers/registry';
import type { MusicProviderDescriptor } from '@services/music-providers/types';

describe('music provider registry', () => {
  const findDescriptor = (id: MusicProviderId) => MUSIC_PROVIDER_DESCRIPTORS.find((descriptor) => descriptor.id === id);

  it('includes a Spotify descriptor with full capability support', () => {
    const spotify = findDescriptor(MusicProviderId.Spotify);
    expect(spotify).toBeDefined();
    expect(spotify?.displayName).toBe('Spotify');
    expect(spotify?.capabilities).toEqual({
      playback: true,
      queue: true,
      search: true,
      profile: true,
    });
  });

  it('lists YouTube Music for future integration', () => {
    expect(MUSIC_PROVIDER_IDS).toEqual(expect.arrayContaining([MusicProviderId.Spotify, MusicProviderId.YouTubeMusic]));
  });

  it('enforces capability keys consistency for each descriptor', () => {
    const expectedKeys = [...MUSIC_PROVIDER_CAPABILITY_KEYS].sort();
    MUSIC_PROVIDER_DESCRIPTORS.forEach((descriptor) => {
      const capabilityKeys = Object.keys(descriptor.capabilities).sort();
      expect(capabilityKeys).toEqual(expectedKeys);
    });
  });

  it('creates not-implemented adapters that reject operations with clear messaging', async () => {
    const descriptor = findDescriptor(MusicProviderId.YouTubeMusic) as MusicProviderDescriptor;
    const adapter = createNotImplementedAdapter(descriptor);

    await expect(adapter.auth.authorize()).rejects.toThrow(/YouTube Music is not available yet/);
    await expect(adapter.auth.refresh({ accessToken: 'token' })).rejects.toThrow(/YouTube Music is not available yet/);
    await expect(adapter.playback.pause()).rejects.toThrow(/youtube-music/);
    await expect(adapter.queue.addToQueue('song-id')).rejects.toThrow(/youtube-music/);
    await expect(adapter.search.searchTracks('query')).rejects.toThrow(/youtube-music/);
    await expect(adapter.profile.getProfile()).rejects.toThrow(/youtube-music/);
  });
});
