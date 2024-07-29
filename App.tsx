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
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewStyle } from 'react-native';
import ImagePaletteContextProvider from './src/context/ImagePaletteContext';
import RootNavigation from './src/screens';
import SpotifyAuthContextProvider from './src/context';

if (__DEV__) {
  // eslint-disable-next-line global-require
  require('./ReactotronConfig');
}

const safeAreaStyle: ViewStyle = {
  flex: 1,
};

function App() {
  useEffect(() => SplashScreen.hide(), []);
  return (
    <SafeAreaView style={safeAreaStyle}>
      <ImagePaletteContextProvider>
        <SpotifyAuthContextProvider>
          <PaperProvider>
            <RootNavigation />
          </PaperProvider>
        </SpotifyAuthContextProvider>
      </ImagePaletteContextProvider>
    </SafeAreaView>
  );
}

export default App;
