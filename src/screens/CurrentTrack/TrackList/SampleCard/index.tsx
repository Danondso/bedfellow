import React, { useContext } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';
import { ImagePaletteContext, ImagePaletteContextData } from '../../../../context/ImagePaletteContext';
import styles from './SampleCard.styles';
import { BedfellowSample } from '../../../../types/bedfellow-api';

type SampleCardProps = {
  item: BedfellowSample;
  onPress: () => void;
};
function SampleCard({ item, onPress }: SampleCardProps) {
  const { imagePalette } = useContext<ImagePaletteContextData>(ImagePaletteContext);

  const { track, artist, image } = item;

  if (!artist) {
    return null;
  }

  const trackItemBackground: ViewStyle = {
    backgroundColor: imagePalette.primary,
  };

  const trackFontColor: TextStyle = {
    color: imagePalette.background,
  };

  return (
    <View style={styles.trackListWrapper}>
      <Card mode="elevated" style={[styles.trackItem, trackItemBackground]} onPress={onPress}>
        <Card.Cover style={styles.trackImage} source={{ uri: image }} />
        <Card.Title titleStyle={[trackFontColor, styles.trackListText]} style={styles.trackListTitle} title={track} />
        <Card.Content>
          <Text style={trackFontColor}>{artist}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

export default SampleCard;
