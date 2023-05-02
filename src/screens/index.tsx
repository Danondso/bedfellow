import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import DetailsScreen from './Details';
import { DETAILS, LOGIN } from './constants/Screens';
import LoginScreen from './Login';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
  SpotifyAuthentication,
} from '../context/SpotifyAuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const commonOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export default function () {
  const spotifyAuthContext =
    useContext<SpotifyAuthContextData>(SpotifyAuthContext);

  const spotifyAuth = spotifyAuthContext?.spotifyAuth as SpotifyAuthentication;
  const currentDate = new Date();
  const expirationDate = spotifyAuth?.expirationDate
    ? new Date(spotifyAuth.expirationDate)
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
