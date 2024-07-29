import React, { useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AxiosResponse } from 'axios';
import { ImagePaletteContext, ImagePaletteContextData } from '../../../context/ImagePaletteContext';
import { UserDevicesResponse } from '../../../types/spotify-api';
import styles from './PlaybackFooter.styles';
import { spotifyPOSTData, spotifyGETData, spotifyPUTData } from '../../../services/spotify/SpotifyAPI.service';
import { AuthResult, SpotifyAuthContext, SpotifyAuthContextData } from '../../../context/SpotifyAuthContext';

interface PlayerButtonProps {
  buttonName: string;
  onPress: () => void;
}

const PLAYER_URL_FRAGMENT = 'v1/me/player';

const performPlaybackAction = async (buttonName: string, spotifyAuth: AuthResult) => {
  let deviceID;
  try {
    const deviceResponse: AxiosResponse<UserDevicesResponse> = await spotifyGETData(
      `${PLAYER_URL_FRAGMENT}/devices`,
      spotifyAuth
    );
    console.log(deviceResponse.data);
    const { id } = deviceResponse.data.devices?.[0] || '';
    if (!id) {
      return;
    }
    deviceID = id;
  } catch (error) {
    console.log('THIS ERROR', error);
  }

  switch (buttonName) {
    case 'forward':
      await spotifyPOSTData(`${PLAYER_URL_FRAGMENT}/next?device_id=${deviceID}`, spotifyAuth);
      break;
    case 'backward':
      await spotifyPOSTData(`${PLAYER_URL_FRAGMENT}/previous?device_id=${deviceID}`, spotifyAuth);
      break;
    case 'pause':
      await spotifyPUTData(`${PLAYER_URL_FRAGMENT}/pause?device_id=${deviceID}`, spotifyAuth);
      break;
    case 'play':
      await spotifyPUTData(`${PLAYER_URL_FRAGMENT}/play?device_id=${deviceID}`, spotifyAuth);
      break;
    default:
      break;
  }
};

function PlayerButton({ buttonName, onPress }: PlayerButtonProps) {
  const { imagePalette } = useContext<ImagePaletteContextData>(ImagePaletteContext);
  const buttonThemeStyle: ViewStyle = {
    backgroundColor: imagePalette.background,
    borderColor: imagePalette.secondary,
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
  isCurrentlyPlaying: boolean;
}

function PlaybackFooter({ refreshCurrentlyPlayingTrack, isCurrentlyPlaying }: PlaybackFooterProps) {
  const { spotifyAuth } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const playButtonIconName = isCurrentlyPlaying ? 'pause' : 'play';
  return (
    <View style={styles.view}>
      <PlayerButton
        buttonName="backward"
        onPress={async () => {
          await performPlaybackAction('backward', spotifyAuth);
          await refreshCurrentlyPlayingTrack();
        }}
      />
      <PlayerButton
        buttonName={playButtonIconName}
        onPress={() => {
          performPlaybackAction(playButtonIconName, spotifyAuth);
        }}
      />
      <PlayerButton
        buttonName="forward"
        onPress={async () => {
          await performPlaybackAction('forward', spotifyAuth);
          await refreshCurrentlyPlayingTrack();
        }}
      />
    </View>
  );
}

export default PlaybackFooter;
