import React from 'react';
import {View, Button, Text} from 'react-native';
import { DETAILS } from '../constants/Screens';
import {HomeScreenProps} from '../types';

function HomeScreen({navigation} : HomeScreenProps) {
  return (
    <View>
      <Text> Home Screen </Text>
      <Button
        title="Go To Details"
        onPress={() => navigation.navigate(DETAILS)}
      />
    </View>
  );
}

export default HomeScreen;
