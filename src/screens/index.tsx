import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { RootStackParamList } from '../types';
import DetailsScreen from './CurrentTrack';
import { DETAILS, LOGIN, SETTINGS, SEARCH } from './constants/Screens';
import LoginScreen from './Login';
import SettingsScreen from './Settings';
import SearchScreen from './Search';
import { useAuth } from '../hooks/useAuth';

const Stack = createStackNavigator<RootStackParamList>();

export default function () {
  const { authState, isAuthenticated } = useAuth();

  const screenOptions: StackNavigationOptions = {
    headerShown: false,
  };

  // Show loading screen while checking auth
  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name={LOGIN} component={LoginScreen} />
            <Stack.Screen name={DETAILS} component={DetailsScreen} />
            <Stack.Screen name={SETTINGS} component={SettingsScreen} />
            <Stack.Screen
              name={SEARCH}
              component={SearchScreen}
              options={{
                presentation: 'modal',
                animationTypeForReplace: 'push',
                animation: 'slide_from_bottom',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name={DETAILS} component={DetailsScreen} />
            <Stack.Screen name={SETTINGS} component={SettingsScreen} />
            <Stack.Screen
              name={SEARCH}
              component={SearchScreen}
              options={{
                presentation: 'modal',
                animationTypeForReplace: 'push',
                animation: 'slide_from_bottom',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
