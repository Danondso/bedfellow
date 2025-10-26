import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface LastFmLogoProps {
  size?: number;
  color?: string;
}

const LastFmLogo: React.FC<LastFmLogoProps> = ({ size = 24, color = '#D51007' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* last.fm logo - simplified version */}
      <Rect width="24" height="24" rx="4" fill={color} />
      <Path
        d="M6 7C6 5.9 6.9 5 8 5H11C11.6 5 12 5.4 12 6C12 6.6 11.6 7 11 7H8V17C8 18.1 8.9 19 10 19C11.1 19 12 18.1 12 17C12 15.9 11.1 15 10 15C9.4 15 9 15.4 9 16V17C9 17.6 8.6 18 8 18C7.4 18 7 17.6 7 17V7C7 6.9 6.1 6.9 6 7ZM14 7C14 5.9 14.9 5 16 5H19C19.6 5 20 5.4 20 6C20 6.6 19.6 7 19 7H16V13C16 14.1 16.9 15 18 15C19.1 15 20 14.1 20 13C20 11.9 19.1 11 18 11C17.4 11 17 11.4 17 12V13C17 13.6 17.4 14 18 14C19.1 14 20 13.1 20 12C20 11.4 19.6 11 19 11C18.4 11 18 11.4 18 12C18 12.6 18.4 13 19 13C20.1 13 21 12.1 21 11C21 9.9 20.1 9 19 9C18.4 9 18 9.4 18 10V7C18 5.9 17.1 5 16 5Z"
        fill="#FFFFFF"
        transform="scale(0.6) translate(3, 3)"
      />
      <Path
        d="M12 7C12 5.9 12.9 5 14 5H17C17.6 5 18 5.4 18 6C18 6.6 17.6 7 17 7H14V14C14 14.6 14.4 15 15 15C15.6 15 16 14.6 16 14C16 13.4 15.6 13 15 13C14.4 13 14 13.4 14 14V17C14 18.1 14.9 19 16 19C17.1 19 18 18.1 18 17C18 15.9 17.1 15 16 15C15.4 15 15 15.4 15 16V17C15 17.6 14.6 18 14 18C13.4 18 13 17.6 13 17V7C13 6.9 12.1 6.9 12 7Z"
        fill="#FFFFFF"
        transform="scale(0.7) translate(2, 4)"
      />
    </Svg>
  );
};

export default LastFmLogo;

