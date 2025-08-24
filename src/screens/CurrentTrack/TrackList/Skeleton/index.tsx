import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

function ListSkeleton() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    trackListWrapper: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    trackItem: {
      width: '100%',
      marginVertical: theme.spacing.sm,
    },
    skeletonLoader: {
      width: '100%',
      height: 280,
    },
  });

  return (
    <View style={styles.trackListWrapper}>
      <View style={styles.trackItem} testID="tracklist_loading_skeleton">
        <ContentLoader
          speed={1}
          backgroundColor={theme.colors.background[200]}
          foregroundColor={theme.colors.background[100]}
          style={styles.skeletonLoader}
        >
          {/* sample pic - more rounded for warm aesthetic */}
          <Rect x="0" y="0" rx="16" ry="16" width="100%" height="200" />
          {/* sample artist - pill-shaped for headers */}
          <Rect x="0" y="210" rx="15" ry="15" width="90%" height="30" />
          {/* sample info - softer rounded corners */}
          <Rect x="0" y="250" rx="10" ry="10" width="40%" height="20" />
        </ContentLoader>
      </View>
    </View>
  );
}

export default ListSkeleton;
