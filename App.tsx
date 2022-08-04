/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import SplashScreen from 'react-native-lottie-splash-screen';
import RootNavigation from './src/screens';

function App(): ReactNode {
  useEffect(() => SplashScreen.hide(), []);
  return <RootNavigation />;
}

export default App;
