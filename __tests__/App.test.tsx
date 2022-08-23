import React from 'react';
import { render, screen } from '@testing-library/react-native';
import AppNavigator from '../src/screens';
import SpotifyAuthContextProvider from '../src/context';

jest.mock('../node_modules/react-native-spotify-remote', () => ({
  authorize: jest.fn(),
}));

describe('<App />', () => {
  it('renders login screen snapshot', async () => {
    const component = render(
      <SpotifyAuthContextProvider>
        <AppNavigator />
      </SpotifyAuthContextProvider>,
    );

    const loginText = await screen.findByText('a smol bean app');
    const loginButton = await screen.findAllByText(/Login/);

    expect(component.toJSON()).toMatchSnapshot();
    expect(loginText).toBeTruthy();
    expect(loginButton.length).toBe(1);
  });
});
