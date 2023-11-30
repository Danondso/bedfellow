/* eslint-disable global-require */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undef, import/no-extraneous-dependencies */

// Import Jest Native matchers
import React from 'react';
import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

jest.mock('react-native-lottie-splash-screen', () => ({
  hide: jest.fn(),
}));

jest.mock('axios');

jest.mock('react-content-loader/native', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
  Rect: () => <></>,
  Circle: () => <></>,
}));
