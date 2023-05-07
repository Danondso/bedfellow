import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { TrackObjectFull } from '../../../types/spotify-api';
import styles from './Tracklist.styles';
import useWhoSampledAPI from '../../../hooks/whoSampled/useWhoSampledAPI';
import { findAndQueueTrack } from '../../../service/spotify/SpotifyAPI.service';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
} from '../../../context/SpotifyAuthContext';
import TrackItem from './TrackItem';
import WhoSampledSkeleton from './Skeleton';

const INVALID_TRACK_INDEX = -1;

function EmptyListMessage() {
  return (
    <View style={styles.noSamplesWrapper}>
      <Text style={styles.noSamples}>No data.</Text>
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
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (
      selectedTrackIndex > INVALID_TRACK_INDEX &&
      sampleData?.samples[selectedTrackIndex]
    ) {
      findAndQueueTrack(sampleData.samples[selectedTrackIndex], spotifyAuth)
        .then(result => setSnackbarText(result))
        .catch(err => {
          setError(true);
          setSnackbarText(err);
        })
        .finally(() => setShowSnackbar(true));
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
          setError(false);
          setSnackbarText('');
          setSelectedTrackIndex(-1);
        }}
        style={error ? styles.snackBarFail : styles.snackBarSuccess}
      >
        <Text>{snackbarText}</Text>
      </Snackbar>
    </>
  );
}

export default TrackList;
