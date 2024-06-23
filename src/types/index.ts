import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Details: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Details'
>;

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

export interface WhoSampledSearchResponse {
  tracks: Array<WhoSampledSearchData>;
}

export interface WhoSampledErrorResponse {
  error: string;
}
