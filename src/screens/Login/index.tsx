import React, { useContext, useEffect } from 'react';
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

function LoginScreen({ navigation }: LoginScreenProps) {
  const { setAuthToken, authState, clearError } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Show error if auth failed
  useEffect(() => {
    if (authState.error) {
      Alert.alert('Authentication Error', authState.error);
      clearError();
    }
  }, [authState.error, clearError]);

  async function authenticate() {
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
          <ThemedButton
            variant="spotify"
            size="large"
            fullWidth
            onPress={authenticate}
            icon={<SpotifyLogo size={21} color="#FFFFFF" />}
            iconPosition="left"
            style={{
              marginTop: theme.spacing.xxl,
              marginHorizontal: theme.spacing.xl,
              backgroundColor: '#1DB954', // Spotify Green
              borderRadius: 500, // Spotify's pill-shaped button
              paddingVertical: 14,
              paddingHorizontal: 32,
            }}
            textStyle={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '700',
              letterSpacing: 0,
            }}
          >
            Continue with Spotify
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemeTransition>
  );
}

export default LoginScreen;
