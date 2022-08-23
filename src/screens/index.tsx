import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import DetailsScreen from './Details';
import { DETAILS, LOGIN } from './constants/Screens';
import LoginScreen from './Login';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={LOGIN}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name={LOGIN}
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name={DETAILS}
          component={DetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
