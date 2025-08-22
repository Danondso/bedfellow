/**
 * Example of how to update App.tsx to use the new theme system
 * This file shows the migration from ImagePaletteContext to ThemeContext
 */

import React, { useEffect } from 'react';
import SplashScreen from 'react-native-lottie-splash-screen';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppStartup } from './src/components/AppStartup';
import { ThemeProvider } from './src/context/ThemeContext';
import { ThemedSafeAreaView } from './src/components/themed';
import RootNavigation from './src/screens';
import SpotifyAuthContextProvider from './src/context';

if (__DEV__) {
  // eslint-disable-next-line global-require
  require('./ReactotronConfig');
}

function App() {
  const handleAppReady = () => {
    // Hide native splash screen when app is ready
    SplashScreen.hide();
  };

  return (
    <AppStartup showSplash={true} splashDuration={1500} onReady={handleAppReady}>
      <ThemeProvider>
        <ThemedSafeAreaView>
          <SpotifyAuthContextProvider>
            <PaperProvider>
              <RootNavigation />
            </PaperProvider>
          </SpotifyAuthContextProvider>
        </ThemedSafeAreaView>
      </ThemeProvider>
    </AppStartup>
  );
}

export default App;
