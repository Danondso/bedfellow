export interface BedfellowSample {
  artist: String;
  id: Number;
  image: Blob;
  track: String;
  year: 1995;
}

export interface BedfellowTrackSamples {
  artist: String;
  samples: Array<BedfellowSample>;
  status: String;
  track: String;
}
