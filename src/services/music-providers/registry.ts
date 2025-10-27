import {
  MusicProviderId,
  MUSIC_PROVIDER_CAPABILITY_KEYS,
  type MusicProviderCapabilities,
  type MusicProviderDescriptor,
  type MusicProviderAdapter,
} from './types';

const createCapabilities = (overrides: Partial<MusicProviderCapabilities>): MusicProviderCapabilities => ({
  playback: false,
  queue: false,
  search: false,
  profile: false,
  ...overrides,
});

export const MUSIC_PROVIDER_DESCRIPTORS: MusicProviderDescriptor[] = [
  {
    id: MusicProviderId.Spotify,
    displayName: 'Spotify',
    shortName: 'Spotify',
    capabilities: createCapabilities({
      playback: true,
      queue: true,
      search: true,
      profile: true,
    }),
  },
  {
    id: MusicProviderId.YouTubeMusic,
    displayName: 'YouTube Music',
    shortName: 'YouTube Music',
    capabilities: createCapabilities({}),
  },
];

export const MUSIC_PROVIDER_IDS = MUSIC_PROVIDER_DESCRIPTORS.map((descriptor) => descriptor.id);

const rejectWith = <T>(error: Error): Promise<T> => Promise.reject(error);

const buildFeatureError = (descriptor: MusicProviderDescriptor, feature: string) =>
  new Error(`The ${feature} feature is not yet available for ${descriptor.id}`);

export const createNotImplementedAdapter = (descriptor: MusicProviderDescriptor): MusicProviderAdapter => {
  const unavailableError = new Error(`${descriptor.displayName} is not available yet`);

  return {
    id: descriptor.id,
    displayName: descriptor.displayName,
    capabilities: descriptor.capabilities,
    auth: {
      authorize: () => rejectWith(unavailableError),
      refresh: () => rejectWith(unavailableError),
      revoke: () => rejectWith(buildFeatureError(descriptor, 'auth revoke')),
    },
    playback: {
      play: () => rejectWith(buildFeatureError(descriptor, 'playback')),
      pause: () => rejectWith(buildFeatureError(descriptor, 'playback')),
      skipNext: () => rejectWith(buildFeatureError(descriptor, 'playback')),
      skipPrevious: () => rejectWith(buildFeatureError(descriptor, 'playback')),
      refreshState: () => rejectWith(buildFeatureError(descriptor, 'playback')),
    },
    queue: {
      addToQueue: () => rejectWith(buildFeatureError(descriptor, 'queue')),
    },
    search: {
      searchTracks: () => rejectWith(buildFeatureError(descriptor, 'search')),
    },
    profile: {
      getProfile: () => rejectWith(buildFeatureError(descriptor, 'profile')),
    },
  };
};

export const getProviderDescriptor = (id: MusicProviderId): MusicProviderDescriptor | undefined =>
  MUSIC_PROVIDER_DESCRIPTORS.find((descriptor) => descriptor.id === id);

export { MusicProviderId, MUSIC_PROVIDER_CAPABILITY_KEYS } from './types';
