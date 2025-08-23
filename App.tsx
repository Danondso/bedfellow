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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ThemeProvider from './src/context/ThemeContext';
import ImagePaletteContextProvider from './src/context/ImagePaletteContext';
import RootNavigation from './src/screens';
import SpotifyAuthContextProvider from './src/context';

// Temporarily disabled - Reactotron needs update for RN 0.81
// if (__DEV__) {
//   require('./ReactotronConfig');
// }

const safeAreaStyle: ViewStyle = {
  flex: 1,
};

function App() {
  useEffect(() => SplashScreen.hide(), []);
  return (
    <GestureHandlerRootView style={safeAreaStyle}>
      <ThemeProvider>
        <SafeAreaView style={safeAreaStyle}>
          <ImagePaletteContextProvider>
            <SpotifyAuthContextProvider>
              <PaperProvider>
                <RootNavigation />
              </PaperProvider>
            </SpotifyAuthContextProvider>
          </ImagePaletteContextProvider>
        </SafeAreaView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
