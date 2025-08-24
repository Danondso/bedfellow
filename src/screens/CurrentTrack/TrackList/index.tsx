import React, { ReactElement, useContext, useState } from 'react';
import { FlatList, View, Text, RefreshControl, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useTheme } from '../../../context/ThemeContext';
import { BedfellowTrackSamples } from '../../../types/bedfellow-api';

import { findAndQueueTrack } from '../../../services/spotify/SpotifyAPI.service';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../../context/SpotifyAuthContext';
import SampleCard from './SampleCard';
import WhoSampledSkeleton from './Skeleton';
import { BedfellowTypes } from '../../../types';

const styles = StyleSheet.create({
  noSamplesWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noSamples: {
    fontSize: 24,
    fontWeight: '300',
    opacity: 0.5,
  },
  snackBar: {
    bottom: 100,
  },
});

function EmptyListMessage() {
  return (
    <View style={styles.noSamplesWrapper}>
      <Text style={styles.noSamples}>Play Something.</Text>
    </View>
  );
}

type SampleListProps = {
  trackSamples: BedfellowTrackSamples | null;
  isLoading: boolean;
  showSkeleton?: boolean;
  HeaderComponent: ReactElement;
  onRefresh: () => void;
};

function SampleList({ isLoading, showSkeleton, trackSamples, HeaderComponent, onRefresh }: SampleListProps) {
  const { spotifyAuth } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { theme } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [error, setError] = useState<boolean>(false);

  const onPressHandler = async (item: BedfellowTypes.BedfellowSample) => {
    try {
      const result = await findAndQueueTrack(item, spotifyAuth);
      setSnackbarText(result);
      setError(false);
    } catch (err) {
      setError(true);
      setSnackbarText(err as string);
    }
    setShowSnackbar(true);
  };

  return (
    <>
      <FlatList
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isLoading} />}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={(showSkeleton ?? isLoading) ? <WhoSampledSkeleton /> : <EmptyListMessage />}
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
        duration={1000}
        visible={showSnackbar}
        onDismiss={() => {
          setShowSnackbar(false);
          setError(false);
          setSnackbarText('');
        }}
        wrapperStyle={styles.snackBar}
        style={{
          backgroundColor: error ? theme.colors.error[500] : theme.colors.surface[100], // Warm sand surface
        }}
      >
        <Text
          style={{
            color: error ? theme.colors.background[100] : theme.colors.text[900],
          }}
        >
          {snackbarText}
        </Text>
      </Snackbar>
    </>
  );
}

export default SampleList;
