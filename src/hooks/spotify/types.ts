import { AxiosError } from 'axios';

// Generic API error type
export type ApiError = {
  message: string;
  status: number;
};

// useSpotifyAPI hook types
export type SpotifyAPIHookResponse = {
  loadData: () => void;
  loading: boolean;
  error: ApiError | null;
  response?: unknown;
};

// useGetCurrentTrack hook types
export type UseGetCurrentTrackHookResponse = {
  getData: () => Promise<SpotifyApi.CurrentPlaybackResponse>;
  currentTrack: SpotifyApi.CurrentPlaybackResponse | null;
  error: string | null;
  loading: boolean;
};

// useGetSearch hook types
export type UseGetSearchHookResponse = {
  getData: (query: string) => Promise<SpotifyApi.SearchResponse>;
  searchResults: SpotifyApi.SearchResponse | null;
  error: string | null;
  loading: boolean;
};

// usePlayback hook types
export type UsePlaybackHookResponse = {
  forward: () => Promise<void>;
  pause: () => void;
  backward: () => Promise<void>;
  play: () => void;
  isPaused: boolean;
};

// useSpotify aggregate hook types
export type UseSpotifyHookResponse = {
  currentTrack: UseGetCurrentTrackHookResponse;
  search: UseGetSearchHookResponse;
  playback: UsePlaybackHookResponse;
};
