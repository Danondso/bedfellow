import React, { useState } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '../../../../context/ThemeContext';
import ThemedText from '../../../../components/themed/ThemedText';
import { BedfellowSample } from '../../../../types/bedfellow-api';

type SampleCardProps = {
  item: BedfellowSample;
  onPress: () => void;
};

function SampleCard({ item, onPress }: SampleCardProps) {
  const { theme } = useTheme();
  const { track, artist, image } = item;
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(1);

  if (!artist) {
    return null;
  }

  // Create dynamic styles based on theme
  const styles = StyleSheet.create({
    trackListWrapper: {
      width: '75%', // Narrower for more side breathing room
      marginVertical: theme.spacing.lg, // More generous vertical spacing between cards
      alignSelf: 'center',
    },
    trackItem: {
      borderRadius: theme.borderRadius['3xl'], // Extra rounded for warm aesthetic
      overflow: 'hidden',
      backgroundColor: isPressed
        ? theme.colors.surface[100] // Keep same background when pressed
        : theme.colors.surface[100], // Use warm sand surface color
      borderWidth: 1.5,
      borderColor: isPressed
        ? theme.colors.border[200] // Very subtle border change - just slightly darker
        : theme.colors.border[100], // Interactive border
      // Very soft shadow system
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
      shadowOffset: {
        width: 0,
        height: isPressed ? 4 : 5, // Minimal shadow change
      },
      shadowOpacity: isPressed ? 0.18 : 0.22, // Even softer shadow change
      shadowRadius: isPressed ? 9 : 10, // Almost imperceptible radius change
      elevation: isPressed ? 6 : 7, // Android shadow - minimal difference
      transform: [{ scale: isPressed ? 0.995 : 1 }], // Match the animated scale
    },
    trackImage: {
      width: '100%',
      alignSelf: 'center',
      borderTopLeftRadius: theme.borderRadius['3xl'],
      borderTopRightRadius: theme.borderRadius['3xl'],
      backgroundColor: theme.colors.surface[200], // Warm fallback color while loading
    },
    trackText: {
      marginBottom: theme.spacing.sm,
      color: theme.colors.text[900], // Primary text color
      lineHeight: theme.typography.lg * 1.4, // More generous line height
    },
    artistText: {
      color: theme.colors.text[600], // Muted text color
      marginTop: theme.spacing.xs, // Small gap between track and artist
      lineHeight: theme.typography.base * 1.5,
    },
    cardContent: {
      paddingTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.surface[50], // Slightly lighter background for content
      borderTopWidth: 1,
      borderTopColor: theme.colors.border[50], // Very subtle divider
    },
  });

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0.995, // Even more subtle scale down
        duration: 200, // Slower, smoother transition
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.92, // Slightly more opacity reduction for visual feedback
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 250, // Even slower release for smoothness
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.trackListWrapper}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        <Animated.View
          style={[
            styles.trackItem,
            {
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
            },
          ]}
        >
          <Card mode="elevated" style={{ borderRadius: theme.borderRadius['3xl'], overflow: 'hidden' }}>
            <Card.Cover style={styles.trackImage} source={{ uri: image }} />
            <Card.Content style={styles.cardContent}>
              <ThemedText variant="h5" style={styles.trackText}>
                {track}
              </ThemedText>
              <ThemedText variant="body" style={styles.artistText}>
                {artist}
              </ThemedText>
            </Card.Content>
          </Card>
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default SampleCard;
