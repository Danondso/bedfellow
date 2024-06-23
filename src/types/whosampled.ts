export interface WhoSampledData {
  track_name: string;
  artist: string;
  year: number;
  image: string;
}

export interface WhoSampledSearchData {
  id: number;
  url: string;
  artist_name: string;
  track_name: string;
  image_url: string;
  counts: string;
}

export interface WhoSampledResponse {
  samples: Array<WhoSampledData>;
  sampled_by: Array<WhoSampledData>;
  covers: Array<WhoSampledData>;
}

export interface WhoSampledSearchResponse {
  tracks: Array<WhoSampledSearchData>;
}

export interface WhoSampledErrorResponse {
  error: string;
}
