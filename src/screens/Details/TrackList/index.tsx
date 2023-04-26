/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Card, Paragraph } from 'react-native-paper';
import { WhoSampledResponse, WhoSampledData } from '../../../types';
import { TrackObjectFull } from '../../../types/spotify-api';
import styles from './Tracklist.styles';
import theme from '../../../theme';

const normalizeString = (string: String) => string.replace(/\s/g, '-');

function WhoSampledSkeleton() {
  return (
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
  );
}

function TrackItem({ item }: { item: WhoSampledData }) {
  const { track_name, artist, images } = item;
  return (
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
  );
}

type TrackListProps = {
  trackInfo: TrackObjectFull;
};

function TrackList({ trackInfo }: TrackListProps) {
  const [sampleData, setSampleData] = useState<WhoSampledResponse | undefined>(
    undefined,
  );

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if (!trackInfo) {
      setLoading(false);
      return;
    }
    const formattedArtistName = normalizeString(trackInfo.artists[0].name);
    const formattedSongName = normalizeString(trackInfo.name);
    axios
      .get(
        `https://bedfellow-api.tunnelto.dev/sample-info/${formattedArtistName}/${formattedSongName}`,
      )
      .then(result => {
        setSampleData(result.data as WhoSampledResponse);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, [trackInfo]);

  return (
    <View style={styles.view}>
      {!loading && (
        <FlatList data={sampleData?.samples} renderItem={TrackItem} />
      )}
      {loading && <WhoSampledSkeleton />}
    </View>
  );
}

export default TrackList;
