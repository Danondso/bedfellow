import React from 'react';
import { View, Button, Text } from 'react-native';
import {
    auth as SpotifyAuth,
    remote as SpotifyRemote,
    ApiScope,
    ApiConfig,
} from 'react-native-spotify-remote'; 
import { HomeScreenProps } from '../types';

const spotifyConfig: ApiConfig = {
    clientID: '',
    redirectURL: '',
    tokenRefreshURL: '',
    tokenSwapURL: '',
    scopes: [ApiScope.UserReadEmailScope],
  };

async function authenticate() {
    try {
        const session = await SpotifyAuth.authorize(spotifyConfig);
        console.log('Session:', session);
    } catch (error) {
        console.log('Spotify cannot login', error);
    }
}

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View>
      <Text> Home Screen </Text>
      <Button
        title="Log in with Spotify"
        onPress={() => authenticate()}
      />
    </View>
  );
}

export default HomeScreen;
