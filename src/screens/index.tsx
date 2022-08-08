import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootStackParamList } from './types';
import DetailsScreen from './Details/Details';
import { DETAILS, LOGIN } from './constants/Screens';
import LoginScreen from './Login';

import {
  initialState,
  SpotifyAuthContext,
  SpotifyAuthentication,
} from '../context';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function () {
  // TODO make this a custom hook
  const [spotifyAuth, setSpotifyAuth] =
    useState<SpotifyAuthentication>(initialState);

  const authState = useMemo<SpotifyAuthContext>(
    () => [spotifyAuth, setSpotifyAuth],
    [spotifyAuth, setSpotifyAuth],
  );
  return (
    <SpotifyAuthContext.Provider value={authState}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={LOGIN}>
            <Stack.Screen name={LOGIN} component={LoginScreen} />
            <Stack.Screen name={DETAILS} component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SpotifyAuthContext.Provider>
  );
}
