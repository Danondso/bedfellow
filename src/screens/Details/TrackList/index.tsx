import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Card, Paragraph, Snackbar } from 'react-native-paper';
import { WhoSampledData } from '../../../types';
import { TrackObjectFull } from '../../../types/spotify-api';
import styles from './Tracklist.styles';
import theme from '../../../theme';
import useWhoSampledAPI from '../../../hooks/whoSampled/useWhoSampledAPI';
import { findAndQueueTrack } from '../../../service/spotify/SpotifyAPI.service';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
} from '../../../context/SpotifyAuthContext';

const INVALID_TRACK_INDEX = -1;

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
  const [selectedTrackIndex, setSelectedTrackIndex] =
    useState<number>(INVALID_TRACK_INDEX);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  useEffect(() => {
    if (
      selectedTrackIndex > INVALID_TRACK_INDEX &&
      sampleData?.samples[selectedTrackIndex]
    ) {
      findAndQueueTrack(sampleData.samples[selectedTrackIndex], spotifyAuth)
        .then(result => setSnackbarText(result))
        .catch(err => setSnackbarText(err));
      setShowSnackbar(true);
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
        duration={1500}
        visible={showSnackbar}
        onDismiss={() => {
          setShowSnackbar(false);
          setSnackbarText('');
          setSelectedTrackIndex(-1);
        }}
        style={styles.snackBar}
      >
        <Text>{snackbarText}</Text>
      </Snackbar>
    </>
  );
}

export default TrackList;
