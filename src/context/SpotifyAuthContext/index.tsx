import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  ReactNode,
  useEffect,
  Context,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthorizeResult } from 'react-native-app-auth';
import Config from 'react-native-config';

export type AuthResult = AuthorizeResult & { expired: boolean };

export const initialState: AuthResult = {
  accessToken: '',
  accessTokenExpirationDate: '',
  expired: true,
  idToken: '',
  refreshToken: '',
  tokenType: '',
  scopes: [],
  authorizationCode: '',
};

export type SpotifyAuthContextData = {
  spotifyAuth: AuthResult;
  setSpotifyAuth: Dispatch<SetStateAction<AuthResult>>;
  resetToken: (authData: AuthorizeResult) => void;
};

export const SpotifyAuthContext: Context<SpotifyAuthContextData> = createContext<SpotifyAuthContextData>({
  spotifyAuth: initialState,
  setSpotifyAuth: () => {},
  resetToken: () => {},
});

async function resetToken(authData: AuthResult): Promise<AuthResult> {
  const tokenUrl = `${Config.BEDFELLOW_API_BASE_URL}/refresh`;
  const refreshData = await axios.post(tokenUrl, {
    refresh_token: authData.refreshToken,
  });
  return {
    ...authData,
    accessToken: refreshData.data.access_token,
    expired: false,
  };
}

function SpotifyAuthContextProvider({ children }: { children: ReactNode }) {
  const [spotifyAuth, setSpotifyAuth] = useState<AuthResult>(initialState);

  const auth = useMemo<SpotifyAuthContextData>(
    () => ({
      spotifyAuth,
      setSpotifyAuth,
      resetToken: () =>
        resetToken(spotifyAuth)
          .then((result) => setSpotifyAuth(result))
          .catch(() => setSpotifyAuth(initialState)),
    }),
    [spotifyAuth, setSpotifyAuth]
  );

  useEffect(() => {
    if (spotifyAuth?.accessToken !== '') {
      AsyncStorage.setItem('SPOTIFY_AUTH_DATA', JSON.stringify(spotifyAuth));
    }
  }, [spotifyAuth]);

  useEffect(() => {
    AsyncStorage.getItem('SPOTIFY_AUTH_DATA')
      .then((spotifyAuthData: string | null | undefined) => {
        if (spotifyAuthData) {
          setSpotifyAuth(JSON.parse(spotifyAuthData));
        }
      })
      .catch((error) => {
        // Error occurred: Failed to load Spotify auth data from storage
        console.error('Failed to load Spotify auth data:', error);
      });
  }, []);

  return <SpotifyAuthContext.Provider value={auth}>{children}</SpotifyAuthContext.Provider>;
}

export default SpotifyAuthContextProvider;
