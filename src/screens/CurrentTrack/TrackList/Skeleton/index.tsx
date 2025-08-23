import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View, StyleSheet } from 'react-native';
import { lightTheme } from '../../../../theme/themes';

const styles = StyleSheet.create({
  trackListWrapper: {
    alignItems: 'center',
    paddingHorizontal: lightTheme.spacing.md,
  },
  trackItem: {
    width: '100%',
    marginVertical: lightTheme.spacing.sm,
  },
  skeletonLoader: {
    width: '100%',
    height: 280,
  },
});

function ListSkeleton() {
  return (
    <View style={styles.trackListWrapper}>
      <View style={styles.trackItem} testID="tracklist_loading_skeleton">
        <ContentLoader
          speed={1}
          backgroundColor={lightTheme.colors.background[200]}
          foregroundColor={lightTheme.colors.background[100]}
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

export default ListSkeleton;
