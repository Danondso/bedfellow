import React, { useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedView from '../../components/themed/ThemedView';
import ThemedText from '../../components/themed/ThemedText';
import ThemedButton from '../../components/themed/ThemedButton';
import AnimatedOwl from '../../components/brand/AnimatedOwl';
import SpotifyLogo from '../../components/brand/SpotifyLogo';
import { ThemeTransition } from '../../context/ThemeContext/ThemeTransition';
import { DETAILS } from '../constants/Screens';
import { LoginScreenProps } from '../../types';
import { createStyles } from './Login.themed.styles';
import { useMusicProvider } from '../../context/MusicProviderContext';
import { MusicProviderId } from '../../services/music-providers/types';

function LoginScreen({ navigation }: LoginScreenProps) {
  const { availableProviders, activeProviderId, isProviderAvailable, authorize, authState, clearError } =
    useMusicProvider();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const activeProvider = useMemo(
    () => availableProviders.find((provider) => provider.id === activeProviderId) ?? null,
    [availableProviders, activeProviderId]
  );
  const isActiveProviderAvailable = isProviderAvailable(activeProviderId);
  const loginButtonLabel = activeProvider ? `Continue with ${activeProvider.displayName}` : 'Continue';
  const loginButtonIcon =
    activeProviderId === MusicProviderId.Spotify ? <SpotifyLogo size={21} color="#FFFFFF" /> : undefined;
  const loginButtonVariant = activeProviderId === MusicProviderId.Spotify ? 'spotify' : 'outline';
  const loginButtonStyle =
    activeProviderId === MusicProviderId.Spotify
      ? {
          marginTop: theme.spacing.xxl,
          marginHorizontal: theme.spacing.xl,
          backgroundColor: '#1DB954', // Spotify Green
          borderRadius: 500,
          paddingVertical: 14,
          paddingHorizontal: 32,
        }
      : {
          marginTop: theme.spacing.xxl,
          marginHorizontal: theme.spacing.xl,
        };
  const loginButtonTextStyle =
    activeProviderId === MusicProviderId.Spotify
      ? {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '700' as const,
          letterSpacing: 0,
        }
      : {
          color: theme.colors.text[700],
          fontSize: 16,
          fontWeight: '600' as const,
          letterSpacing: 0,
        };

  // Show error if auth failed
  useEffect(() => {
    if (authState.error) {
      Alert.alert('Authentication Error', authState.error);
      clearError();
    }
  }, [authState.error, clearError]);

  const handleAuthenticate = useCallback(async () => {
    if (activeProviderId !== MusicProviderId.Spotify) {
      Alert.alert('Coming Soon', 'YouTube Music integration is not available yet. Please select Spotify.');
      return;
    }

    try {
      // Use the adapter's authorize method from MusicProviderContext
      await authorize(activeProviderId);

      // Small delay to ensure state updates have propagated
      await new Promise((resolve) => setTimeout(resolve, 100));

      navigation.navigate(DETAILS);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Failed to login', error.message);
      } else {
        Alert.alert('Failed to login');
      }
    }
  }, [activeProviderId, authorize, navigation]);

  return (
    <ThemeTransition type="scale" duration={400}>
      <ThemedView style={styles.view}>
        <ThemedView style={styles.loginView}>
          <AnimatedOwl
            size={100}
            variant="happy"
            animationType="float"
            duration={3000}
            style={{ marginBottom: theme.spacing.lg }}
          />
          <ThemedText variant="h1" style={styles.header}>
            Bedfellow
          </ThemedText>
          <ThemedText variant="body" style={styles.subHeader}>
            Discover the stories behind the music
          </ThemedText>
          <ThemedButton
            variant={loginButtonVariant}
            size="large"
            fullWidth
            onPress={handleAuthenticate}
            disabled={!isActiveProviderAvailable}
            icon={loginButtonIcon}
            iconPosition="left"
            style={loginButtonStyle}
            textStyle={loginButtonTextStyle}
          >
            {loginButtonLabel}
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemeTransition>
  );
}

export default LoginScreen;
