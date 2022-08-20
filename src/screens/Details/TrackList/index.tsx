import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { WhoSampledResponse, WhoSampledData } from '../../../types';
import { TrackObjectFull } from '../../../types/spotify-api';
import styles from './Tracklist.styles';

const normalizeString = (string: String) => string.replace(/\s/g, '-');

function TrackItem({ item }: { item: WhoSampledData }) {
  const { track_name, artist, images } = item;
  return (
    <Card style={styles.trackItem}>
      <Card.Cover
        style={styles.trackImage}
        // TODO fix this so we get a straight url with sizes in the API response
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
  useEffect(() => {
    if (!trackInfo) {
      return;
    }
    const formattedArtistName = normalizeString(trackInfo.artists[0].name);
    const formattedSongName = normalizeString(trackInfo.name);
    console.log(formattedArtistName, formattedSongName);
    axios
      .get(
        `https://bedfellow-api.tunnelto.dev/sample-info/${formattedArtistName}/${formattedSongName}`,
      )
      .then(result => {
        console.log(result.data);
        setSampleData(result.data as WhoSampledResponse);
      })
      .catch(error => console.log(error));
  }, [trackInfo]);
  return (
    <View style={styles.view}>
      <FlatList data={sampleData?.samples} renderItem={TrackItem} />
    </View>
  );
}

export default TrackList;
