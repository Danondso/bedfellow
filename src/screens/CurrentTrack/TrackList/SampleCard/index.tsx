import React from 'react';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import styles from './SampleCard.styles';
import { WhoSampledData } from '../../../../types';

type SampleCardProps = {
  item: WhoSampledData;
  index: number;
  onPress: (index: number) => void;
};

function SampleCard({ item, index, onPress }: SampleCardProps) {
  const { track_name, artist, image } = item;

  if (!artist) {
    return null;
  }

  return (
    <View style={styles.trackListWrapper}>
      <Card
        mode="elevated"
        style={styles.trackItem}
        onPress={() => onPress(index)}
      >
        <Card.Cover style={styles.trackImage} source={{ uri: image }} />
        <Card.Title title={track_name} />
        <Card.Content>
          <Paragraph>{artist}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

export default SampleCard;
