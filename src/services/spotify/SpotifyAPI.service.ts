import axios, { AxiosResponse } from 'axios';
import { AuthResult } from '../../context/SpotifyAuthContext';
import findMatchingTrack from './utilities/utilities';
import { BedfellowSample } from '../../types/bedfellow-api';

export const BASE_URL = 'https://api.spotify.com/';

export const buildSpotifyHeaders = (spotifyAuth: AuthResult): Object => ({
  headers: {
    Authorization: `Bearer ${spotifyAuth.accessToken}`,
    'Content-Type': 'application/json',
  },
});

export const spotifyGETData = async (url: string, spotifyAuth: AuthResult): Promise<AxiosResponse<any, any>> => {
  return axios.get(`${BASE_URL}${url}`, buildSpotifyHeaders(spotifyAuth));
};

export const spotifyPOSTData = async (
  url: string,
  spotifyAuth: AuthResult,
  body: object = {}
): Promise<AxiosResponse<any, any>> => {
  return axios.post(`${BASE_URL}${url}`, body, buildSpotifyHeaders(spotifyAuth));
};

export const findAndQueueTrack = async (trackToQueue: BedfellowSample, spotifyAuth: AuthResult): Promise<string> => {
  const { track, artist } = trackToQueue;
  if (artist.length >= 7 && artist.slice(-7) === '(movie)') {
    return 'Cannot queue movie';
  } else if (artist.length >= 9 && artist.slice(-9).trim() === '(TV show)') {
    return 'Cannot queue tv show';
  }

  const url = generateSpotifyTrackAndArtistQueryURL(track, artist);
  try {
    const { data } = await spotifyGETData(url, spotifyAuth);
    const { items } = data.tracks;
    const matchingTrack = findMatchingTrack(items, trackToQueue);
    if (!matchingTrack) {
      return `Unable to find ${track} in search results`;
    }

    await spotifyPOSTData(`v1/me/player/queue?uri=${matchingTrack.uri}`, spotifyAuth);

    const { name, artists } = matchingTrack;
    const allArtists = artists.map((matchingTrackArtist) => matchingTrackArtist.name).join(',');

    return `Queued ${name} by ${allArtists}`;
  } catch (err: any) {
    const { error } = err;
    return `Unable to queue track, status: ${error.status}, message: ${error.message}`;
  }
};

const generateSpotifyTrackAndArtistQueryURL = (trackName: string, artist: string): string => {
  const data: Record<string, string> = {
    q: `&20track:${trackName.replace(' ', '+')}%20artist:${artist.replace(' ', '+')}`,
    type: 'track',
    limit: '50', // makes TS happy when passing to URLSearchParams
  };
  return `v1/search?${new URLSearchParams(data)}`;
};
