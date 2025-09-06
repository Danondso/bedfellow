export interface BedfellowSample {
  artist: string;
  id: number;
  image: string;
  track: string;
  year: number | null;
}

export interface BedfellowTrackSamples {
  artist: string;
  samples: Array<BedfellowSample>;
  status: string;
  track: string;
}

// Search endpoint types
export interface SearchQueryParams {
  q?: string;
  cursor?: string;
  limit?: number;
  sort?: 'created_at' | 'track_name' | 'artist_name';
  order?: 'asc' | 'desc';
}

export interface PaginationMetadata {
  next_cursor: string | null;
  prev_cursor: string | null;
  has_more: boolean;
  total_count: number;
  current_page_size: number;
}

export interface SearchMetadata {
  query: string | null;
  search_time_ms: number;
}

export interface SortingMetadata {
  field: string;
  order: string;
}

export interface PaginatedSearchResponse {
  data: BedfellowSample[];
  pagination: PaginationMetadata;
  search: SearchMetadata;
  sorting: SortingMetadata;
}
