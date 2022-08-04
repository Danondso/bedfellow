import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Details: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Details'
>;
