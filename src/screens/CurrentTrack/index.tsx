import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useDynamicTheme } from '../../context/ThemeContext/dynamicTheme';
import ThemedView from '../../components/themed/ThemedView';
import { ThemeTransition } from '../../context/ThemeContext/ThemeTransition';
import FloatingActionButton from '../../components/navigation/FloatingActionButton';
import { searchAndRetrieveParsedWhoSampledPage } from '../../services/whosampled/WhoSampled.service';
import { getBedfellowDBData, postToBedfellowDB } from '../../services/bedfellow-db-api/BedfellowDBAPI.service';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { DetailsScreenProps } from '../../types';
import { createStyles } from './CurrentTrack.themed.styles';
import SampleList from './TrackList';
import CurrentSongHeader from './CurrentSongHeader';
import FloatingPlayer from '../../components/player/FloatingPlayer';
import useSpotify from 'src/hooks/spotify/useSpotify';

const parseAndPostWhoSampledData = async (artists: SpotifyApi.ArtistObjectSimplified[], name: string) => {
  try {
    const parseResult = await searchAndRetrieveParsedWhoSampledPage(artists, name);
    if (!parseResult) {
      return false;
    }
    const result = await postToBedfellowDB(parseResult);
    return result;
  } catch (err) {
    return false;
  }
};
const loadBedfellowData = async (artists: SpotifyApi.ArtistObjectSimplified[] = [], track: string = '') => {
  try {
    if ((artists[0].name, track)) {
      const trackSamplesResults = await Promise.all(
        await artists.map(async (artist) => {
          const result: BedfellowTrackSamples | null = await getBedfellowDBData(artist?.name, track);
          return result;
        })
      );
      // This could lead to a situation where we make a bunch of calls then only use the first result
      // let's try to make this smarter later
      const filteredTrackSampleResults = trackSamplesResults.filter((trackSample) => trackSample);
      if (filteredTrackSampleResults.length) {
        return filteredTrackSampleResults[0];
      }
    }
    const result = await parseAndPostWhoSampledData(artists, track);
    if (result) {
      return await getBedfellowDBData(artists[0].name, track);
    }
  } catch (error) {
    return null;
  }
};

function CurrentTrackScreen({ navigation }: DetailsScreenProps) {
  const {
    playback: { playing },
  } = useSpotify();
  const { track, loading, refresh } = playing;
  // @ts-ignore the type is goofy
  const { artists, name, album } = track?.item ?? {};
  const hasTrack = track?.item; //truthy
  const [samples, setSamples] = useState<BedfellowTrackSamples | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  // Use the new dynamic theme system
  useDynamicTheme(album?.images?.[0].url || '');

  useEffect(() => {
    setShowSkeleton(true);

    // Set a timeout to hide skeleton after 3 seconds
    const skeletonTimeout = setTimeout(() => {
      setShowSkeleton(false);
    }, 3000);

    if (hasTrack) {
      loadBedfellowData(artists, name).then((result) => {
        if (result) {
          setSamples(result);
        }
        setShowSkeleton(false);
      });
    } else {
      setSamples(null);
      setShowSkeleton(false);
    }

    // Clean up timeout
    return () => clearTimeout(skeletonTimeout);
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
          isLoading={loading}
          showSkeleton={showSkeleton}
          HeaderComponent={<CurrentSongHeader item={track?.item ?? null} isLoading={showSkeleton} />}
          trackSamples={samples}
        />
        <FloatingPlayer />
      </ThemedView>
    </ThemeTransition>
  );
}

export default CurrentTrackScreen;
