import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserDevicesResponse } from '@types/spotify-api';
import { AxiosResponse } from 'axios';
import defaultPalette from '../../../theme/styles';
import styles from './PlaybackFooter.styles';
import { spotifyPOSTData, spotifyGETData, spotifyPUTData } from '../../../services/spotify/SpotifyAPI.service';
import { AuthResult, SpotifyAuthContext, SpotifyAuthContextData } from '../../../context/SpotifyAuthContext';

interface PlayerButtonProps {
  buttonName: string;
  onPress: () => void;
}

const PLAYER_URL_FRAGMENT = 'v1/me/player';

const performPlaybackAction = async (buttonName: string, spotifyAuth: AuthResult) => {
  // todo own function

  let deviceID;
  try {
    console.log(`${PLAYER_URL_FRAGMENT}/devices`, spotifyAuth);
    const deviceResponse: AxiosResponse<UserDevicesResponse> = await spotifyGETData(
      `${PLAYER_URL_FRAGMENT}/devices`,
      spotifyAuth
    );
    console.log(deviceResponse.data);
    const { id } = deviceResponse.data.devices?.[0] || '';
    console.log('THIS ID', id);
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
    case 'play':
      await spotifyPUTData(`${PLAYER_URL_FRAGMENT}/play?device_id=${deviceID}`, spotifyAuth);
      break;
    default:
      break;
  }
};

function PlayerButton({ buttonName, onPress }: PlayerButtonProps) {
  return (
    <View style={styles.buttonWrapper}>
      <Button style={styles.button} onPress={onPress}>
        <Icon name={buttonName} size={20} color={defaultPalette.primaryBackground100} />
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
  const [isPlaying, setIsPlaying] = useState<boolean>(isCurrentlyPlaying);
  const playButtonIconName = isPlaying ? 'pause' : 'play';
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
        buttonName="play"
        onPress={() => {
          performPlaybackAction(playButtonIconName, spotifyAuth);
          setIsPlaying(!isPlaying);
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
