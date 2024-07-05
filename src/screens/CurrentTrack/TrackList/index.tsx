import React, { ReactElement, useContext, useState } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { BedfellowTrackSamples } from '../../../types/bedfellow-api';
import styles from './SampleList.styles';
import { findAndQueueTrack } from '../../../services/spotify/SpotifyAPI.service';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../../context/SpotifyAuthContext';
import SampleCard from './SampleCard';
import WhoSampledSkeleton from './Skeleton';
import { BedfellowTypes } from '../../../types';

function EmptyListMessage() {
  return (
    <View style={styles.noSamplesWrapper}>
      <Text style={styles.noSamples}>No data.</Text>
    </View>
  );
}

type SampleListProps = {
  trackSamples: BedfellowTrackSamples | null;
  isLoading: boolean;
  HeaderComponent: ReactElement;
  onRefresh: () => void;
};

function SampleList({ isLoading, trackSamples, HeaderComponent, onRefresh }: SampleListProps) {
  const { spotifyAuth } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [error, setError] = useState<boolean>(false);

  const onPressHandler = async (item: BedfellowTypes.BedfellowSample) => {
    try {
      const result = await findAndQueueTrack(item, spotifyAuth);
      setSnackbarText(result);
      setShowSnackbar(true);
    } catch (err) {
      setError(true);
      setSnackbarText(err as string);
    }
  };

  return (
    <>
      <FlatList
        refreshControl={<RefreshControl onRefresh={() => onRefresh()} refreshing={isLoading} />}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={isLoading ? <WhoSampledSkeleton /> : <EmptyListMessage />}
        data={trackSamples?.samples || []}
        renderItem={({ item }) => (
          <SampleCard
            item={item}
            onPress={() => {
              onPressHandler(item);
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
