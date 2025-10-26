export type LastFmAuthToken = {
  sessionKey: string;
  username: string;
  apiKey: string;
};

export type LastFmAuthState = {
  token: LastFmAuthToken | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
};

export type LastFmAuthContextData = {
  authState: LastFmAuthState;
  setAuthToken: (sessionKey: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
};

export type LastFmAuthResult = {
  sessionKey: string;
  username: string;
};

