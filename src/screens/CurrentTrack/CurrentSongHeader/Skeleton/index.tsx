import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

export default function CurrentSongHeaderSkeleton() {
  return (
    <ContentLoader
      speed={1}
      width="100%"
      height={300}
      viewBox="0 0 400 300"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* Album image placeholder */}
      <Rect x="155" y="20" rx="45" ry="45" width="90" height="90" />
      {/* Track name */}
      <Rect x="50" y="130" rx="4" ry="4" width="300" height="20" />
      {/* Artist name */}
      <Rect x="100" y="160" rx="4" ry="4" width="200" height="16" />
      {/* Album name */}
      <Rect x="130" y="186" rx="4" ry="4" width="140" height="14" />
    </ContentLoader>
  );
}
