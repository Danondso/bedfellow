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

// useSpotify aggregate hook types
export type UseSpotifyHookResponse = {
  search: UseGetSearchHookResponse;
  playback: UsePlayerHookResponse;
};
