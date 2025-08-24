import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useTheme } from '../../../../context/ThemeContext';

export default function CurrentSongHeaderSkeleton() {
  const { theme } = useTheme();

  return (
    <ContentLoader
      speed={1}
      width="100%"
      height={300}
      viewBox="0 0 400 300"
      backgroundColor={theme.colors.background[200]}
      foregroundColor={theme.colors.background[100]}
    >
      {/* Album image placeholder - fully rounded for warm aesthetic */}
      <Rect x="155" y="20" rx="45" ry="45" width="90" height="90" />
      {/* Track name - pill-shaped for headers */}
      <Rect x="50" y="130" rx="10" ry="10" width="300" height="20" />
      {/* Artist name - softer rounded corners */}
      <Rect x="100" y="160" rx="8" ry="8" width="200" height="16" />
      {/* Album name - softer rounded corners */}
      <Rect x="130" y="186" rx="7" ry="7" width="140" height="14" />
    </ContentLoader>
  );
}
