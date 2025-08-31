import { AuthorizeResult } from 'react-native-app-auth';

export type SpotifyAuthToken = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO string for serialization
  tokenType: string;
  scopes: string[];
};

export type SpotifyAuthState = {
  token: SpotifyAuthToken | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
};

export type SpotifyAuthContextData = {
  authState: SpotifyAuthState;
  setAuthToken: (authResult: AuthorizeResult) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  logout: () => Promise<void>;
  isTokenExpiring: () => boolean;
  isAuthenticated: boolean;
  clearError: () => void;
};
