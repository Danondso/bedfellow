import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../context/ThemeContext';
import useSpotify from 'src/hooks/spotify/useSpotify';

interface FloatingPlayerProps {
  refreshTrack: () => void;
}

const FloatingPlayer: React.FC<FloatingPlayerProps> = ({ refreshTrack: _refreshTrack }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { playback } = useSpotify();
  const { actions, playing } = playback;
  const [fadeAnim] = useState(new Animated.Value(0));

  const isPlaying = !actions.isPaused;
  const playButtonIconName = isPlaying ? 'pause' : 'play';

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    Animated.timing(fadeAnim, {
      toValue: newExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await actions.pause();
    } else {
      await actions.play();
    }
    await playing.refresh();
  };

  const handlePrevious = async () => {
    await actions.backward();
    await playing.refresh();
  };

  const handleNext = async () => {
    await actions.forward();

    await playing.refresh();
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: theme.spacing.xl,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 1000,
    },
    mainButton: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.2)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    expandedContainer: {
      position: 'absolute',
      bottom: 70,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface[100],
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 6,
    },
    controlButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface[50],
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border[100],
    },
    playPauseButton: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      {expanded && (
        <Animated.View style={[styles.expandedContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
            <Icon name="play-skip-back" size={18} color={theme.colors.primary[600]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
            <Icon name={playButtonIconName} size={20} color={theme.colors.text[50]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
            <Icon name="play-skip-forward" size={18} color={theme.colors.primary[600]} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.mainButton} onPress={toggleExpanded} activeOpacity={0.8}>
        <Icon name={expanded ? 'close' : 'musical-notes'} size={24} color={theme.colors.text[50]} />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingPlayer;
