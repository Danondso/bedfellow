import React from 'react';
// Types from @types/spotify-api are available globally via SpotifyApi namespace
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon, { type FontAwesomeIconName } from '@react-native-vector-icons/fontawesome';
import useSpotify from '../../../hooks/spotify/useSpotify';
import { useTheme } from '../../../context/ThemeContext';
import { spacingScale } from '../../../theme/scales';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: spacingScale.xl, // More generous horizontal padding
    paddingVertical: spacingScale.lg, // Add vertical padding for breathing room
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: spacingScale.md, // More space between buttons
    maxWidth: 80, // Limit button size for better proportions
  },
  button: {
    borderWidth: 1.5,
    borderRadius: spacingScale.lg + spacingScale.xs, // 28 = 24 + 4
    paddingVertical: spacingScale.xs, // Add some internal padding
  },
});

interface PlayerButtonProps {
  buttonName: FontAwesomeIconName;
  onPress: () => void;
}

function PlayerButton({ buttonName, onPress }: PlayerButtonProps) {
  const { theme } = useTheme();
  const buttonThemeStyle: ViewStyle = {
    backgroundColor: theme.colors.surface[100], // Warm sand surface for buttons
    borderColor: theme.colors.primary[500],
  };
  return (
    <View style={styles.buttonWrapper}>
      <Button style={[buttonThemeStyle, styles.button]} onPress={onPress}>
        <Icon name={buttonName} size={20} color={theme.colors.primary[500]} />
      </Button>
    </View>
  );
}

function PlaybackFooter() {
  const { playback } = useSpotify();
  const { actions, playing } = playback;
  const playButtonIconName: FontAwesomeIconName = actions.isPaused ? 'play' : 'pause';

  const handleBackward = async () => {
    await actions.backward();
    await playing.refresh();
  };

  const handlePlayPause = async () => {
    if (actions.isPaused) {
      await actions.play();
    } else {
      await actions.pause();
    }
    await playing.refresh();
  };

  const handleForward = async () => {
    await actions.forward();
    await playing.refresh();
  };

  return (
    <View style={styles.container}>
      <PlayerButton buttonName="backward" onPress={handleBackward} />
      <PlayerButton buttonName={playButtonIconName} onPress={handlePlayPause} />
      <PlayerButton buttonName="forward" onPress={handleForward} />
    </View>
  );
}

export default PlaybackFooter;
