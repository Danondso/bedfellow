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

export const initialState: AuthorizeResult = {
  accessToken: '',
  accessTokenExpirationDate: '',
  // @ts-ignore
  expired: true,
  refreshToken: '',
  scope: '',
};

export type SpotifyAuthContextData = {
  spotifyAuth: AuthorizeResult;
  setSpotifyAuth: Dispatch<SetStateAction<AuthorizeResult>>;
  resetToken: (authData: AuthorizeResult) => void;
};

export const SpotifyAuthContext: Context<SpotifyAuthContextData> =
  createContext<SpotifyAuthContextData>({
    spotifyAuth: initialState,
    setSpotifyAuth: () => {},
    resetToken: () => {},
  });

async function resetToken(authData: AuthorizeResult): Promise<AuthorizeResult> {
  const tokenUrl = process.env.SPOTIFY_TOKEN_REFRESH_URL || '';
  const refreshData = await axios.post(tokenUrl, {
    refresh_token: authData.refreshToken,
  });
  return {
    ...authData,
    accessToken: refreshData.data.access_token,
    // @ts-ignore
    expired: false,
  };
}

function SpotifyAuthContextProvider({ children }: { children: ReactNode }) {
  const [spotifyAuth, setSpotifyAuth] = useState<AuthorizeResult>(initialState);

  const auth = useMemo<SpotifyAuthContextData>(
    () => ({
      spotifyAuth,
      setSpotifyAuth,
      resetToken: () =>
        resetToken(spotifyAuth)
          .then(result => setSpotifyAuth(result))
          .catch(() => setSpotifyAuth(initialState)),
    }),
    [spotifyAuth, setSpotifyAuth],
  );

  useEffect(() => {
    if (spotifyAuth.accessToken !== '') {
      AsyncStorage.setItem('SPOTIFY_AUTH_DATA', JSON.stringify(spotifyAuth));
    }
  }, [spotifyAuth]);

  useEffect(() => {
    AsyncStorage.getItem('SPOTIFY_AUTH_DATA')
      .then((spotifyAuthData: string | null) => {
        if (spotifyAuthData) {
          setSpotifyAuth(JSON.parse(spotifyAuthData));
        }
      })
      .catch(error =>
        console.log('Failed to pull data from AsyncStorage', error),
      );
  }, []);

  return (
    <SpotifyAuthContext.Provider value={auth}>
      {children}
    </SpotifyAuthContext.Provider>
  );
}

export default SpotifyAuthContextProvider;
