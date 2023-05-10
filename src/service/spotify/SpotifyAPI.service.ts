import axios, { AxiosResponse } from 'axios';
import { SpotifyAuthentication } from '../../context/SpotifyAuthContext';
import { WhoSampledData } from '../../types';
import findMatchingTrack from './utilities/utilities';

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
): Promise<AxiosResponse<any, any>> => {
  return axios.get(`${BASE_URL}${url}`, buildSpotifyHeaders(spotifyAuth));
};

export const spotifyPOSTData = async (
  url: string,
  spotifyAuth: SpotifyAuthentication,
  body: object = {},
): Promise<AxiosResponse<any, any>> => {
  return axios.post(
    `${BASE_URL}${url}`,
    body,
    buildSpotifyHeaders(spotifyAuth),
  );
};

export const findAndQueueTrack = async (
  selectedTrack: WhoSampledData,
  spotifyAuth: SpotifyAuthentication,
): Promise<string> => {
  const { track_name, artist } = selectedTrack;
  const url = generateSpotifyTrackAndArtistQueryURL(track_name, artist);
  try {
    const { data } = await spotifyGETData(url, spotifyAuth);
    const { items } = data.tracks;
    const matchingTrack = findMatchingTrack(items, selectedTrack);
    if (!matchingTrack) {
      return `Unable to find ${track_name} in search results`;
    }

    await spotifyPOSTData(
      `v1/me/player/queue?uri=${matchingTrack.uri}`,
      spotifyAuth,
    );

    const { name, artists } = matchingTrack;
    const allArtists = artists
      .map(matchingTrackArtist => matchingTrackArtist.name)
      .join(',');

    return `Queued ${name} by ${allArtists}`;
  } catch (err: any) {
    const { error } = err;
    return `Unable to queue track, status: ${error.status}, message: ${error.message}`;
  }
};

const generateSpotifyTrackAndArtistQueryURL = (
  trackName: string,
  artist: string,
): string => {
  const data: Record<string, string> = {
    q: `&20track:${trackName.replace(' ', '+')}%20artist:${artist.replace(
      ' ',
      '+',
    )}`,
    type: 'track',
    limit: '50', // makes TS happy when passing to URLSearchParams
  };
  return `v1/search?${new URLSearchParams(data)}`;
};
