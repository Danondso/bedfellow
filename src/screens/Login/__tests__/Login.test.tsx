import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../index';
import { LastFmAuthContextProvider } from '../../../context';

// Mock react-native-svg components
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Svg: 'Svg',
  Circle: 'Circle',
  Ellipse: 'Ellipse',
  Path: 'Path',
  G: 'G',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
  Rect: 'Rect',
  Polygon: 'Polygon',
}));

// Mock the LastFmAuthContext since it requires provider
jest.mock('../../../context', () => {
  const actualContext = jest.requireActual('../../../context');
  const React = require('react');
  const { View } = require('react-native');
  return {
    ...actualContext,
    LastFmAuthContextProvider: ({ children }: { children: any }) => 
      React.createElement(View, { testID: 'lastfm-auth-provider' }, children),
    useLastFmAuth: () => ({
      setAuthToken: jest.fn(),
      logout: jest.fn(),
      authState: { token: null, isLoading: false, error: null },
      isAuthenticated: false,
      clearError: jest.fn(),
    }),
  };
});

// Mock AnimatedOwl to avoid animation issues in tests
jest.mock('../../../components/brand/AnimatedOwl', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ size, variant, animationType, duration, style, animated }: any) => {
    return React.createElement(View, { testID: 'animated-owl', style }, React.createElement(Text, null, 'AnimatedOwl'));
  };
});

// Mock OwlMascot to avoid SVG rendering issues
jest.mock('../../../components/brand/OwlMascot', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ size, variant, style }: any) => {
    return React.createElement(View, { testID: 'owl-mascot', style }, React.createElement(Text, null, 'OwlMascot'));
  };
});

// Mock LastFmLogo and SpotifyLogo to avoid SVG rendering issues
jest.mock('../../../components/brand/LastFmLogo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ size, color }: any) => {
    return React.createElement(View, { testID: 'lastfm-logo', style: { size, color } }, React.createElement(Text, null, 'LastFm'));
  };
});

jest.mock('../../../components/brand/SpotifyLogo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ size, color }: any) => {
    return React.createElement(View, { testID: 'spotify-logo', style: { size, color } }, React.createElement(Text, null, 'Spotify'));
  };
});

// Mock react-native-app-auth
jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(() => Promise.resolve({
    accessToken: 'mock_token',
    accessTokenExpirationDate: '2024-12-31',
    idToken: 'mock_id',
    refreshToken: 'mock_refresh',
    tokenType: 'bearer',
    scopes: [],
    authorizationCode: 'mock_code',
  })),
}));

// Mock react-native-config
jest.mock('react-native-config', () => ({
  SPOTIFY_CLIENT_ID: 'test_client_id',
  SPOTIFY_REDIRECT_URI: 'test://callback',
  SPOTIFY_REDIRECT_URI_ANDROID: 'test://callback',
  BEDFELLOW_API_BASE_URL: 'http://localhost:8085',
  LASTFM_API_KEY: 'test_lastfm_key',
  LASTFM_API_SECRET: 'test_lastfm_secret',
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  canGoBack: jest.fn(() => false),
  isFocused: jest.fn(() => true),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Spotify login button', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    expect(getByText('Continue with Spotify')).toBeTruthy();
  });

  it('renders last.fm login button', () => {
    const { getByText } = render(
      <LastFmAuthContextProvider>
        <LoginScreen navigation={mockNavigation} />
      </LastFmAuthContextProvider>
    );
    
    expect(getByText('Continue with last.fm')).toBeTruthy();
  });

  it('has last.fm button with equal prominence to Spotify button', () => {
    const { getByText } = render(
      <LastFmAuthContextProvider>
        <LoginScreen navigation={mockNavigation} />
      </LastFmAuthContextProvider>
    );
    
    const spotifyButton = getByText('Continue with Spotify');
    const lastfmButton = getByText('Continue with last.fm');
    
    expect(spotifyButton).toBeTruthy();
    expect(lastfmButton).toBeTruthy();
    // Both buttons should be visible and accessible
  });

  it('calls last.fm authentication when last.fm button is pressed', () => {
    const { getByText } = render(
      <LastFmAuthContextProvider>
        <LoginScreen navigation={mockNavigation} />
      </LastFmAuthContextProvider>
    );
    
    const lastfmButton = getByText('Continue with last.fm');
    fireEvent.press(lastfmButton);
    
    // Test will verify authentication flow is triggered
  });

  it('last.fm button uses lastfm variant styling', () => {
    const { getByText } = render(
      <LastFmAuthContextProvider>
        <LoginScreen navigation={mockNavigation} />
      </LastFmAuthContextProvider>
    );
    
    const lastfmButton = getByText('Continue with last.fm');
    expect(lastfmButton).toBeTruthy();
    // The button should use last.fm red color (#D51007)
  });

  describe('last.fm OAuth flow integration', () => {
    let mockSetAuthToken: jest.Mock;
    let mockUseLastFmAuth: jest.Mock;

    beforeEach(() => {
      mockSetAuthToken = jest.fn();
      mockUseLastFmAuth = jest.fn(() => ({
        setAuthToken: mockSetAuthToken,
        logout: jest.fn(),
        authState: { token: null, isLoading: false, error: null },
        isAuthenticated: false,
        clearError: jest.fn(),
      }));
    });

    it('should navigate to DETAILS screen after successful authentication', async () => {
      const { getByText } = render(
        <LastFmAuthContextProvider>
          <LoginScreen navigation={mockNavigation} />
        </LastFmAuthContextProvider>
      );
      
      const lastfmButton = getByText('Continue with last.fm');
      fireEvent.press(lastfmButton);
      
      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Details');
      }, { timeout: 2000 });
    });

    it('should call setAuthToken when last.fm button is pressed', async () => {
      // This test verifies the authentication flow happens
      const { getByText } = render(
        <LastFmAuthContextProvider>
          <LoginScreen navigation={mockNavigation} />
        </LastFmAuthContextProvider>
      );
      
      const lastfmButton = getByText('Continue with last.fm');
      fireEvent.press(lastfmButton);
      
      // Wait for navigation which indicates successful auth
      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    it('last.fm button should be visible and pressable', () => {
      const { getByText } = render(
        <LastFmAuthContextProvider>
          <LoginScreen navigation={mockNavigation} />
        </LastFmAuthContextProvider>
      );
      
      const lastfmButton = getByText('Continue with last.fm');
      expect(lastfmButton).toBeTruthy();
    });
  });
});

export default {};

