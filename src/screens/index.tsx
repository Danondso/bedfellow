import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { AuthorizeResult } from 'react-native-app-auth';
import { RootStackParamList } from '../types';
import DetailsScreen from './CurrentTrack';
import { DETAILS, LOGIN, SETTINGS } from './constants/Screens';
import LoginScreen from './Login';
import SettingsScreen from './Settings';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../context/SpotifyAuthContext';

const Stack = createStackNavigator<RootStackParamList>();

export default function () {
  const spotifyAuthContext = useContext<SpotifyAuthContextData>(SpotifyAuthContext);

  const spotifyAuth: AuthorizeResult = spotifyAuthContext?.spotifyAuth;
  const currentDate = new Date();
  const expirationDate = spotifyAuth?.accessTokenExpirationDate
    ? new Date(spotifyAuth.accessTokenExpirationDate)
    : currentDate;
  const screenOptions: StackNavigationOptions = {
    headerShown: false,
  };

  // Check if user is not authenticated (no token or expired)
  const isNotAuthenticated = !spotifyAuth?.accessToken || expirationDate.getTime() <= currentDate.getTime();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {isNotAuthenticated ? (
          <>
            <Stack.Screen name={LOGIN} component={LoginScreen} />
            <Stack.Screen name={DETAILS} component={DetailsScreen} />
            <Stack.Screen name={SETTINGS} component={SettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name={DETAILS} component={DetailsScreen} />
            <Stack.Screen name={SETTINGS} component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
