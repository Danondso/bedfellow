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
