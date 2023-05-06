import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';
import theme from '../../../../theme';
import styles from './Skeleton.styles';

function WhoSampledSkeleton() {
  return (
    <View style={styles.trackListWrapper}>
      <View style={styles.trackItem} testID="tracklist_loading_skeleton">
        <ContentLoader
          speed={1}
          backgroundColor={theme.defaultPalette.primaryBackground}
          foregroundColor={theme.defaultPalette.primaryBackground100}
          // @ts-ignore
          style={styles.skeletonLoader}
        >
          {/* sample pic */}
          <Rect x="0" y="0" rx="8" ry="8" width="100%" height="200" />
          {/* sample artist */}
          <Rect x="0" y="210" rx="8" ry="8" width="90%" height="30" />
          <Rect x="0" y="250" rx="8" ry="4" width="40%" height="20" />
        </ContentLoader>
      </View>
    </View>
  );
}

export default WhoSampledSkeleton;
