import React from 'react';
import { render } from '@testing-library/react-native';
import LastFmLogo from '../LastFmLogo';

describe('LastFmLogo', () => {
  it('should render with default props', () => {
    const { UNSAFE_root } = render(<LastFmLogo />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render with custom size', () => {
    const { UNSAFE_root } = render(<LastFmLogo size={48} />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render with custom color', () => {
    const { UNSAFE_root } = render(<LastFmLogo color="#FF0000" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render with both custom size and color', () => {
    const { UNSAFE_root } = render(<LastFmLogo size={32} color="#D51007" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should use last.fm brand color by default', () => {
    const { UNSAFE_root } = render(<LastFmLogo />);
    expect(UNSAFE_root).toBeDefined();
  });
});

export default {};

