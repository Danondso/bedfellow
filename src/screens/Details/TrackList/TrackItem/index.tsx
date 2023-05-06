import React from 'react';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import styles from './TrackItem.styles';
import { WhoSampledData } from '../../../../types';

// TODO make the signature for onPress more explicit (rename it)
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

export default TrackItem;
