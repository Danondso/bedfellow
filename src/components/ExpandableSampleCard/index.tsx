import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ActivityIndicator, Alert } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { BedfellowSample, BedfellowSampleWithUri } from '../../types/bedfellow-api';
import useGetSamples from '../../hooks/bedfellow/useGetSamples';
import useSpotify from '../../hooks/spotify/useSpotify';
import { useTheme } from '../../context/ThemeContext';
import { styles as createStyles } from './styles';

interface ExpandableSampleCardProps {
  sample: BedfellowSample;
  isLast?: boolean;
}

const ExpandableSampleCard: React.FC<ExpandableSampleCardProps> = ({ sample, isLast = false }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [samplesLoading, setSamplesLoading] = useState(false);
  const [expandAnimation] = useState(() => new Animated.Value(0));
  const [rotateAnimation] = useState(() => new Animated.Value(0));
  const { getBedfellowData, samples } = useGetSamples();
  const { queue, search } = useSpotify();

  const primaryIconColor = theme.colors.primary[500];
  const mutedIconColor = theme.colors.text[300];
  const sampleCount = samples?.samples?.length ?? 0;

  const estimatedContentHeight = useMemo(() => {
    const headerHeight = theme.spacing.lg * 2;
    const estimatedRowHeight = theme.spacing.lg * 2 + 40;
    const defaultRows = 3;
    const maxRows = 6;
    const rows = sampleCount > 0 ? sampleCount : defaultRows;
    const clampedRows = Math.min(rows, maxRows);

    return headerHeight + clampedRows * estimatedRowHeight;
  }, [sampleCount, theme.spacing.lg]);

  const handleExpand = useCallback(async () => {
    if (!isExpanded && !samples) {
      setSamplesLoading(true);
      await getBedfellowData(sample.artist, sample.track);
      setSamplesLoading(false);
    }

    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.parallel([
      Animated.spring(expandAnimation, {
        toValue,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(rotateAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [expandAnimation, getBedfellowData, isExpanded, rotateAnimation, sample.artist, sample.track, samples]);

  const handleAddToQueue = useCallback(
    async (item: BedfellowSample) => {
      try {
        const searchQuery = `${item.artist} ${item.track}`;
        const results = await search.search(searchQuery);

        if (results?.tracks?.items && results.tracks.items.length > 0) {
          const track = results.tracks.items[0];
          // Create a new sample object with the Spotify URI
          const sampleWithUri: BedfellowSampleWithUri = {
            ...item,
            uri: track.uri,
          };
          const result = await queue.addToQueue(sampleWithUri);
          if (result.includes('Queued')) {
            Alert.alert('Success', result);
          } else {
            Alert.alert('Unable to Queue', result);
          }
        } else {
          Alert.alert('Not Found', `Could not find "${item.track}" on Spotify`);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to add to queue');
        console.error('Queue error:', error);
      }
    },
    [queue, search]
  );

  const chevronRotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const maxHeight = useMemo(
    () =>
      expandAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, estimatedContentHeight],
      }),
    [estimatedContentHeight, expandAnimation]
  );

  const renderSampleItem = useCallback(
    (sampleItem: BedfellowSample, index: number) => (
      <View key={`${sampleItem.artist}-${sampleItem.track}-${index}`} style={styles.sampleItem}>
        <View style={styles.sampleArtworkContainer}>
          {sampleItem.image ? (
            <Image source={{ uri: sampleItem.image }} style={styles.sampleArtwork} />
          ) : (
            <View style={[styles.sampleArtwork, styles.sampleArtworkPlaceholder]}>
              <Icon name="musical-notes" size={18} color={mutedIconColor} />
            </View>
          )}
        </View>

        <View style={styles.sampleInfo}>
          <Text style={styles.sampleArtist}>{sampleItem.artist}</Text>
          <Text style={styles.sampleTrack}>{sampleItem.track}</Text>
          {sampleItem.year && <Text style={styles.sampleYear}>{sampleItem.year}</Text>}
        </View>

        <View style={styles.sampleActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAddToQueue(sampleItem)}
            activeOpacity={0.7}
          >
            <Icon name="add-circle-outline" size={24} color={primaryIconColor} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleAddToQueue, mutedIconColor, primaryIconColor, styles]
  );

  return (
    <View style={[styles.container, isLast && styles.lastCard]}>
      <LinearGradient
        colors={[theme.colors.surface[50], theme.colors.surface[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
        pointerEvents="none"
      />

      <TouchableOpacity onPress={handleExpand} activeOpacity={0.9}>
        <View style={styles.mainContent}>
          <View style={styles.imageContainer}>
            {sample.image ? (
              <Image source={{ uri: sample.image }} style={styles.albumImage} />
            ) : (
              <View style={[styles.albumImage, styles.placeholderImage]}>
                <Icon name="musical-notes" size={24} color={theme.colors.text[300]} />
              </View>
            )}
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.artistName} numberOfLines={1}>
              {sample.artist}
            </Text>
            <Text style={styles.trackName} numberOfLines={2}>
              {sample.track}
            </Text>
            {sample.year && <Text style={styles.yearText}>{sample.year}</Text>}
          </View>

          <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
            <Icon name="chevron-down" size={24} color={theme.colors.primary[500]} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.expandableContent, { maxHeight }]}>
        <View style={styles.samplesContainer}>
          <View style={styles.samplesHeader}>
            <Icon name="disc-outline" size={18} color={theme.colors.primary[600]} />
            <Text style={styles.samplesTitle}>Samples Used</Text>
          </View>

          {samplesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary[500]} />
              <Text style={styles.loadingText}>Loading samples...</Text>
            </View>
          ) : samples?.samples && samples.samples.length > 0 ? (
            <View style={styles.samplesList}>
              {samples.samples.map((sampleItem, index) => renderSampleItem(sampleItem, index))}
            </View>
          ) : (
            <Text style={styles.noSamplesText}>No samples found</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default ExpandableSampleCard;
