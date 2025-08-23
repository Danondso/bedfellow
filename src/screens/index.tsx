import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { AuthorizeResult } from 'react-native-app-auth';
import { RootStackParamList } from '../types';
import DetailsScreen from './CurrentTrack';
import { DETAILS, LOGIN, SETTINGS } from './constants/Screens';
import LoginScreen from './Login';
import SettingsScreen from './Settings';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../context/SpotifyAuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function () {
  const spotifyAuthContext = useContext<SpotifyAuthContextData>(SpotifyAuthContext);

  const spotifyAuth: AuthorizeResult = spotifyAuthContext?.spotifyAuth;
  const currentDate = new Date();
  const expirationDate = spotifyAuth?.accessTokenExpirationDate
    ? new Date(spotifyAuth.accessTokenExpirationDate)
    : currentDate;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {expirationDate.getTime() <= currentDate.getTime() ? (
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
