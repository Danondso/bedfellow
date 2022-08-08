import { createContext, Dispatch, SetStateAction } from 'react';

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

export type SpotifyAuthContext = [
  SpotifyAuthentication,
  Dispatch<SetStateAction<SpotifyAuthentication>>,
];

export const SpotifyAuthContext = createContext<SpotifyAuthContext | undefined>(
  undefined,
);
