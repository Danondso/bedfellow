import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export type SpotifyAuthentication = {
  accessToken: string;
  expirationDate: string;
  expired: boolean;
  refreshToken: string;
  scope: string;
};

export const initialState: SpotifyAuthentication = {
  accessToken: '',
  expirationDate: '',
  expired: true,
  refreshToken: '',
  scope: '',
};

export type SpotifyAuthContextData = {
  spotifyAuth: SpotifyAuthentication;
  setSpotifyAuth: Dispatch<SetStateAction<SpotifyAuthentication>>;
  resetToken: (authData: SpotifyAuthentication) => void;
};

export const SpotifyAuthContext = createContext<
  SpotifyAuthContextData | undefined
>(undefined);

function resetToken(
  authData: SpotifyAuthentication,
  setSpotifyAuth: Dispatch<SetStateAction<SpotifyAuthentication>>,
) {
  const tokenUrl = process.env.SPOTIFY_TOKEN_REFRESH_URL || '';
  axios
    .post(tokenUrl, {
      refresh_token: authData.refreshToken,
    })
    .then(result => {
      const refreshedAuthData: SpotifyAuthentication = {
        ...authData,
        accessToken: result.data.access_token,
        expired: false,
      };
      setSpotifyAuth(refreshedAuthData);
    });
}

function SpotifyAuthContextProvider({ children }: { children: ReactNode }) {
  const [spotifyAuth, setSpotifyAuth] =
    useState<SpotifyAuthentication>(initialState);

  const auth = useMemo<SpotifyAuthContextData>(
    () => ({
      spotifyAuth,
      setSpotifyAuth,
      resetToken,
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
