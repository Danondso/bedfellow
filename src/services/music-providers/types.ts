export enum MusicProviderId {
  Spotify = 'spotify',
  YouTubeMusic = 'youtube-music',
}

export const MUSIC_PROVIDER_CAPABILITY_KEYS = ['playback', 'queue', 'search', 'profile'] as const;

export type MusicProviderCapabilityKey = (typeof MUSIC_PROVIDER_CAPABILITY_KEYS)[number];

export type MusicProviderCapabilities = Record<MusicProviderCapabilityKey, boolean>;

export interface ProviderAuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  tokenType?: string;
  scopes?: string[];
  raw?: unknown;
}

export interface ProviderAuthorizeOptions {
  /**
   * Optional redirect URL override for providers that support deep link callbacks.
   */
  redirectUrl?: string;
  /**
   * Providers may need additional extra params (e.g. PKCE).
   */
  extraParams?: Record<string, string>;
}

export interface ProviderAuthAdapter {
  authorize(options?: ProviderAuthorizeOptions): Promise<ProviderAuthSession>;
  refresh(session: ProviderAuthSession): Promise<ProviderAuthSession>;
  revoke?(session: ProviderAuthSession): Promise<void>;
}

export interface ProviderPlaybackAdapter {
  play(): Promise<void>;
  pause(): Promise<void>;
  skipNext(): Promise<void>;
  skipPrevious(): Promise<void>;
  /**
   * Providers should resolve with their native playback state to enable UI updates.
   */
  refreshState(): Promise<unknown>;
}

export interface ProviderQueueAdapter {
  addToQueue(providerTrackId: string): Promise<void>;
}

export interface ProviderSearchAdapter {
  searchTracks(query: string): Promise<unknown>;
}

export interface ProviderProfileAdapter {
  getProfile(): Promise<unknown>;
}

export interface MusicProviderDescriptor {
  id: MusicProviderId;
  displayName: string;
  shortName: string;
  capabilities: MusicProviderCapabilities;
}

export interface MusicProviderAdapter {
  id: MusicProviderId;
  displayName: string;
  capabilities: MusicProviderCapabilities;
  auth: ProviderAuthAdapter;
  playback: ProviderPlaybackAdapter;
  queue: ProviderQueueAdapter;
  search: ProviderSearchAdapter;
  profile: ProviderProfileAdapter;
}
