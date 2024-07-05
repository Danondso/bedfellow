import React from 'react';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import styles from './SampleCard.styles';
import { BedfellowSample } from '../../../../types/bedfellow-api';

type SampleCardProps = {
  item: BedfellowSample;
  onPress: () => void;
};
function SampleCard({ item, onPress }: SampleCardProps) {
  const { track, artist, image } = item;

  if (!artist) {
    return null;
  }

  return (
    <View style={styles.trackListWrapper}>
      <Card mode="elevated" style={styles.trackItem} onPress={onPress}>
        <Card.Cover style={styles.trackImage} source={{ uri: image }} />
        <Card.Title style={styles.trackListTitle} title={track} />
        <Card.Content>
          <Paragraph>{artist}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

export default SampleCard;
