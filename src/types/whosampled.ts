import { WhoSampledTypes } from ".";

export interface WhoSampledData {
  track: string;
  artist: string;
  year: number | null;
  images: string[];
}

export interface WhoSampledParseData extends Omit<WhoSampledData, 'images'> {
  image: string | null;
}

export interface WhoSampledParseResult {
  artist: string;
  track: string;
  samples: Array<WhoSampledParseData> | null;
}

export interface WhoSampledSearchResponse {
  tracks: Array<WhoSampledSearchData>;
}

export interface WhoSampledSearchData {
  id: number;
  url: string;
  artist_name: string;
  track_name: string;
  image_url: string;
  counts: string;
}
