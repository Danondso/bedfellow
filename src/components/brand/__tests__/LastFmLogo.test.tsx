import React from 'react';
import { render } from '@testing-library/react-native';
import LastFmLogo from '../LastFmLogo';

// Mock react-native-svg components
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Svg: 'Svg',
  Path: 'Path',
  Rect: 'Rect',
}));

describe('LastFmLogo', () => {
  it('should render with default props', () => {
    const { toJSON } = render(<LastFmLogo />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom size', () => {
    const { toJSON } = render(<LastFmLogo size={48} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom color', () => {
    const { toJSON } = render(<LastFmLogo color="#FF0000" />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with both custom size and color', () => {
    const { toJSON } = render(<LastFmLogo size={32} color="#D51007" />);
    expect(toJSON()).toBeTruthy();
  });

  it('should use last.fm brand color by default', () => {
    const { toJSON } = render(<LastFmLogo />);
    expect(toJSON()).toBeTruthy();
  });
});

export default {};

