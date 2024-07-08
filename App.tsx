/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import SplashScreen from 'react-native-lottie-splash-screen';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigation from './src/screens';
import SpotifyAuthContextProvider from './src/context';

if (__DEV__) {
  // eslint-disable-next-line global-require
  require('./ReactotronConfig');
}

function App() {
  useEffect(() => SplashScreen.hide(), []);
  return (
    <SpotifyAuthContextProvider>
      <PaperProvider>
        <RootNavigation />
      </PaperProvider>
    </SpotifyAuthContextProvider>
  );
}

export default App;
