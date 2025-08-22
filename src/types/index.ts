import { NativeStackScreenProps } from '@react-navigation/native-stack';

export * as BedfellowTypes from './bedfellow-api';
export * as WhoSampledTypes from './whosampled';

// TODO re-arrange these later get the rn nac stack stuff out this should just be datatypes
export type RootStackParamList = {
  Login: undefined;
  Details: undefined;
  Settings: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
