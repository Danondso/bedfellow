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
  artist: String;
  year: Number;
  images: Array<String>;
}

export interface WhoSampledSearchData {
  id: Number;
  url: String;
  artist_name: String;
  track_name: String;
  image_url: String;
  counts: String;
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
  error: String;
}
