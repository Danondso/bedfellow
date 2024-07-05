import axios, { AxiosError } from 'axios';

import parseWhoSampledPage from './utilities/utilities';
import { HEADER_TITLES, CONNECTIONS } from './enums';
import { Sample, SearchResponse, TrackWithSamples } from '../../types/whosampled';
import { ArtistObjectSimplified } from '../../types/spotify-api';

const { WHOSAMPLED_BASE_URL } = process.env;

export const searchAndRetrieveParsedWhoSampledPage = async (
  artists: ArtistObjectSimplified[],
  name: string
): Promise<TrackWithSamples | null> => {
  try {
    const artistNames = artists.map((artist) => artist.name);
    const searchResults = await Promise.all(
      await artistNames.map(async (artist) => {
        const result: SearchResponse | null = await searchWhoSampled(artist, name);
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
      artist_name: artistUsed || '',
      track_name: name,
      samples,
    };
  } catch (err) {
    return null;
  }
};

export const searchWhoSampled = async (artist: string, trackName: string): Promise<SearchResponse | null> => {
  try {
    const result = await axios.get<SearchResponse>(
      `${WHOSAMPLED_BASE_URL}/ajax/search/?q=${`${artist} ${trackName}`}&_=${Date.now()}`
    );
    return result.status === 200 ? result.data : null;
  } catch (error) {
    return null;
  }
};

export const getParsedWhoSampledPage = async (urlFragment: string): Promise<Sample[] | null> => {
  try {
    const document: string | null = await getWhoSampledDocument(urlFragment, CONNECTIONS.SAMPLES);
    if (!document) {
      throw new Error('Unable to find');
    }
    const result: Array<Sample> | null = await parseWhoSampledPage(document, HEADER_TITLES.CONTAINS_SAMPLES);

    if (!result) {
      return null;
    }

    return result;
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

export const getWhoSampledImage = async (url: string | null): Promise<string | null> => {
  if (!url) {
    return null;
  }

  try {
    const result = await axios.get(url, {
      responseType: 'blob',
    });
    return await blobToBase64(result.data);
  } catch (err) {
    return null;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};
