import axios from 'axios';
import { SpotifyAuthentication } from '../../context/SpotifyAuthContext';

export const BASE_URL = 'https://api.spotify.com/';

export const buildSpotifyHeaders = (
  spotifyAuth: SpotifyAuthentication,
): Object => ({
  headers: {
    Authorization: `Bearer ${spotifyAuth.accessToken}`,
    'Content-Type': 'application/json',
  },
});

export const spotifyGETData = async (
  url: string,
  spotifyAuth: SpotifyAuthentication,
) => {
  return axios.get(`${BASE_URL}${url}`, buildSpotifyHeaders(spotifyAuth));
};

export const spotifyPOSTData = async (
  url: string,
  spotifyAuth: SpotifyAuthentication,
  body: object = {},
) => {
  return axios.post(
    `${BASE_URL}${url}`,
    body,
    buildSpotifyHeaders(spotifyAuth),
  );
};
