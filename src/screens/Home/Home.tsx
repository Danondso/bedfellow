import React from 'react';
import { View, Button, Text } from 'react-native';
import { HomeScreenProps } from '../types';

async function authenticate() {
  try {
    console.log('Session:');
  } catch (error) {
    console.log('Spotify cannot login', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View>
      <Text> Home Screen </Text>
      <Button title="Log in with Spotify" onPress={() => authenticate()} />
    </View>
  );
}

export default HomeScreen;
