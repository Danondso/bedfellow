import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { searchAndRetrieveParsedWhoSampledPage } from '../../services/whosampled/WhoSampled.service';
import { getBedfellowDBData, postToBedfellowDB } from '../../services/bedfellow-db-api/BedfellowDBAPI.service';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { DetailsScreenProps } from '../../types';
import styles from './Details.styles';
import { ArtistObjectSimplified, CurrentPlaybackResponse, TrackObjectFull } from '../../types/spotify-api';
import SampleList from './TrackList';
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

const parseAndPostWhoSampledData = async (artists: ArtistObjectSimplified[], name: string) => {
  try {
    const parseResult = await searchAndRetrieveParsedWhoSampledPage(artists, name);
    if (!parseResult) {
      return false;
    }
    const result = await postToBedfellowDB(parseResult);
    return result;
  } catch (err) {
    return false;
  }
};

const useBedfellowService = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackSamples, setTrackSamples] = useState<BedfellowTrackSamples | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const loadBedfellowData = async (artists: ArtistObjectSimplified[], track: string) => {
    setIsLoading(true);

    try {
      if ((artists[0].name, track)) {
        const trackSamplesResults = await Promise.all(
          await artists.map(async (artist) => {
            const result: BedfellowTrackSamples | null = await getBedfellowDBData(artist?.name, track);
            return result;
          })
        );
        // This could lead to a situation where we make a bunch of calls then only use the first result
        // let's try to make this smarter later
        const filteredTrackSampleResults = trackSamplesResults.filter((trackSample) => trackSample);
        if (filteredTrackSampleResults.length) {
          setTrackSamples(filteredTrackSampleResults[0]);
          setIsLoading(true);
        }
      }
      const result = await parseAndPostWhoSampledData(artists, track);
      if (result) {
        const sampleData = await getBedfellowDBData(artists[0].name, track);
        setTrackSamples(sampleData);
      }

      setIsLoading(false);
    } catch (error) {
      console.log('ERROR::', error);
      setIsLoading(false);
    }
  };

  const refreshTrackSamples = () => {
    setRefresh(!refresh);
    setTrackSamples(null);
  };

  return { isLoading, trackSamples, loadBedfellowData, refreshTrackSamples };
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
  const { isLoading, trackSamples, loadBedfellowData, refreshTrackSamples } = useBedfellowService();

  useEffect(() => {
    refreshTrackSamples();
    if (currentlyPlayingTrack?.artists && currentlyPlayingTrack?.name) {
      loadBedfellowData(currentlyPlayingTrack.artists, currentlyPlayingTrack.name);
    } else {
      loadData();
    }
  }, [currentlyPlayingTrack?.artists, currentlyPlayingTrack?.name]);

  const refreshControl = () => {
    refreshTrackSamples();
    loadData();
  };

  return (
    <View style={styles.view}>
      <SampleList
        onRefresh={refreshControl}
        isLoading={isLoading}
        HeaderComponent={<CurrentSong item={currentlyPlayingTrack} />}
        trackSamples={trackSamples}
      />
    </View>
  );
}

export default CurrentTrackScreen;
