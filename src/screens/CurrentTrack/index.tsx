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
import useSpotifyAPI from '../../hooks/spotify/useSpotifyAPI';
import CurrentSongHeader from './CurrentSongHeader';
import FloatingPlayer from '../../components/player/FloatingPlayer';

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
  const { response, loadData } = useSpotifyAPI('v1/me/player/currently-playing');
  const [samples, setSamples] = useState<BedfellowTrackSamples | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const currentPlaybackResponse = response as SpotifyApi.CurrentPlaybackResponse;
  const currentlyPlayingTrack = currentPlaybackResponse?.item as SpotifyApi.TrackObjectFull;
  const albumArtURL = currentlyPlayingTrack?.album?.images?.[0].url || '';

  // Use the new dynamic theme system
  useDynamicTheme(albumArtURL);

  const refreshControl = async () => {
    setIsLoading(true);
    setShowSkeleton(true);

    try {
      // Load the current playing track data
      await loadData();

      // If there's a currently playing track, load its samples
      if (currentlyPlayingTrack) {
        const { artists, name } = currentlyPlayingTrack;
        const result = await loadBedfellowData(artists, name);
        if (result) {
          setSamples(result);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      // Ensure loading states are cleared
      setIsLoading(false);

      // Hide skeleton after a short delay for better UX
      setTimeout(() => {
        setShowSkeleton(false);
      }, 500);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setShowSkeleton(true);

    // Set a timeout to hide skeleton after 3 seconds
    const skeletonTimeout = setTimeout(() => {
      setShowSkeleton(false);
    }, 3000);

    if (currentlyPlayingTrack) {
      const { artists, name } = currentlyPlayingTrack;
      loadBedfellowData(artists, name).then((result) => {
        if (result) {
          setSamples(result);
        }
        setIsLoading(false);
        setShowSkeleton(false);
      });
    } else {
      setSamples(null);
      setIsLoading(false);
      setShowSkeleton(false);
      loadData();
    }

    // Clean up timeout
    return () => clearTimeout(skeletonTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlayingTrack?.artists, currentlyPlayingTrack?.name]);

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
          onRefresh={refreshControl}
          isLoading={isLoading}
          showSkeleton={showSkeleton}
          HeaderComponent={<CurrentSongHeader item={currentlyPlayingTrack} isLoading={showSkeleton} />}
          trackSamples={samples}
        />
        <FloatingPlayer refreshCurrentlyPlayingTrack={loadData} />
      </ThemedView>
    </ThemeTransition>
  );
}

export default CurrentTrackScreen;
