import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '@screens/Login';
import { MusicProviderId } from '@services/music-providers/types';
import type { LoginScreenProps } from '@types';

jest.mock('@context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      spacing: {
        md: 8,
        lg: 16,
        xl: 24,
        xxl: 32,
        xxxl: 40,
      },
      typography: {
        base: 16,
        lg: 20,
        sm: 12,
      },
      colors: {
        background: { 50: '#fff', 100: '#f2f2f2' },
        primary: { 300: '#a0d', 500: '#0d6efd', 600: '#0b5ed7' },
        secondary: { 300: '#eee', 500: '#ccc', 600: '#bbb' },
        accent: { 300: '#eee', 500: '#ccc', 600: '#bbb' },
        surface: { 50: '#fff' },
        text: { 50: '#fff', 100: '#fafafa', 300: '#999', 500: '#666', 600: '#444', 700: '#222', 900: '#000' },
        error: { 600: '#f00' },
        border: { 100: '#ddd', 200: '#bbb' },
        success: { 600: '#0f0' },
        warning: { 600: '#ff0' },
        accentGradient: ['#fff', '#eee'],
        accentText: '#333',
      },
      borderRadius: { md: 12, lg: 16, xl: 24, '3xl': 32, full: 999 },
      shadows: { sm: {} },
      mode: 'light',
    },
  }),
}));

jest.mock('@context/ThemeContext/ThemeTransition', () => ({
  ThemeTransition: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@components/themed/ThemedView', () => {
  const React = require('react');
  const { View } = require('react-native');
  const ThemedView = ({ children, style }: any) => <View style={style}>{children}</View>;
  (ThemedView as any).ThemedSpacer = () => null;
  return ThemedView;
});

jest.mock('@components/themed/ThemedText', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

jest.mock('@components/themed/ThemedButton', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, onPress, disabled, testID }: any) => (
      <Text accessibilityRole="button" testID={testID} onPress={disabled ? undefined : () => onPress?.()}>
        {children}
      </Text>
    ),
  };
});

jest.mock('@components/brand/AnimatedOwl', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="animated-owl" />,
  };
});

jest.mock('@components/brand/SpotifyLogo', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="spotify-logo" />,
  };
});

const mockUseMusicProvider = jest.fn();
jest.mock('@context/MusicProviderContext', () => ({
  useMusicProvider: () => mockUseMusicProvider(),
}));

jest.mock('@context/SpotifyAuthContext', () => {
  const React = require('react');
  const value = {
    setAuthToken: jest.fn(),
    authState: {
      token: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
    },
    clearError: jest.fn(),
    refreshToken: jest.fn(),
    isTokenExpiring: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: false,
  };
  const Context = React.createContext(value);
  return {
    __esModule: true,
    SpotifyAuthContext: Context,
    SpotifyAuthContextData: {},
    default: ({ children }: { children: React.ReactNode }) => (
      <Context.Provider value={value}>{children}</Context.Provider>
    ),
  };
});

const renderLogin = () => {
  const props = {
    navigation: { navigate: jest.fn() },
    route: { params: undefined },
  } as unknown as LoginScreenProps;
  return render(<LoginScreen {...props} />);
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login screen with Spotify button', () => {
    mockUseMusicProvider.mockReturnValue({
      availableProviders: [{ id: MusicProviderId.Spotify, displayName: 'Spotify' }],
      activeProviderId: MusicProviderId.Spotify,
      setActiveProvider: jest.fn(),
      isProviderAvailable: () => true,
    });

    const { getByText } = renderLogin();

    expect(getByText('Bedfellow')).toBeTruthy();
    expect(getByText('Discover the stories behind the music')).toBeTruthy();
    expect(getByText('Continue with Spotify')).toBeTruthy();
  });

  it('disables the continue button when the active provider is unavailable', () => {
    mockUseMusicProvider.mockReturnValue({
      availableProviders: [{ id: MusicProviderId.Spotify, displayName: 'Spotify' }],
      activeProviderId: MusicProviderId.Spotify,
      setActiveProvider: jest.fn(),
      isProviderAvailable: () => false,
    });

    const { getByText } = renderLogin();

    expect(getByText('Continue with Spotify').props.onPress).toBeUndefined();
  });

  it('enables the continue button when the active provider is available', () => {
    mockUseMusicProvider.mockReturnValue({
      availableProviders: [{ id: MusicProviderId.Spotify, displayName: 'Spotify' }],
      activeProviderId: MusicProviderId.Spotify,
      setActiveProvider: jest.fn(),
      isProviderAvailable: () => true,
    });

    const { getByText } = renderLogin();

    expect(getByText('Continue with Spotify').props.onPress).toBeDefined();
  });
});
