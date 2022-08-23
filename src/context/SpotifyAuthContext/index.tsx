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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resetToken(authData: SpotifyAuthentication) {
  // TODO filling this out later see issue #9
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
