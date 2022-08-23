/* eslint-disable no-undef, import/no-extraneous-dependencies */

// Import Jest Native matchers
import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-spotify-remote', () => ({
  authorize: jest.fn(),
}));

jest.mock('react-native-lottie-splash-screen', () => ({
  hide: jest.fn(),
}));
