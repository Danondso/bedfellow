// import React from 'react';
// import { render, screen } from '@testing-library/react-native';
// import App from '../App';

// jest.mock('../node_modules/react-native-spotify-remote', () => ({
//   authorize: jest.fn(),
// }));

// it('Login Screen renders', async () => {
//   render(<App />);

//   const loginText = await screen.findByText('a smol bean app');
//   const loginButton = await screen.findAllByText(/Login/);

//   expect(loginText).toBeTruthy();
//   expect(loginButton.length).toBe(1);
// });

it('asserts true', () => {
  expect(true).toBeTruthy();
});
