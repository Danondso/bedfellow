import React from 'react';
import { View, Text, Button } from 'react-native';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig,
} from 'react-native-spotify-remote';
import { HomeScreenProps } from '../types';

async function authenticate() {
  console.log('Do I work?>>?');
  try {
    // Api Config object, replace with your own applications client id and urls
    const spotifyConfig: ApiConfig = {
      clientID: '74632aad45994f23b3b9aabfcb6e4f8b',
      redirectURL: 'http://localhost:8001',
      tokenRefreshURL: 'http://localhost:8001/refresh',
      tokenSwapURL: 'http://localhost:8001/token_swap',
      scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
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
      <Text> Login Screen </Text>
      <Button title="Log in with Spotify" onPress={() => authenticate()} />
    </View>
  );
}

export default LoginScreen;
