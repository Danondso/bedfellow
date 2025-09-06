import React, { useCallback } from 'react';
import {
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { ThemeTransition } from '../../context/ThemeContext/ThemeTransition';
import ThemedView, { ThemedSpacer } from '../../components/themed/ThemedView';
import { BedfellowSample } from '../../types/bedfellow-api';
import useBedfellow from '../../hooks/bedfellow/useBedfellow';
import useSpotify from '../../hooks/spotify/useSpotify';
import SearchResultItem from '../../components/search/SearchResultItem';
import { createStyles } from './Search.themed.styles';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { search } = useBedfellow();
  const { searchSamples, loadMore, refresh, results, loading, loadingMore, refreshing, error, query } = search;
  const { queue } = useSpotify();

  const handleAddToQueue = useCallback(
    async (item: BedfellowSample) => {
      try {
        const result = await queue.addToQueue(item);
        if (result.includes('Queued')) {
          Alert.alert('Success', result);
        } else {
          Alert.alert('Unable to Queue', result);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to add track to queue');
        console.error('Queue error:', err);
      }
    },
    [queue]
  );

  const handlePlayAtSample = useCallback(async (_item: BedfellowSample) => {
    Alert.alert('Coming Soon', 'Play at sample position will be available soon');
  }, []);

  const renderItem = ({ item }: { item: BedfellowSample }) => {
    return (
      <SearchResultItem
        item={item}
        onAddToQueue={() => handleAddToQueue(item)}
        onPlayAtSample={() => handlePlayAtSample(item)}
        isInCurrentTrack={false}
        hasBeenPlayed={false}
      />
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedView style={styles.emptyIcon}>
          <Icon name="musical-notes" size={40} color={theme.colors.primary[600]} />
        </ThemedView>
        <Text style={styles.emptyTitle}>{query ? 'No samples found' : 'Discover Music Samples'}</Text>
        <Text style={styles.emptySubtitle}>
          {query
            ? `Try searching for "${query.split(' ')[0]}" or another artist name`
            : 'Search for your favorite artists and tracks to discover the samples that inspired them'}
        </Text>
      </ThemedView>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <ThemedView style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary[600]} />
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface[100] }}>
      <ThemeTransition type="slide" duration={300}>
        <ThemedView style={styles.container}>
          {/* Header with back button */}
          <ThemedView style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
              <Icon name="chevron-back" size={24} color={theme.colors.primary[600]} />
            </TouchableOpacity>
            <Text style={styles.title}>Search Samples</Text>
          </ThemedView>

          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Search Container */}
            <ThemedView style={styles.searchContainer}>
              <Icon name="search" size={20} color={theme.colors.text[400]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by artist or track..."
                placeholderTextColor={theme.colors.text[400]}
                value={query}
                onChangeText={searchSamples}
                autoFocus
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => searchSamples('')} activeOpacity={0.7}>
                  <Icon name="close-circle" size={20} color={theme.colors.text[400]} />
                </TouchableOpacity>
              )}
            </ThemedView>

            {/* Error Display */}
            {error && (
              <ThemedView style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </ThemedView>
            )}

            {/* Content */}
            {loading ? (
              <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary[600]} />
                <ThemedSpacer size="md" />
                <Text style={[styles.emptySubtitle, { color: theme.colors.text[500] }]}>Searching for samples...</Text>
              </ThemedView>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                    tintColor={theme.colors.primary[600]}
                    colors={[theme.colors.primary[600]]}
                  />
                }
              />
            )}
          </KeyboardAvoidingView>
        </ThemedView>
      </ThemeTransition>
    </SafeAreaView>
  );
};

export default SearchScreen;
