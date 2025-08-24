import React from 'react';
import { render as rtlRender } from '@testing-library/react-native';
import { SpotifyAuthContext } from '../../src/context/SpotifyAuthContext';

// Mock auth result with valid expiration
const mockAuthResult = {
  accessToken: 'accessToken',
  accessTokenExpirationDate: new Date(Date.now() + 3600000).toISOString(), // Valid for 1 hour
  idToken: 'id',
  refreshToken: 'refreshToken',
  tokenType: 'bearer',
  scopes: [],
  authorizationCode: 'codeywodey',
  expired: false,
};

const mockSpotifyAuthContext = {
  spotifyAuth: mockAuthResult,
  setSpotifyAuth: jest.fn(),
  resetToken: jest.fn(),
};

// Custom render function that includes providers
export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(
    <SpotifyAuthContext.Provider value={mockSpotifyAuthContext}>{ui}</SpotifyAuthContext.Provider>,
    options
  );
}

// Re-export everything from React Testing Library
export * from '@testing-library/react-native';
