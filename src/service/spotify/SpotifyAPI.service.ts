/* eslint-disable import/no-extraneous-dependencies */
import axios, { AxiosResponse } from 'axios';
import { fuzzy } from 'fast-fuzzy';
import { SpotifyAuthentication } from '../../context/SpotifyAuthContext';
import { WhoSampledData } from '../../types';
import { TrackObjectFull } from '../../types/spotify-api';

export const BASE_URL = 'https://api.spotify.com/';
const COMPARISON_THRESHOLD = 1.5;
const EXACT_MATCH = 2;

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

const findMatchingTrack = (
  items: TrackObjectFull[],
  selectedTrack: WhoSampledData,
): TrackObjectFull | undefined => {
  let index = -1;
  let compositeScore = -1;

  for (let i = 0; i < items.length; i++) {
    const { name, artists } = items[i];
    // fuzzy does a 0-1 score
    const trackMatch = fuzzy(name, selectedTrack.track_name);
    const artistMatch = fuzzy(artists[0].name, selectedTrack.artist);
    const tempCompositeScore = trackMatch + artistMatch;
    if (tempCompositeScore > compositeScore) {
      index = i;
      compositeScore = tempCompositeScore;
    }

    // if we get a 2 then it's a direct match so break;
    if (compositeScore === EXACT_MATCH) break;
  }
  console.log('SCORE:', compositeScore);
  return compositeScore >= COMPARISON_THRESHOLD ? items[index] : undefined;
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
