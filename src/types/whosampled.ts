export interface Sample {
  track: string;
  artist: string;
  year: number | null;
  image: string | null; // image blob, downloaded prior to posting to Bedfellow DB API
}

export interface TrackWithSamples {
  artist_name: string;
  track_name: string;
  samples: Array<Sample> | null;
}

export interface SearchResponse {
  tracks: Array<SearchData>;
}

export interface SearchData {
  id: number;
  url: string;
  artist_name: string;
  track_name: string;
  image_url: string;
  counts: string;
}
