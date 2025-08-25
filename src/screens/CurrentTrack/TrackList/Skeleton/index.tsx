import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

function ListSkeleton() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    trackListWrapper: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    trackItem: {
      width: '85%', // Match SampleCard width
      marginVertical: theme.spacing.lg, // Match SampleCard spacing
      alignSelf: 'center',
      backgroundColor: theme.colors.surface[100],
      borderRadius: theme.borderRadius['3xl'],
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border[100],
      // Subtle shadow for skeleton
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.08)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    skeletonLoader: {
      width: '100%',
      height: theme.spacing.xxxl * 5 + theme.spacing.lg - theme.spacing.xs, // 340 = 64*5 + 24 - 4
    },
  });

  return (
    <View style={styles.trackListWrapper}>
      <View style={styles.trackItem} testID="tracklist_loading_skeleton">
        <ContentLoader
          speed={1.5}
          backgroundColor={theme.colors.surface[200]} // Warm sand background
          foregroundColor={theme.colors.surface[50]} // Lighter sand for animation
          style={styles.skeletonLoader}
        >
          {/* Image placeholder - extra rounded */}
          <Rect x="0" y="0" rx="24" ry="24" width="100%" height="240" />
          {/* Track title placeholder - serif style */}
          <Rect x="32" y="264" rx="12" ry="12" width="70%" height="24" />
          {/* Artist placeholder - smaller text */}
          <Rect x="32" y="298" rx="8" ry="8" width="45%" height="18" />
        </ContentLoader>
      </View>
    </View>
  );
}

export default ListSkeleton;
