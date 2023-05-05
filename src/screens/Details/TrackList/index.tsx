import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';

import ContentLoader, { Rect } from 'react-content-loader/native';
import { Card, Paragraph, Snackbar } from 'react-native-paper';
import { WhoSampledData } from '../../../types';
import { TrackObjectFull } from '../../../types/spotify-api';
import styles from './Tracklist.styles';
import theme from '../../../theme';
import useWhoSampledAPI from '../../../hooks/whoSampled/useWhoSampledAPI';
import {
  generateSpotifyTrackAndArtistQueryURL,
  spotifyGETData,
  spotifyPOSTData,
} from '../../../service/spotify/SpotifyAPI.service';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
} from '../../../context/SpotifyAuthContext';

const findMatchingTrack = (
  items: TrackObjectFull[],
  selectedTrack: WhoSampledData,
) =>
  items.find((result: any) => {
    return (
      result?.name === selectedTrack?.track_name &&
      selectedTrack?.artist === result?.artists[0].name
    );
  });

function WhoSampledSkeleton() {
  return (
    <View style={styles.trackListWrapper}>
      <View style={styles.trackItem} testID="tracklist_loading_skeleton">
        <ContentLoader
          speed={1}
          backgroundColor={theme.defaultPalette.primaryBackground}
          foregroundColor={theme.defaultPalette.primaryBackground100}
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

function EmptyListMessage() {
  return (
    <View style={styles.noSamplesWrapper}>
      <Text style={styles.noSamples}>No data.</Text>
    </View>
  );
}

type TrackItemProps = {
  item: WhoSampledData;
  index: number;
  onPress: (index: number) => void;
};

function TrackItem({ item, index, onPress }: TrackItemProps) {
  const { track_name, artist, images } = item;

  if (!artist) {
    // if the server didn't parse an artist name we can assume the track is not from a song
    return null;
  }

  return (
    <View style={styles.trackListWrapper}>
      <Card
        mode="elevated"
        style={styles.trackItem}
        onPress={() => onPress(index)}
      >
        <Card.Cover
          style={styles.trackImage}
          // TODO fix this so we get a straight url with sizes in the API response see issue #7
          source={{ uri: images[images.length - 1].split(' ')[0] }}
        />
        <Card.Title titleStyle={styles.trackName} title={track_name} />
        <Card.Content>
          <Paragraph style={styles.artistName}>{artist}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

type TrackListProps = {
  trackInfo: TrackObjectFull;
  HeaderComponent: ReactElement;
  onRefresh: () => void;
};

function TrackList({ trackInfo, HeaderComponent, onRefresh }: TrackListProps) {
  const { spotifyAuth } =
    useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { sampleData, loading } = useWhoSampledAPI(trackInfo);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(-1);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  useEffect(() => {
    async function findAndQueueTrack(selectedTrack: WhoSampledData) {
      const { track_name, artist } = selectedTrack;
      const url = generateSpotifyTrackAndArtistQueryURL(track_name, artist);

      try {
        const { data } = await spotifyGETData(url, spotifyAuth);
        const { items } = data.tracks;
        const matchingTrack = findMatchingTrack(items, selectedTrack);
        if (!matchingTrack) {
          setSnackbarText(`Unable to find ${track_name} in search results`);
          return;
        }

        const { uri } = matchingTrack;
        const { status } = await spotifyPOSTData(
          `v1/me/player/queue?uri=${uri}`,
          spotifyAuth,
        );
        const queueResultText =
          status === 204
            ? `Queued ${track_name} by ${artist}`
            : `Unable to queue track ${track_name}`;
        setSnackbarText(queueResultText);
      } catch (err) {
        setSnackbarText(JSON.stringify(err));
      }
      setShowSnackbar(true);
    }

    if (selectedTrackIndex > -1 && sampleData?.samples[selectedTrackIndex]) {
      findAndQueueTrack(sampleData.samples[selectedTrackIndex]);
    }
  }, [selectedTrackIndex, sampleData?.samples, spotifyAuth]);

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={loading} />
        }
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={
          loading ? <WhoSampledSkeleton /> : <EmptyListMessage />
        }
        data={sampleData?.samples}
        renderItem={({ item, index }) => (
          <TrackItem
            item={item}
            index={index}
            onPress={setSelectedTrackIndex}
          />
        )}
      />
      <Snackbar
        duration={1000}
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        style={styles.snackBar}
      >
        <Text>{snackbarText}</Text>
      </Snackbar>
    </>
  );
}

export default TrackList;
