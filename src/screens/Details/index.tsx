import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import { DetailsScreenProps } from '../../types';
import styles from './Details.styles';
import {
  CurrentPlaybackResponse,
  TrackObjectFull,
} from '../../types/spotify-api';
import TrackList from './TrackList';
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
// TODO once we have cards to click on we'll remove this.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DetailsScreen({ navigation }: DetailsScreenProps) {
  const spotifyAuthContextData = useContext<SpotifyAuthContextData | undefined>(
    SpotifyAuthContext,
  );

  const spotifyAuth = spotifyAuthContextData?.spotifyAuth;
  const [currentSongInfo, setCurrentSongInfo] =
    useState<CurrentPlaybackResponse>();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get<CurrentPlaybackResponse>(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          // TODO if this fails we refresh, refactor spotify auth stuff into a hook
          headers: {
            Authorization: `Bearer ${spotifyAuth?.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(result => {
        setCurrentSongInfo(result.data);
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  }, [spotifyAuth?.accessToken]);
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const item = currentSongInfo?.item as TrackObjectFull;
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.view}
    >
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
      <SafeAreaView style={styles.trackListView}>
        <Text style={styles.samplesHeading}>Who Sampled?</Text>
        <View style={styles.trackListWrapper}>
          <TrackList trackInfo={item} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default DetailsScreen;
