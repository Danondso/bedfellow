import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextStyle } from 'react-native';
import { Avatar } from 'react-native-paper';
import useImagePalette from '../../hooks/useImagePalette/useImagePalette';
import { searchAndRetrieveParsedWhoSampledPage } from '../../services/whosampled/WhoSampled.service';
import { getBedfellowDBData, postToBedfellowDB } from '../../services/bedfellow-db-api/BedfellowDBAPI.service';
import { BedfellowTrackSamples } from '../../types/bedfellow-api';
import { DetailsScreenProps } from '../../types';
import styles from './CurrentTrack.styles';
import { ArtistObjectSimplified, CurrentPlaybackResponse, TrackObjectFull } from '../../types/spotify-api';
import SampleList from './TrackList';
import useSpotifyAPI from '../../hooks/spotify/useSpotifyAPI';
import { ImagePaletteContext, ImagePaletteContextData } from '../../context/ImagePaletteContext';

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
const loadBedfellowData = async (artists: ArtistObjectSimplified[] = [], track: string = '') => {
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
        return filteredTrackSampleResults[0];
      }
    }
    const result = await parseAndPostWhoSampledData(artists, track);
    if (result) {
      return await getBedfellowDBData(artists[0].name, track);
    }
  } catch (error) {
    console.log('loadBedfellowData error::', error);
    return null;
  }
};

export function CurrentSong({ item }: CurrentSongProps) {
  const { imagePalette } = useContext<ImagePaletteContextData>(ImagePaletteContext);
  const albumFontColor: TextStyle = {
    color: imagePalette.background,
  };
  return (
    <View style={styles.view}>
      <View
        style={[
          {
            backgroundColor: imagePalette?.secondary,
          },
          styles.currentSongView,
        ]}
      >
        {item && 'album' in item ? (
          <Avatar.Image size={90} source={item?.album.images[0]} />
        ) : (
          // @ts-ignore artists is inside of album don't believe the typescript warning
          <Avatar.Text size={90} label={item?.artists[0].name} />
        )}
        <Text style={[albumFontColor, styles.trackName]}>{item ? item.name : 'Nothing playing currently.'}</Text>
        <Text style={[albumFontColor, styles.artistName]}>{item ? formatArtistNames(item) : ''}</Text>
        <Text style={[albumFontColor, styles.albumDescription]}>{item ? item.album.name : ''}</Text>
      </View>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CurrentTrackScreen({ navigation }: DetailsScreenProps) {
  const { response, loadData } = useSpotifyAPI('v1/me/player/currently-playing');
  const [samples, setSamples] = useState<BedfellowTrackSamples | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentPlaybackResponse = response as CurrentPlaybackResponse;
  const currentlyPlayingTrack = currentPlaybackResponse?.item as TrackObjectFull;
  const albumArtURL = currentlyPlayingTrack?.album?.images?.[0].url || '';
  // using this here populates the context so any child components that need it can use that
  useImagePalette(albumArtURL);

  const refreshControl = () => {
    setIsLoading(true);
    loadData();
  };

  useEffect(() => {
    setIsLoading(true);
    if (currentlyPlayingTrack) {
      const { artists, name } = currentlyPlayingTrack;
      loadBedfellowData(artists, name).then((result) => {
        if (result) {
          setSamples(result);
        }
        setIsLoading(false);
      });
    } else {
      setSamples(null);
      setIsLoading(false);
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlayingTrack?.artists, currentlyPlayingTrack?.name]);

  return (
    <View style={[styles.view]}>
      <SampleList
        onRefresh={refreshControl}
        isLoading={isLoading}
        HeaderComponent={<CurrentSong item={currentlyPlayingTrack} />}
        trackSamples={samples}
      />
    </View>
  );
}

export default CurrentTrackScreen;
