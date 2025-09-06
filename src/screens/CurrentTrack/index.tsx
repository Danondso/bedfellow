import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useDynamicTheme } from '../../context/ThemeContext/dynamicTheme';
import ThemedView from '../../components/themed/ThemedView';
import { ThemeTransition } from '../../context/ThemeContext/ThemeTransition';
import FloatingActionButton from '../../components/navigation/FloatingActionButton';
import { searchAndRetrieveParsedWhoSampledPage } from '../../services/whosampled/WhoSampled.service';
import { DetailsScreenProps } from '../../types';
import { createStyles } from './CurrentTrack.themed.styles';
import SampleList from './TrackList';
import CurrentSongHeader from './CurrentSongHeader';
import FloatingPlayer from '../../components/player/FloatingPlayer';
import useSpotify from 'src/hooks/spotify/useSpotify';
import useBedfellow from 'src/hooks/bedfellow/useBedfellow';

function CurrentTrackScreen({ navigation }: DetailsScreenProps) {
  const {
    playback: { playing },
  } = useSpotify();
  const { samples, getSamplesWithFallback } = useBedfellow();
  const { track, loading, refresh } = playing;
  const { artists, name, album } = (track?.item as SpotifyApi.TrackObjectFull) ?? {};
  const hasTrack = track?.item; //truthy
  const [showSkeleton, setShowSkeleton] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  // Use the new dynamic theme system
  useDynamicTheme(album?.images?.[0].url || '');

  useEffect(() => {
    const loadSamples = async () => {
      if (!hasTrack || !artists?.length || !name) {
        setShowSkeleton(false);
        return;
      }

      setShowSkeleton(true);

      try {
        // Try each artist until we find samples
        for (const artist of artists) {
          const samplesData = await getSamplesWithFallback(artist.name, name, async () => {
            // Only scrape on the first artist attempt
            if (artist === artists[0]) {
              return await searchAndRetrieveParsedWhoSampledPage(artists, name);
            }
            return null;
          });

          if (samplesData) {
            break; // Found samples, stop searching
          }
        }
      } catch (error) {
        console.error('Error loading samples:', error);
      } finally {
        setShowSkeleton(false);
      }
    };

    loadSamples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artists, name]);

  return (
    <ThemeTransition type="fade" duration={300}>
      <ThemedView style={styles.view}>
        {/* Settings Button with softer styling */}
        <FloatingActionButton
          icon="settings-outline"
          onPress={() => navigation.navigate('Settings' as any)}
          position="top-right"
          style={{
            marginTop: theme.spacing.md,
          }}
          size="medium"
          animated
        />

        <SampleList
          onRefresh={refresh}
          isLoading={loading || samples.loading}
          showSkeleton={showSkeleton}
          HeaderComponent={<CurrentSongHeader item={track?.item ?? null} isLoading={showSkeleton} />}
          trackSamples={samples.samples}
        />
        <FloatingPlayer />
      </ThemedView>
    </ThemeTransition>
  );
}

export default CurrentTrackScreen;
