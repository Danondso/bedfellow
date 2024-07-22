import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import {
  BEDFELLOW_API_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_REDIRECT_URI_ANDROID,
  // eslint-disable-next-line import/no-unresolved
} from '@env';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../context/SpotifyAuthContext';
import { DETAILS } from '../constants/Screens';
import { LoginScreenProps } from '../../types';
import styles from './Login.styles';

function LoginScreen({ navigation }: LoginScreenProps) {
  const spotifyAuthContext = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { setSpotifyAuth } = spotifyAuthContext as SpotifyAuthContextData;

  async function authenticate() {
    try {
      const config = {
        clientId: SPOTIFY_CLIENT_ID,
        usePKCE: false,
        redirectUrl: Platform.OS === 'ios' ? SPOTIFY_REDIRECT_URI : SPOTIFY_REDIRECT_URI_ANDROID,
        scopes: ['user-modify-playback-state', 'user-follow-read', 'user-read-currently-playing'],
        serviceConfiguration: {
          authorizationEndpoint: 'https://accounts.spotify.com/authorize',
          tokenEndpoint: `${BEDFELLOW_API_BASE_URL}/token`,
        },
      };

      const session: AuthorizeResult = await authorize(config);
      if (setSpotifyAuth && session.refreshToken) {
        setSpotifyAuth({
          ...session,
          expired: false,
        });
        navigation.navigate(DETAILS);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Failed to login', error.message);
      } else {
        Alert.alert('Failed to login');
      }
    }
  }

  return (
    <View style={styles.view}>
      <View style={styles.loginView}>
        <Text style={styles.header}> Bedfellow </Text>
        <Text style={styles.subHeader}>a smol bean app</Text>
        <View style={styles.loginButtonView}>
          <TouchableOpacity style={styles.button} onPress={() => authenticate()}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;
