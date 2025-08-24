import { StackScreenProps } from '@react-navigation/stack';

export * as BedfellowTypes from './bedfellow-api';

// TODO re-arrange these later get the rn nac stack stuff out this should just be datatypes
export type RootStackParamList = {
  Login: undefined;
  Details: undefined;
  Settings: undefined;
};

export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

export type DetailsScreenProps = StackScreenProps<RootStackParamList, 'Details'>;
