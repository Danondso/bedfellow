import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '../../../../context/ThemeContext';
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

  // Create dynamic styles based on theme
  const styles = StyleSheet.create({
    trackListWrapper: {
      width: '90%',
      marginVertical: theme.spacing.sm,
    },
    trackItem: {
      borderRadius: theme.borderRadius['2xl'], // Softer rounded corners for warm aesthetic
      overflow: 'hidden',
      backgroundColor: theme.colors.surface[100], // Use warm sand surface color
    },
    trackImage: {
      width: '100%',
      height: 200,
    },
    trackText: {
      fontSize: theme.typography.lg,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
      color: theme.colors.text[800], // Darker text for better readability on sand
    },
    artistText: {
      fontSize: theme.typography.base,
      color: theme.colors.text[600], // Muted text color
    },
    cardContent: {
      paddingTop: 0,
    },
  });

  return (
    <View style={styles.trackListWrapper}>
      <Card mode="elevated" style={styles.trackItem} onPress={onPress}>
        <Card.Cover style={styles.trackImage} source={{ uri: image }} />
        <Card.Title titleStyle={styles.trackText} title={track} />
        <Card.Content style={styles.cardContent}>
          <Text style={styles.artistText}>{artist}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

export default SampleCard;
