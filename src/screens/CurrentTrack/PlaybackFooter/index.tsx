import React, { useContext } from 'react';
// Types from @types/spotify-api are available globally via SpotifyApi namespace
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useSpotifyAPI from '../../../hooks/spotify/useSpotifyAPI';
import { useTheme } from '../../../context/ThemeContext';
import { performPlaybackAction } from '../../../services/spotify/SpotifyAPI.service';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../../context/SpotifyAuthContext';
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
  buttonName: string;
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

interface PlaybackFooterProps {
  refreshCurrentlyPlayingTrack: () => void;
}

function PlaybackFooter({ refreshCurrentlyPlayingTrack }: PlaybackFooterProps) {
  const { spotifyAuth } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { response, loadData } = useSpotifyAPI('v1/me/player');
  const playButtonIconName = (response as SpotifyApi.CurrentPlaybackResponse)?.is_playing ? 'pause' : 'play';

  return (
    <View style={styles.container}>
      <PlayerButton
        buttonName="backward"
        onPress={async () => {
          await performPlaybackAction('backward', spotifyAuth);
          await refreshCurrentlyPlayingTrack();
          await loadData();
        }}
      />
      <PlayerButton
        buttonName={playButtonIconName}
        onPress={async () => {
          await performPlaybackAction(playButtonIconName, spotifyAuth);
          await loadData();
        }}
      />
      <PlayerButton
        buttonName="forward"
        onPress={async () => {
          await performPlaybackAction('forward', spotifyAuth);
          await refreshCurrentlyPlayingTrack();
          await loadData();
        }}
      />
    </View>
  );
}

export default PlaybackFooter;
