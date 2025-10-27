import React, { type ReactNode } from 'react';
import MusicProviderContextProvider from './MusicProviderContext';
import SpotifyAuthContextProvider from './SpotifyAuthContext';

const AppContextProvider = ({ children }: { children: ReactNode }) => (
  <MusicProviderContextProvider>
    <SpotifyAuthContextProvider>{children}</SpotifyAuthContextProvider>
  </MusicProviderContextProvider>
);

export default AppContextProvider;
export { MusicProviderContextProvider, SpotifyAuthContextProvider };
