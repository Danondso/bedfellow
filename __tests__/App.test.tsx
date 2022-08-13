import React from 'react';
import { render, screen } from '@testing-library/react-native';
import AppNavigator from '../src/screens';

jest.mock('../node_modules/react-native-spotify-remote', () => ({
  authorize: jest.fn(),
}));

it('Login Screen renders', async () => {
  render(<AppNavigator />);

  const loginText = await screen.findByText('a smol bean app');
  const loginButton = await screen.findAllByText(/Login/);

  expect(loginText).toBeTruthy();
  expect(loginButton.length).toBe(1);
});
