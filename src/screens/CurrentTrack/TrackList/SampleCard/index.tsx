import React, { useContext } from 'react';
import { Platform, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '../../../../context/ThemeContext';
import styles from './SampleCard.styles';
import { BedfellowSample } from '../../../../types/bedfellow-api';

type SampleCardProps = {
  item: BedfellowSample;
  onPress: () => void;
};
function SampleCard({ item, onPress }: SampleCardProps) {
  const { theme } = useTheme();

  const { track, artist, image } = item;

  if (!artist) {
    return null;
  }

  const trackItemBackground: ViewStyle = {
    backgroundColor: theme.colors.primary[600],
  };

  const trackFontColor: TextStyle = {
    color: Platform.OS === 'android' ? theme.colors.background[300] : theme.colors.background[100],
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
