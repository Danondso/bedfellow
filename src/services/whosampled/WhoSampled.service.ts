import axios, { AxiosError } from 'axios';

import parseWhoSampledPage from './utilities/utilities';
import { HEADER_TITLES, CONNECTIONS } from './enums';
import { WhoSampledData, WhoSampledParseData, WhoSampledParseResult } from '../../types/whosampled';
import { TrackObjectFull } from '../../types/spotify-api';

const { WHOSAMPLED_BASE_URL } = process.env;

export const searchAndRetrieveParsedWhoSampledPage = async (
  trackInfo: TrackObjectFull
): Promise<WhoSampledParseResult | null> => {
  try {
    const trackName = trackInfo.name;
    const artists = trackInfo.artists.map((artist) => artist.name);

    const searchResults = await Promise.all(
      await artists.map(async (artist) => {
        const result: WhoSampledSearchResponse | null = await searchWhoSampled(artist, trackName);
        return {
          foundUrl: result?.tracks[0]?.url,
          artistUsed: artist,
        };
      })
    );
    let foundUrl;
    let artistUsed;

    for (let i = 0; i < searchResults.length; i++) {
      if (searchResults?.[i]?.foundUrl) {
        foundUrl = searchResults[i].foundUrl;
        artistUsed = searchResults[i].artistUsed;
        break;
      }
    }

    if (!foundUrl) {
      return null;
    }

    const samples = await getParsedWhoSampledPage(foundUrl);

    return {
      artist: artistUsed || '',
      track: trackName,
      samples,
    };
  } catch (err) {
    return null;
  }
};

export const searchWhoSampled = async (artist: string, trackName: string): Promise<WhoSampledSearchResponse | null> => {
  try {
    const result = await axios.get<WhoSampledSearchResponse>(
      `${WHOSAMPLED_BASE_URL}/ajax/search/?q=${`${artist} ${trackName}`}&_=${Date.now()}`
    );
    return result.status === 200 ? result.data : null;
  } catch (error) {
    return null;
  }
};

export const getParsedWhoSampledPage = async (urlFragment: string): Promise<WhoSampledParseData[] | null> => {
  try {
    // console.log('URL FRAGMENT', urlFragment);
    const document: string | null = await getWhoSampledDocument(urlFragment, CONNECTIONS.SAMPLES);
    if (!document) {
      throw new Error('Unable to find');
    }
    const result: Array<WhoSampledData> | null = parseWhoSampledPage(document, HEADER_TITLES.CONTAINS_SAMPLES);

    if (!result) {
      return null;
    }
    const parsedWhoSampledData: WhoSampledParseData[] = [];

    for (let i = 0; i < result?.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const image: string | null = await getWhoSampledImage(result[i].images.at(-1));
      parsedWhoSampledData.push({
        track: result[i].track,
        artist: result[i].artist,
        year: result[i].year,
        image,
      });
    }
    return parsedWhoSampledData;
  } catch (error) {
    console.log('ERROR::', error);
  }
  return null;
};

const getWhoSampledDocument = async (urlFragment: string, variant: CONNECTIONS): Promise<string | null> => {
  const url = `${WHOSAMPLED_BASE_URL}${urlFragment}${variant}`;
  try {
    // we first go to the main page for the variant
    const result = await axios.get(url, {
      responseType: 'text',
    });
    return result.status === 200 ? result.data : null;
  } catch (error: unknown) {
    const { response } = error as AxiosError;
    // if that page doesn't exist, that means there's only enough samples for the main page
    if (response?.status === 404) {
      // get the main page for the track
      const result = await axios.get(`${WHOSAMPLED_BASE_URL}${urlFragment}`, {
        responseType: 'text',
      });
      return result.data;
    }
  }
  return null;
};

export const getWhoSampledImage = async (url: string | undefined): Promise<string | null> => {
  if (!url) {
    return null;
  }

  try {
    const result = await axios.get(url, {
      responseType: 'blob',
    });
    return await blobToBase64(result.data);
  } catch (err) {
    console.log('ERROR:: getWhoSampledImage', err.response);
    return '';
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export interface WhoSampledTrack {
  trackName: string;
  artist: string;
  year: number;
  imageUrls: Array<string>;
}

export interface WhoSampledSearchResponse {
  tracks: Array<WhoSampledSearchTrackResult>;
}

export interface WhoSampledSearchTrackResult {
  id: number;
  url: string;
  artist_name: string;
  track_name: string;
  image_url: string;
  counts: string;
}

// TODO edge cases: souvenir by Milo
