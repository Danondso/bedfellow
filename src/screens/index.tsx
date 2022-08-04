import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootStackParamList } from './types';
import DetailsScreen from './Details/Details';
import { DETAILS, LOGIN } from './constants/Screens';
import LoginScreen from './Login';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function () {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={LOGIN}>
          <Stack.Screen name={LOGIN} component={LoginScreen} />
          <Stack.Screen name={DETAILS} component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
