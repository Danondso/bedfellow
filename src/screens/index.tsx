import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AuthorizeResult } from 'react-native-app-auth';
import { RootStackParamList } from '../types';
import DetailsScreen from './CurrentTrack';
import { DETAILS, LOGIN } from './constants/Screens';
import LoginScreen from './Login';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
} from '../context/SpotifyAuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const commonOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export default function () {
  const spotifyAuthContext =
    useContext<SpotifyAuthContextData>(SpotifyAuthContext);

  const spotifyAuth = spotifyAuthContext?.spotifyAuth as AuthorizeResult;
  const currentDate = new Date();
  const expirationDate = spotifyAuth?.accessTokenExpirationDate
    ? new Date(spotifyAuth.accessTokenExpirationDate)
    : currentDate;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {expirationDate.getTime() <= currentDate.getTime() ? (
          <>
            <Stack.Screen
              options={commonOptions}
              name={LOGIN}
              component={LoginScreen}
            />
            <Stack.Screen
              options={commonOptions}
              name={DETAILS}
              component={DetailsScreen}
            />
          </>
        ) : (
          <Stack.Screen
            options={commonOptions}
            name={DETAILS}
            component={DetailsScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
