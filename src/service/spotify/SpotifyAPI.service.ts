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

export const generateSpotifyTrackAndArtistQueryURL = (
  trackName: string,
  artist: string,
) => {
  const data: Record<string, string> = {
    q: `&20track:${trackName.replace(' ', '+')}%20artist:${artist.replace(
      ' ',
      '+',
    )}`,
    type: 'track',
    limit: '50', // makes TS happy when passing to URLSearchParams
  };
  // we trim the last character off because it's a forward slash which the spotify API doesn't like
  return new URL(`v1/search?${new URLSearchParams(data)}`).href.slice(0, -1);
};
