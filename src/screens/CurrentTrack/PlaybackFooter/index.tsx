import React, { useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useSpotifyAPI from '../../../hooks/spotify/useSpotifyAPI';
import { ImagePaletteContext, ImagePaletteContextData } from '../../../context/ImagePaletteContext';
import { CurrentPlaybackResponse } from '../../../types/spotify-api';
import styles from './PlaybackFooter.styles';
import { performPlaybackAction } from '../../../services/spotify/SpotifyAPI.service';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../../context/SpotifyAuthContext';

interface PlayerButtonProps {
  buttonName: string;
  onPress: () => void;
}

function PlayerButton({ buttonName, onPress }: PlayerButtonProps) {
  const { imagePalette } = useContext<ImagePaletteContextData>(ImagePaletteContext);
  const buttonThemeStyle: ViewStyle = {
    backgroundColor: imagePalette.background,
    borderColor: imagePalette.detail,
  };
  return (
    <View style={styles.buttonWrapper}>
      <Button style={[buttonThemeStyle, styles.button]} onPress={onPress}>
        <Icon name={buttonName} size={20} color={imagePalette.detail} />
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
  const playButtonIconName = (response as CurrentPlaybackResponse)?.is_playing ? 'pause' : 'play';

  return (
    <View style={styles.view}>
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
