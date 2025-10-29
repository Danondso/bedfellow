import React from 'react';
import { render as rtlRender } from '@testing-library/react-native';
import MusicProviderContextProvider from '../../src/context/MusicProviderContext';

// Custom render function that includes providers
export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(<MusicProviderContextProvider>{ui}</MusicProviderContextProvider>, options);
}

// Re-export everything from React Testing Library
export * from '@testing-library/react-native';
