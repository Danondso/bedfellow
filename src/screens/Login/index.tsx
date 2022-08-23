import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import {
  auth as SpotifyAuth,
  ApiScope,
  ApiConfig,
} from 'react-native-spotify-remote';
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_REDIRECT_URI_ANDROID,
  SPOTIFY_TOKEN_REFRESH_URL,
  SPOTIFY_TOKEN_SWAP_URL,
} from 'react-native-dotenv';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
  SpotifyAuthentication,
} from '../../context/SpotifyAuthContext';
import { DETAILS } from '../constants/Screens';
import { LoginScreenProps } from '../../types';
import styles from './Login.styles';

function LoginScreen({ navigation }: LoginScreenProps) {
  const spotifyAuthContext = useContext<SpotifyAuthContextData | undefined>(
    SpotifyAuthContext,
  );

  console.log(spotifyAuthContext);

  const { setSpotifyAuth } = spotifyAuthContext as SpotifyAuthContextData;

  async function authenticate() {
    try {
      const spotifyConfig: ApiConfig = {
        clientID: SPOTIFY_CLIENT_ID,
        redirectURL:
          Platform.OS === 'ios'
            ? SPOTIFY_REDIRECT_URI
            : SPOTIFY_REDIRECT_URI_ANDROID,
        tokenRefreshURL: SPOTIFY_TOKEN_REFRESH_URL,
        tokenSwapURL: SPOTIFY_TOKEN_SWAP_URL,
        scopes: [
          ApiScope.UserReadCurrentlyPlayingScope,
          ApiScope.UserFollowReadScope,
        ],
      };

      const session: SpotifyAuthentication = await SpotifyAuth.authorize(
        spotifyConfig,
      );

      if (setSpotifyAuth && session.refreshToken) {
        setSpotifyAuth(session);
        navigation.navigate(DETAILS);
      }
    } catch (error) {
      // TODO error message w/ animation here
      console.log('Spotify cannot login', error);
    }
  }

  return (
    <View style={styles.view}>
      <View style={styles.loginView}>
        <Text style={styles.header}> Bedfellow </Text>
        <Text style={styles.subHeader}>a smol bean app</Text>
        <View style={styles.loginButtonView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => authenticate()}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;
