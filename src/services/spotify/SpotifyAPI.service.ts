import axios, { AxiosResponse } from 'axios';
// Types from @types/spotify-api are available globally via SpotifyApi namespace
import { SpotifyAuthToken } from '../../context/SpotifyAuthContext';
import findMatchingTrack from './utilities/utilities';
import { BedfellowSample } from '../../types/bedfellow-api';

export const BASE_URL = 'https://api.spotify.com/';
const PLAYER_URL_FRAGMENT = 'v1/me/player';

export const buildSpotifyHeaders = (token: SpotifyAuthToken): Object => ({
  headers: {
    Authorization: `Bearer ${token.accessToken}`,
    'Content-Type': 'application/json',
  },
});

export const spotifyGETData = async (url: string, token: SpotifyAuthToken | null): Promise<AxiosResponse<any, any>> => {
  if (!token) throw new Error('No authentication token available');
  return axios.get(`${BASE_URL}${url}`, buildSpotifyHeaders(token));
};

export const spotifyPOSTData = async (
  url: string,
  token: SpotifyAuthToken | null,
  body: object = {}
): Promise<AxiosResponse<any, any>> => {
  if (!token) throw new Error('No authentication token available');
  return axios.post(`${BASE_URL}${url}`, body, buildSpotifyHeaders(token));
};

export const spotifyPUTData = async (
  url: string,
  token: SpotifyAuthToken | null,
  body: object = {}
): Promise<AxiosResponse<any, any>> => {
  if (!token) throw new Error('No authentication token available');
  return axios.put(`${BASE_URL}${url}`, body, buildSpotifyHeaders(token));
};

export const findAndQueueTrack = async (
  trackToQueue: BedfellowSample,
  token: SpotifyAuthToken | null
): Promise<string> => {
  const { track, artist } = trackToQueue;
  if (artist.length >= 7 && artist.slice(-7) === '(movie)') {
    return 'Cannot queue movie';
  } else if (artist.length >= 9 && artist.slice(-9).trim() === '(TV show)') {
    return 'Cannot queue tv show';
  }

  const url = generateSpotifyTrackAndArtistQueryURL(track, artist);
  try {
    const { data } = await spotifyGETData(url, token);
    const { items } = data.tracks;
    const matchingTrack = findMatchingTrack(items, trackToQueue);
    if (!matchingTrack) {
      throw new Error(`Unable to find matching track for ${track}`);
    }

    await spotifyPOSTData(`v1/me/player/queue?uri=${matchingTrack.uri}`, token);

    const { name, artists } = matchingTrack;
    const allArtists = artists.map((matchingTrackArtist) => matchingTrackArtist.name).join(',');

    return `Queued ${name} by ${allArtists}`;
  } catch (error: any) {
    if (error.response) {
      return `Unable to queue track, status: ${error.response.status}, message: ${error.response.statusText}`;
    }
    return `Unable to queue track:: ${error}`;
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

const getSpotifyDevices = async (token: SpotifyAuthToken | null): Promise<string | null> => {
  try {
    const deviceResponse: AxiosResponse<SpotifyApi.UserDevicesResponse> = await spotifyGETData(
      `${PLAYER_URL_FRAGMENT}/devices`,
      token
    );
    const { id } = deviceResponse.data.devices?.[0] || '';
    return id || null;
  } catch (error) {
    return null;
  }
};
export const performPlaybackAction = async (buttonName: string, token: SpotifyAuthToken | null) => {
  const id = await getSpotifyDevices(token);
  const deviceParam = `device_id=${id}`;
  try {
    switch (buttonName) {
      case 'forward':
        await spotifyPOSTData(`${PLAYER_URL_FRAGMENT}/next?${deviceParam}`, token);
        break;
      case 'backward':
        await spotifyPOSTData(`${PLAYER_URL_FRAGMENT}/previous?${deviceParam}`, token);
        break;
      case 'pause':
        await spotifyPUTData(`${PLAYER_URL_FRAGMENT}/pause?${deviceParam}`, token);
        break;
      case 'play':
        await spotifyPUTData(`${PLAYER_URL_FRAGMENT}/play?${deviceParam}`, token);
        break;
      default:
        break;
    }
  } catch (err) {}
};
