import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import { performPlaybackAction } from '../../services/spotify/SpotifyAPI.service';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../context/SpotifyAuthContext';
import useSpotifyAPI from '../../hooks/spotify/useSpotifyAPI';

interface FloatingPlayerProps {
  refreshCurrentlyPlayingTrack: () => void;
}

const FloatingPlayer: React.FC<FloatingPlayerProps> = ({ refreshCurrentlyPlayingTrack }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { spotifyAuth } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { response, loadData } = useSpotifyAPI('v1/me/player');
  const fadeAnim = new Animated.Value(0);

  const playButtonIconName = (response as SpotifyApi.CurrentPlaybackResponse)?.is_playing ? 'pause' : 'play';

  const toggleExpanded = () => {
    setExpanded(!expanded);
    Animated.timing(fadeAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPause = async () => {
    await performPlaybackAction(playButtonIconName, spotifyAuth);
    await loadData();
  };

  const handlePrevious = async () => {
    await performPlaybackAction('backward', spotifyAuth);
    await refreshCurrentlyPlayingTrack();
    await loadData();
  };

  const handleNext = async () => {
    await performPlaybackAction('forward', spotifyAuth);
    await refreshCurrentlyPlayingTrack();
    await loadData();
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: theme.spacing.xl,
      right: theme.spacing.lg,
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
      backgroundColor: theme.colors.surface[100],
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 6,
    },
    controlButton: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface[50],
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border[100],
    },
    playPauseButton: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {expanded && (
        <Animated.View style={[styles.expandedContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
            <Icon name="backward" size={16} color={theme.colors.primary[600]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
            <Icon name={playButtonIconName} size={18} color={theme.colors.text[50]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
            <Icon name="forward" size={16} color={theme.colors.primary[600]} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.mainButton} onPress={toggleExpanded} activeOpacity={0.8}>
        <Icon name={expanded ? 'times' : 'music'} size={24} color={theme.colors.text[50]} />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingPlayer;
