import React from 'react';
import { View, Button, Text } from 'react-native';
import { HOME } from '../constants/Screens';
import { DetailsScreenProps } from '../types';

function DetailsScreen({ navigation }: DetailsScreenProps) {
  return (
    <View>
      <Text> Details Screen </Text>
      <Button title="Go To Home" onPress={() => navigation.navigate(HOME)} />
    </View>
  );
}

export default DetailsScreen;
