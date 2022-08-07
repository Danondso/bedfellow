import React from 'react';
import { View, Button } from 'react-native';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig,
} from 'react-native-spotify-remote';
import { HomeScreenProps } from '../types';

async function authenticate() {
  try {
    // Api Config object, replace with your own applications client id and urls
    const spotifyConfig: ApiConfig = {
      clientID: '74632aad45994f23b3b9aabfcb6e4f8b',
      redirectURL: 'org.danondso.bedfellow://callback', // this should be the app
      tokenRefreshURL: '',
      tokenSwapURL: '',
      scopes: [
        ApiScope.UserReadCurrentlyPlayingScope,
        ApiScope.UserFollowReadScope,
      ],
    };

    const session = await SpotifyAuth.authorize(spotifyConfig);

    console.log(session);
    await SpotifyRemote.connect(session.accessToken);
  } catch (error) {
    console.log('Spotify cannot login', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LoginScreen({ navigation }: HomeScreenProps) {
  return (
    <View>
      <Button title="Log in with Spotify" onPress={() => authenticate()} />
    </View>
  );
}

export default LoginScreen;
