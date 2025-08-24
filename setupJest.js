/* eslint-disable global-require */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undef, import/no-extraneous-dependencies */

// Import Jest Native matchers
import React from 'react';
import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Note: In React Native 0.81+, deep imports are deprecated and NativeAnimatedHelper mock is no longer needed

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
    useSafeAreaInsets: () => inset,
    initialWindowMetrics: {
      insets: inset,
      frame: { x: 0, y: 0, width: 375, height: 812 },
    },
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  };
});

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

jest.mock('react-native-lottie-splash-screen', () => ({
  hide: jest.fn(),
}));

jest.mock('react-native-image-colors', () => ({
  getColors: jest.fn(),
}));

jest.mock('axios');

jest.mock('react-content-loader/native', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
  Rect: () => <></>,
  Circle: () => <></>,
}));

// Mock @react-navigation/stack
jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{children}</View>,
      Screen: ({ component: Component, ...props }) => (Component ? <Component {...props} /> : null),
    }),
    CardStyleInterpolators: {},
    HeaderStyleInterpolators: {},
    TransitionPresets: {},
    TransitionSpecs: {},
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    NavigationContainer: ({ children }) => <View>{children}</View>,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
  };
});

// Mock react-native-gesture-handler
// Mock react-native-paper components that cause issues in tests
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const actual = jest.requireActual('react-native-paper');

  return {
    ...actual,
    Snackbar: ({ children, visible, onDismiss, ...props }) =>
      visible ? React.createElement(View, props, children) : null,
    Portal: ({ children }) => children,
    Provider: ({ children }) => children,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View, TouchableOpacity, ScrollView, FlatList } = require('react-native');

  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView,
    FlatList,
    RectButton: View,
    BaseButton: View,
    TouchableOpacity,
    GestureHandlerRootView: View,
    PanGestureHandler: ({ children }) => children,
    TapGestureHandler: ({ children }) => children,
    LongPressGestureHandler: ({ children }) => children,
    NativeViewGestureHandler: ({ children }) => children,
    FlingGestureHandler: ({ children }) => children,
    ForceTouchGestureHandler: ({ children }) => children,
    PinchGestureHandler: ({ children }) => children,
    RotationGestureHandler: ({ children }) => children,
    RawButton: View,
    BorderlessButton: View,
    Directions: {},
  };
});
