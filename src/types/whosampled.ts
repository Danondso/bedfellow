export interface WhoSampledData {
  track: string;
  artist: string;
  year: number | null;
  images: string[];
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
