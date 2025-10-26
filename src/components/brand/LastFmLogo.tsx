import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface LastFmLogoProps {
  size?: number;
  color?: string;
}

const LastFmLogo: React.FC<LastFmLogoProps> = ({ size = 24, color = '#D51007' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* last.fm logo - letter "f" */}
      <Rect x="0" y="0" width={size} height={size} rx="4" fill={color} />
      <Path
        d="M8 6C8 5.4 8.4 5 9 5H11C11.6 5 12 5.4 12 6C12 6.6 11.6 7 11 7H10V12H11C11.6 12 12 12.4 12 13C12 13.6 11.6 14 11 14H10V17C10 17.6 9.6 18 9 18C8.4 18 8 17.6 8 17V6Z"
        fill="#FFFFFF"
      />
      <Path
        d="M14 6C14 5.4 14.4 5 15 5H17C17.6 5 18 5.4 18 6C18 6.6 17.6 7 17 7H16V10C16 10.6 16.4 11 17 11C17.6 11 18 10.6 18 10C18 9.4 17.6 9 17 9H16V6C16 5.4 15.6 5 15 5Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
};

export default LastFmLogo;

