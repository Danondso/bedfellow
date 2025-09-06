import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageStyle } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../context/ThemeContext';
import { BedfellowSample } from '../../types/bedfellow-api';

interface SearchResultItemProps {
  item: BedfellowSample;
  onAddToQueue?: () => void;
  onPlayAtSample?: () => void;
  isInCurrentTrack?: boolean;
  hasBeenPlayed?: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  onAddToQueue,
  onPlayAtSample,
  isInCurrentTrack = false,
  hasBeenPlayed = false,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface[50],
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: isInCurrentTrack ? 2 : 0,
      borderColor: isInCurrentTrack ? theme.colors.primary[400] : 'transparent',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 12,
    },
    albumArt: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary[100],
      justifyContent: 'center',
      alignItems: 'center',
    },
    albumImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    textContent: {
      flex: 1,
    },
    artistName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text[900],
      marginBottom: 2,
    },
    trackInfo: {
      fontSize: 14,
      color: theme.colors.text[600],
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
    indicatorContainer: {
      flexDirection: 'row',
      gap: 4,
      marginTop: 4,
    },
    indicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary[100],
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      gap: 4,
    },
    indicatorText: {
      fontSize: 11,
      color: theme.colors.primary[700],
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.albumArt}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.albumImage as ImageStyle} />
          ) : (
            <Icon name="musical-notes" size={24} color={theme.colors.primary[600]} />
          )}
        </View>

        <View style={styles.textContent}>
          <Text style={styles.artistName} numberOfLines={1}>
            {item.artist}
          </Text>
          <Text style={styles.trackInfo} numberOfLines={1}>
            {item.track} {item.year ? `• ${item.year}` : ''}
          </Text>

          {(isInCurrentTrack || hasBeenPlayed) && (
            <View style={styles.indicatorContainer}>
              {isInCurrentTrack && (
                <View style={styles.indicator}>
                  <Icon name="radio" size={10} color={theme.colors.primary[700]} />
                  <Text style={styles.indicatorText}>In current track</Text>
                </View>
              )}
              {hasBeenPlayed && (
                <View style={[styles.indicator, { backgroundColor: theme.colors.success[100] }]}>
                  <Icon name="checkmark-circle" size={10} color={theme.colors.success[700]} />
                  <Text style={[styles.indicatorText, { color: theme.colors.success[700] }]}>Played</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onAddToQueue}>
            <Icon name="add-circle-outline" size={28} color={theme.colors.primary[600]} />
          </TouchableOpacity>

          {onPlayAtSample && (
            <TouchableOpacity style={styles.actionButton} onPress={onPlayAtSample}>
              <Icon name="play-circle-outline" size={28} color={theme.colors.primary[600]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultItem;
