import React, { type ReactNode } from 'react';
import MusicProviderContextProvider from './MusicProviderContext';

const AppContextProvider = ({ children }: { children: ReactNode }) => (
  <MusicProviderContextProvider>{children}</MusicProviderContextProvider>
);

export default AppContextProvider;
export { MusicProviderContextProvider };
