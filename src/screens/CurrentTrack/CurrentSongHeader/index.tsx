import React from 'react';
// Types from @types/spotify-api are available globally via SpotifyApi namespace
import { View, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import { createStyles } from './CurrentSongHeader.themed.styles';
import { useTheme } from '../../../context/ThemeContext';
import ThemedView from '../../../components/themed/ThemedView';
import ThemedText from '../../../components/themed/ThemedText';
import CurrentSongHeaderSkeleton from './Skeleton';

type CurrentSongHeaderProps = {
  item: SpotifyApi.TrackObjectFull;
  isLoading?: boolean;
};

function formatArtistNames(item: SpotifyApi.TrackObjectFull): string {
  if ('artists' in item) {
    return item.artists.map((artist) => artist.name).join(',');
  }
  return 'No Artist Name Available';
}

export default function CurrentSongHeader({ item, isLoading }: CurrentSongHeaderProps) {
  const { theme, dynamicPalette } = useTheme();
  const styles = createStyles(theme);

  // Only show skeleton when actually loading, not when there's no track
  if (isLoading) return <CurrentSongHeaderSkeleton />;

  // If not loading but no item, show nothing or a message
  if (!item) return null;

  return (
    <ThemedView style={styles.view}>
      <View
        style={[
          styles.currentSongView,
          dynamicPalette
            ? {
                backgroundColor: `${dynamicPalette.secondary}20`, // 20% opacity
                borderColor: dynamicPalette.primary,
              }
            : {},
        ]}
      >
        {item && 'album' in item ? (
          <View
            style={{
              borderRadius: theme.borderRadius.full,
              borderWidth: 3,
              borderColor: theme.colors.surface[200],
              padding: theme.spacing.xs / 2, // 2px = half of xs (4px)
              backgroundColor: theme.colors.surface[50],
              shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Avatar.Image
              size={120}
              source={Platform.OS === 'android' ? { uri: item?.album.images[0].url } : item?.album.images[0]}
              style={{ borderRadius: theme.borderRadius.full }}
            />
          </View>
        ) : (
          <View
            style={{
              borderRadius: theme.borderRadius.full,
              borderWidth: 3,
              borderColor: theme.colors.surface[200],
              padding: theme.spacing.xs / 2, // 2px = half of xs (4px)
              backgroundColor: theme.colors.surface[50],
            }}
          >
            <Avatar.Text
              size={90}
              label={item ? formatArtistNames(item).substring(0, 2) : 'NA'}
              style={{
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primary[100],
              }}
              labelStyle={{ color: theme.colors.primary[700] }}
            />
          </View>
        )}

        <ThemedText variant="h3" style={[styles.trackName, dynamicPalette ? { color: dynamicPalette.primary } : {}]}>
          {item ? item.name : 'Nothing playing currently.'}
        </ThemedText>

        <ThemedText variant="h5" style={[styles.artistName, dynamicPalette ? { color: dynamicPalette.secondary } : {}]}>
          {item ? formatArtistNames(item) : ''}
        </ThemedText>

        <ThemedText
          variant="caption"
          style={[styles.albumDescription, dynamicPalette ? { color: dynamicPalette.detail } : {}]}
        >
          {item ? item.album.name : ''}
        </ThemedText>
      </View>
    </ThemedView>
  );
}
