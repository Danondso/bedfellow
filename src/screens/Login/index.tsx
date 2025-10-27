import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import Config from 'react-native-config';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../context/SpotifyAuthContext';
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
  const { setAuthToken, authState, clearError } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { availableProviders, activeProviderId, setActiveProvider, isProviderAvailable } = useMusicProvider();
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

  const handleSelectProvider = useCallback(
    async (providerId: MusicProviderId) => {
      try {
        await setActiveProvider(providerId);
      } catch (error) {
        console.error('Failed to set active provider', error);
        Alert.alert('Error', 'Unable to switch music provider. Please try again.');
      }
    },
    [setActiveProvider]
  );

  async function authenticate() {
    if (activeProviderId !== MusicProviderId.Spotify) {
      Alert.alert('Coming Soon', 'YouTube Music integration is not available yet. Please select Spotify.');
      return;
    }

    try {
      const config: any = {
        clientId: Config.SPOTIFY_CLIENT_ID,
        redirectUrl: Platform.OS === 'ios' ? Config.SPOTIFY_REDIRECT_URI : Config.SPOTIFY_REDIRECT_URI_ANDROID,
        scopes: [
          'user-read-playback-state',
          'user-modify-playback-state',
          'user-follow-read',
          'user-read-currently-playing',
        ],
        serviceConfiguration: {
          authorizationEndpoint: 'https://accounts.spotify.com/authorize',
          tokenEndpoint: `${Config.BEDFELLOW_API_BASE_URL}/token`,
        },
      };

      const session: AuthorizeResult = await authorize(config);
      if (session.refreshToken) {
        await setAuthToken(session);
        navigation.navigate(DETAILS);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Failed to login', error.message);
      } else {
        Alert.alert('Failed to login');
      }
    }
  }

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
          <ThemedView style={styles.providerContainer}>
            <ThemedText variant="h5" style={styles.providerTitle}>
              Choose your music provider
            </ThemedText>
            <ThemedView style={styles.providerButtons}>
              {availableProviders.map((provider) => {
                const isActive = provider.id === activeProviderId;
                const available = isProviderAvailable(provider.id);
                return (
                  <ThemedButton
                    key={provider.id}
                    variant={isActive ? 'primary' : 'outline'}
                    size="medium"
                    fullWidth
                    disabled={!available}
                    style={styles.providerButton}
                    onPress={() => handleSelectProvider(provider.id)}
                  >
                    {provider.displayName}
                    {!available ? ' (coming soon)' : ''}
                  </ThemedButton>
                );
              })}
            </ThemedView>
          </ThemedView>
          <ThemedButton
            variant={loginButtonVariant}
            size="large"
            fullWidth
            onPress={authenticate}
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
