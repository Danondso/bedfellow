import React, { useContext } from 'react';
import { View, Button } from 'react-native';
import {
  auth as SpotifyAuth,
  ApiScope,
  ApiConfig,
} from 'react-native-spotify-remote';
import { SpotifyAuthContext, SpotifyAuthentication } from '../../context';
import { DETAILS } from '../constants/Screens';
import { LoginScreenProps } from '../types';

function LoginScreen({ navigation }: LoginScreenProps) {
  const setSpotifyAuth = useContext(SpotifyAuthContext)?.[1];

  async function authenticate() {
    const {
      SPOTIFY_CLIENT_ID = '',
      SPOTIFY_REDIRECT_URI = '',
      SPOTIFY_TOKEN_REFRESH_URL,
      SPOTIFY_TOKEN_SWAP_URL,
    } = process.env;
    try {
      const spotifyConfig: ApiConfig = {
        clientID: SPOTIFY_CLIENT_ID,
        redirectURL: SPOTIFY_REDIRECT_URI,
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
      console.log('Spotify cannot login', error);
    }
  }

  return (
    <View>
      <Button title="Log in with Spotify" onPress={() => authenticate()} />
    </View>
  );
}

export default LoginScreen;
