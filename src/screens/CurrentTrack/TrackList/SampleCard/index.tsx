import React, { useContext } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';
import { ImagePaletteContext, ImagePaletteContextData } from '../../../../context/ImagePaletteContext';
import styles from './SampleCard.styles';
import { BedfellowSample } from '../../../../types/bedfellow-api';
import defaultPalette from '../../../../theme';

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
    backgroundColor: imagePalette?.background || defaultPalette.secondaryBackground,
  };

  const trackFontColor: TextStyle = {
    color: imagePalette?.secondary || defaultPalette.primaryText,
  };

  return (
    <View style={styles.trackListWrapper}>
      <Card mode="elevated" style={[styles.trackItem, trackItemBackground]} onPress={onPress}>
        <Card.Cover style={styles.trackImage} source={{ uri: image }} />
        <Card.Title titleStyle={trackFontColor} style={styles.trackListTitle} title={track} />
        <Card.Content>
          <Text style={trackFontColor}>{artist}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

export default SampleCard;
