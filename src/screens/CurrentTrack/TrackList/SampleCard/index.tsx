import React from 'react';
import { Platform, Text, TextStyle, View, ViewStyle, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '../../../../context/ThemeContext';
import { BedfellowSample } from '../../../../types/bedfellow-api';
import { spacingScale } from '../../../../theme/scales';

const styles = StyleSheet.create({
  trackListWrapper: {
    width: '90%',
    marginVertical: 8,
  },
  trackItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  trackImage: {
    width: '100%',
    height: 200,
  },
  trackDetails: {
    padding: spacingScale.sm + spacingScale.xs, // 12 = 8 + 4
  },
  trackText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistText: {
    fontSize: 14,
    opacity: 0.8,
  },
});

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
        <Card.Title titleStyle={[trackFontColor, styles.trackText]} title={track} />
        <Card.Content>
          <Text style={trackFontColor}>{artist}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

export default SampleCard;
