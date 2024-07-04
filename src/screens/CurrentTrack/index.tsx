import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { DetailsScreenProps } from '../../types';
import styles from './Details.styles';
import { CurrentPlaybackResponse, TrackObjectFull } from '../../types/spotify-api';
import TrackList from './TrackList';
import useSpotifyAPI from '../../hooks/spotify/useSpotifyAPI';

function formatArtistNames(item: TrackObjectFull): string {
  if (!item) {
    return 'No Artist Name Available';
  }
  if ('artists' in item) {
    return item.artists.map((artist) => artist.name).join(',');
  }
  return 'No';
}
type CurrentSongProps = {
  item: TrackObjectFull;
};

function CurrentSong({ item }: CurrentSongProps) {
  return (
    <View style={styles.view}>
      <View style={styles.currentSongView}>
        {item && 'album' in item ? (
          <Avatar.Image size={90} source={item?.album.images[0]} />
        ) : (
          // @ts-ignore artists is inside of album don't believe their lies
          <Avatar.Text size={90} label={item?.album.artists[0].name[0]} />
        )}
        <Text style={styles.trackName}>{item ? item.name : 'No Track Info Available'}</Text>
        <Text style={styles.artistName}>{item ? formatArtistNames(item) : 'No Artist Info Available'}</Text>
        <Text style={styles.albumDescription}>{item ? item.album.name : 'No Album Info Available'}</Text>
      </View>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CurrentTrackScreen({ navigation }: DetailsScreenProps) {
  const { response, loadData } = useSpotifyAPI('v1/me/player/currently-playing');

  const currentPlaybackResponse = response as CurrentPlaybackResponse;
  const currentlyPlayingTrack = currentPlaybackResponse?.item as TrackObjectFull;
  return (
    <View style={styles.view}>
      <TrackList
        onRefresh={() => {
          loadData();
        }}
        HeaderComponent={<CurrentSong item={currentlyPlayingTrack} />}
        trackInfo={currentlyPlayingTrack}
      />
    </View>
  );
}

export default CurrentTrackScreen;
