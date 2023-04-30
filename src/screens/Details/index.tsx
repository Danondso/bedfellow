import React, { useCallback, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { DetailsScreenProps } from '../../types';
import styles from './Details.styles';
import { TrackObjectFull } from '../../types/spotify-api';
import TrackList from './TrackList';
import useSpotifyAPI from '../../hooks/spotify/useSpotifyAPI';
import {
  SpotifyAuthContext,
  SpotifyAuthContextData,
} from '../../context/SpotifyAuthContext';

function formatArtistNames(item: TrackObjectFull): string {
  if (!item) {
    return 'No Artist Name Available';
  }
  if ('artists' in item) {
    return item.artists.map(artist => artist.name).join(',');
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
          <Avatar.Text size={90} label={item?.artists[0].name[0]} />
        )}
        <Text style={styles.trackName}>
          {item ? item.name : 'No Track Info Available'}
        </Text>
        <Text style={styles.artistName}>
          {item ? formatArtistNames(item) : 'No Artist Info Available'}
        </Text>
        <Text style={styles.albumDescription}>
          {item ? item.album.name : 'No Album Info Available'}
        </Text>
      </View>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DetailsScreen({ navigation }: DetailsScreenProps) {
  const spotifyAuthContextData = useContext<SpotifyAuthContextData | undefined>(
    SpotifyAuthContext,
  );

  const { spotifyAuth } = spotifyAuthContextData as SpotifyAuthContextData;

  // TODO add linter plugins to new line destruct
  const { currentSongInfo, loadData } = useSpotifyAPI(
    spotifyAuth,
    'v1/me/player/currently-playing',
  );

  const onRefresh: () => void = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // TODO the need for this is kinda dumb let's see if we can eliminate it

  const item = currentSongInfo?.item as TrackObjectFull;
  return (
    <View style={styles.view}>
      <TrackList
        onRefresh={onRefresh}
        HeaderComponent={<CurrentSong item={item} />}
        trackInfo={item}
      />
    </View>
  );
}

export default DetailsScreen;
