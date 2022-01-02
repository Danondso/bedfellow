import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from './Home/Home';
import DetailsScreen from './Details/Details';
import { DETAILS, HOME } from './constants/Screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={HOME}>
        <Stack.Screen name={HOME} component={HomeScreen} />
        <Stack.Screen name={DETAILS} component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
