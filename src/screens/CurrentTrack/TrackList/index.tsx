import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { TrackObjectFull } from '../../../types/spotify-api';
import styles from './SampleList.styles';
import useBedfellowAPI from '../../../hooks/bedfellow/useBedfellowAPI';
import { findAndQueueTrack } from '../../../services/spotify/SpotifyAPI.service';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
} from '../../../context/SpotifyAuthContext';
import SampleCard from './SampleCard';
import WhoSampledSkeleton from './Skeleton';
import { BedfellowTypes } from '../../../types';
import { searchAndRetrieveParsedWhoSampledPage } from '../../../services/whosampled/WhoSampled.service';
import { postToBedfellowDBAPI } from '../../../services/bedfellow-db-api/BedfellowDBAPI.service';

function EmptyListMessage() {
  return (
    <View style={styles.noSamplesWrapper}>
      <Text style={styles.noSamples}>No data.</Text>
    </View>
  );
}

type SampleListProps = {
  trackInfo: TrackObjectFull;
  HeaderComponent: ReactElement;
  onRefresh: () => void;
};

function SampleList({
  trackInfo,
  HeaderComponent,
  onRefresh,
}: SampleListProps) {
  const { spotifyAuth } =
    useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { sampleData = [], loading = false } = useBedfellowAPI(trackInfo);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const parseResult = await searchAndRetrieveParsedWhoSampledPage(
        trackInfo
      );
      if (parseResult?.samples) {
        const result = await postToBedfellowDBAPI({
          artist_name: parseResult.artist,
          track_name: parseResult.track,
          samples: parseResult.samples,
        });
        // TODO we need to refresh this or call the service right after
        // TODO handle showing an error toast
        if (result) {
          setSnackbarText('Samples posted to bedfellow.db');
          setShowSnackbar(true);
        }
      }
    };
    // TODO we can do better than this check here
    if (sampleData.length === 0 && loading === false) {
      fetchData();
    }
  }, [loading, trackInfo, sampleData]);

  const onPressHandler = async (item: BedfellowTypes.BedfellowSample) => {
    try {
      // @ts-ignore
      const result = await findAndQueueTrack(item, spotifyAuth);
      setSnackbarText('OK');
    } catch (err) {
      setError(true);
      console.log(err);
      setSnackbarText('OOF');
    }
  };

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
        // @ts-ignore
        data={sampleData.samples}
        renderItem={({ item, index }) => (
          <SampleCard
            item={item}
            index={index}
            onPress={() => {
              onPressHandler(item);
              setShowSnackbar(true);
            }}
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
        }}
        style={error ? styles.snackBarFail : styles.snackBarSuccess}
      >
        <Text>{snackbarText}</Text>
      </Snackbar>
    </>
  );
}

export default SampleList;
