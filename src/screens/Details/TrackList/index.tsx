/* eslint-disable import/no-extraneous-dependencies */
import React, { ReactElement } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Card, Paragraph } from 'react-native-paper';
import { WhoSampledData } from '../../../types';
import { TrackObjectFull } from '../../../types/spotify-api';
import styles from './Tracklist.styles';
import theme from '../../../theme';
import useWhoSampledAPI from '../../../hooks/whoSampled/useWhoSampledAPI';

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

function TrackItem({ item }: { item: WhoSampledData }) {
  const { track_name, artist, images } = item;
  return (
    <View style={styles.trackListWrapper}>
      <Card style={styles.trackItem}>
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
  const { sampleData, loading } = useWhoSampledAPI(trackInfo);
  return (
    <FlatList
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={loading} />
      }
      ListHeaderComponent={HeaderComponent}
      ListEmptyComponent={
        loading ? <WhoSampledSkeleton /> : <EmptyListMessage />
      }
      data={sampleData?.samples}
      renderItem={TrackItem}
    />
  );
}

export default TrackList;
