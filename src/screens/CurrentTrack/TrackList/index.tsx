import React, { ReactElement, useContext, useState } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { Snackbar } from 'react-native-paper';
import defaultPalette from '../../../theme/styles/index';
import { ImagePaletteContext, ImagePaletteContextData } from '../../../context/ImagePaletteContext';
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
  const { imagePalette } = useContext<ImagePaletteContextData>(ImagePaletteContext);
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
        ListEmptyComponent={showSkeleton ?? isLoading ? <WhoSampledSkeleton /> : <EmptyListMessage />}
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
          backgroundColor: error ? defaultPalette.error : imagePalette.background,
        }}
      >
        <Text
          style={{
            color: error ? defaultPalette.primaryBackground : imagePalette.primary,
          }}
        >
          {snackbarText}
        </Text>
      </Snackbar>
    </>
  );
}

export default SampleList;
