import React, { ReactElement, useState } from 'react';
import { FlatList, View, Text, RefreshControl, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../../context/ThemeContext';
import { spacingScale } from '../../../theme/scales';
import { BedfellowTrackSamples } from '../../../types/bedfellow-api';
import AnimatedOwl from '../../../components/brand/AnimatedOwl';

import { findAndQueueTrack } from '../../../services/spotify/SpotifyAPI.service';
import { useAuth } from '../../../hooks/useAuth';
import SampleCard from './SampleCard';
import WhoSampledSkeleton from './Skeleton';
import ThemedText from '../../../components/themed/ThemedText';
import { BedfellowTypes } from '../../../types';

const styles = StyleSheet.create({
  snackBar: {
    bottom: spacingScale.xxxl + spacingScale.xxl + spacingScale.sm, // 120 = 64 + 48 + 8
    marginHorizontal: spacingScale.lg - spacingScale.xs, // 20 = 24 - 4
  },
});

function SamplesHeader({ samplesCount }: { samplesCount: number }) {
  const { theme } = useTheme();

  if (samplesCount === 0) return null;

  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        backgroundColor: theme.colors.background[50],
      }}
    >
      <ThemedText
        variant="h3"
        style={{
          color: theme.colors.text[900],
          textAlign: 'center',
          marginBottom: theme.spacing.xs,
        }}
      >
        Samples & Interpolations
      </ThemedText>
      <ThemedText
        variant="bodyLarge"
        style={{
          color: theme.colors.text[600],
          textAlign: 'center',
        }}
      >
        {samplesCount} {samplesCount === 1 ? 'find' : 'finds'}
      </ThemedText>
    </View>
  );
}

function EndOfListMascot() {
  const { theme } = useTheme();

  const whimsicalMessages = [
    "That's all the grooves I found!",
    'No more sonic treasures down here...',
    "The crate's empty, friend!",
    'End of the musical rabbit hole!',
    "That's where the beat stops!",
  ];

  const message = whimsicalMessages[Math.floor(Math.random() * whimsicalMessages.length)];

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: theme.spacing.xxxl,
        paddingBottom: theme.spacing.xxxl * 2,
        width: '100%',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: 200,
          height: 120,
        }}
      >
        {/* Moon in upper left */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 10,
          }}
        >
          <Svg width="30" height="30" viewBox="0 0 30 30">
            <Path
              d="M 20 5 Q 15 5 10 10 Q 5 15 5 20 Q 5 25 10 25 Q 8 28 5 25 Q 2 22 2 15 Q 2 8 8 3 Q 14 0 20 5"
              fill="none"
              stroke={theme.colors.text[600]}
              strokeWidth="1.5"
              opacity="0.6"
            />
          </Svg>
        </View>

        {/* Cactus on the right */}
        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 5,
          }}
        >
          <Svg width="35" height="50" viewBox="0 0 35 50">
            <Path
              d="M 17 45 L 17 15 M 17 30 L 8 25 L 8 35 M 17 25 L 26 20 L 26 30"
              fill="none"
              stroke={theme.colors.text[600]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </Svg>
        </View>

        {/* Centered Owl */}
        <AnimatedOwl size={80} variant="outlined" animated={false} />
      </View>

      <ThemedText
        variant="body"
        style={{
          color: theme.colors.text[500],
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: theme.typography.sm + 1,
          opacity: 0.8,
          marginTop: theme.spacing.sm,
        }}
      >
        {message}
      </ThemedText>
    </View>
  );
}

type SampleListProps = {
  trackSamples: BedfellowTrackSamples | null;
  isLoading: boolean;
  showSkeleton?: boolean;
  HeaderComponent: ReactElement;
  onRefresh: () => void;
};

function SampleList({ isLoading, showSkeleton, trackSamples, HeaderComponent, onRefresh }: SampleListProps) {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [error, setError] = useState<boolean>(false);

  const onPressHandler = async (item: BedfellowTypes.BedfellowSample) => {
    try {
      const result = await findAndQueueTrack(item, token);
      setSnackbarText(result);
      setError(false);
    } catch (err) {
      setError(true);
      setSnackbarText(err as string);
    }
    setShowSnackbar(true);
  };

  const samplesCount = trackSamples?.samples?.length || 0;

  const ListHeader = () => (
    <>
      {HeaderComponent}
      <SamplesHeader samplesCount={samplesCount} />
    </>
  );

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={isLoading}
            tintColor={theme.colors.primary[500]} // iOS
            colors={[theme.colors.primary[500], theme.colors.secondary[500]]} // Android
            progressBackgroundColor={theme.colors.surface[100]} // Android background
          />
        }
        contentContainerStyle={{
          paddingBottom: theme.spacing.xxxl * 2, // Extra bottom padding to ensure content scrolls above FAB
        }}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={(showSkeleton ?? isLoading) ? <WhoSampledSkeleton /> : null}
        ListFooterComponent={samplesCount > 0 && !isLoading ? <EndOfListMascot /> : null}
        data={trackSamples?.samples || []}
        renderItem={({ item }) => (
          <SampleCard
            item={item}
            onPress={() => {
              onPressHandler(item);
            }}
          />
        )}
      />
      <Snackbar
        duration={1000}
        visible={showSnackbar}
        onDismiss={() => {
          setShowSnackbar(false);
          setError(false);
          setSnackbarText('');
        }}
        wrapperStyle={styles.snackBar}
        style={{
          backgroundColor: error ? theme.colors.error[500] : theme.colors.surface[100], // Warm sand surface
          borderRadius: theme.borderRadius['2xl'], // More rounded corners
          borderWidth: 1,
          borderColor: error ? theme.colors.error[400] : theme.colors.border[200],
        }}
      >
        <Text
          style={{
            color: error ? theme.colors.background[100] : theme.colors.text[900],
          }}
        >
          {snackbarText}
        </Text>
      </Snackbar>
    </>
  );
}

export default SampleList;
