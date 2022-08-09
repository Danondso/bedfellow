import React, { useContext } from 'react';
import { View, Button, Text } from 'react-native';
import { SpotifyAuthContext } from '../../context';
import { LOGIN } from '../constants/Screens';
import { DetailsScreenProps } from '../../types';

function DetailsScreen({ navigation }: DetailsScreenProps) {
  const spotifyAuthToken = useContext(SpotifyAuthContext)?.[0];
  return (
    <View>
      <Text> {spotifyAuthToken?.refreshToken} </Text>
      <Text> Details Screen </Text>
      <Button title="Go To Home" onPress={() => navigation.navigate(LOGIN)} />
    </View>
  );
}

export default DetailsScreen;
