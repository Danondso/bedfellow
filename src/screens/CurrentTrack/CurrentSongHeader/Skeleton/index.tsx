import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

export default function CurrentSongHeaderSkeleton() {
  return (
    <ContentLoader
      speed={1}
      //   backgroundColor={theme.defaultPalette.primaryBackground}
      //   foregroundColor={theme.defaultPalette.primaryBackground100}
      //   style={styles.skeletonLoader}
    >
      {/* sample pic */}
      <Circle cx="20" cy="20" r="20" />
      {/* artist name */}
      <Rect x="0" y="210" rx="8" ry="8" width="90%" height="30" />
      {/* album name */}
      <Rect x="0" y="250" rx="8" ry="4" width="40%" height="20" />
    </ContentLoader>
  );
}
