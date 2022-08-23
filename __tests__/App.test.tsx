import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

jest.mock('../node_modules/react-native-spotify-remote', () => ({
  authorize: jest.fn(),
}));

jest.mock('react-native-lottie-splash-screen', () => ({
  hide: jest.fn(),
}));

describe('<App />', () => {
  it('renders login screen snapshot', async () => {
    const component = render(<App />);

    const loginText = await screen.findByText('a smol bean app');
    const loginButton = await screen.findAllByText(/Login/);

    expect(component.toJSON()).toMatchSnapshot();
    expect(loginText).toBeTruthy();
    expect(loginButton.length).toBe(1);
  });
});
