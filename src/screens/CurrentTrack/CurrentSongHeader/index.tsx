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
          <Avatar.Image
            size={90}
            source={Platform.OS === 'android' ? { uri: item?.album.images[0].url } : item?.album.images[0]}
          />
        ) : (
          // @ts-ignore artists is inside of album don't believe the typescript warning
          <Avatar.Text size={90} label={item?.artists[0].name} />
        )}

        <ThemedText style={[styles.trackName, dynamicPalette ? { color: dynamicPalette.primary } : {}]}>
          {item ? item.name : 'Nothing playing currently.'}
        </ThemedText>

        <ThemedText style={[styles.artistName, dynamicPalette ? { color: dynamicPalette.secondary } : {}]}>
          {item ? formatArtistNames(item) : ''}
        </ThemedText>

        <ThemedText style={[styles.albumDescription, dynamicPalette ? { color: dynamicPalette.detail } : {}]}>
          {item ? item.album.name : ''}
        </ThemedText>
      </View>
    </ThemedView>
  );
}
