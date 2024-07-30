import React, { useContext, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AxiosResponse } from 'axios';
import useSpotifyAPI from '../../../hooks/spotify/useSpotifyAPI';
import { ImagePaletteContext, ImagePaletteContextData } from '../../../context/ImagePaletteContext';
import { CurrentPlaybackResponse, UserDevicesResponse } from '../../../types/spotify-api';
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
    const { id } = deviceResponse.data.devices?.[0] || '';
    if (!id) {
      return;
    }
    deviceID = id;
  } catch (error) {
    console.log('THIS ERROR', error);
  }
  try {
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
  } catch (err) {
    console.log(err);
  }
};

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

// TODO, can we just get playback state after performing the action (play/pause/forward/backward) then control the state
// based on that call in here? OHHH use the useSpotifyAPI hook

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
