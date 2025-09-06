import { BedfellowSample } from '../../types/bedfellow-api';

// useGetSearch hook types
export type UseGetSearchHookResponse = {
  search: (query: string) => Promise<SpotifyApi.SearchResponse>;
  searchResults: SpotifyApi.SearchResponse | null;
  error: string | null;
  loading: boolean;
};

// usePlayback hook types
export type UsePlayerHookResponse = {
  actions: {
    forward: () => Promise<void>;
    pause: () => void;
    backward: () => Promise<void>;
    play: () => void;
    isPaused: boolean;
  };
  playing: {
    refresh: () => Promise<void>;
    track: SpotifyApi.CurrentPlaybackResponse | null;
    error: SpotifyApi.ErrorObject | null;
    loading: boolean;
  };
};

// useProfile hook types
export type UseProfileHookResponse = {
  loading: boolean;
  error: SpotifyApi.ErrorObject | null;
  profile: SpotifyApi.CurrentUsersProfileResponse | null;
  isPremium: boolean;
};

// useQueue hook types
export type UseQueueHookResponse = {
  addToQueue: (item: BedfellowSample) => Promise<string>;
};

// useSpotify aggregate hook types
export type UseSpotifyHookResponse = {
  search: UseGetSearchHookResponse;
  playback: UsePlayerHookResponse;
  profile: UseProfileHookResponse;
  queue: UseQueueHookResponse;
};
