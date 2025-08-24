import React, { useContext } from 'react';
import { Platform, Alert } from 'react-native';
import Config from 'react-native-config';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import { SpotifyAuthContext, SpotifyAuthContextData } from '../../context/SpotifyAuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemedView from '../../components/themed/ThemedView';
import ThemedText from '../../components/themed/ThemedText';
import ThemedButton from '../../components/themed/ThemedButton';
import { ThemeTransition } from '../../context/ThemeContext/ThemeTransition';
import { DETAILS } from '../constants/Screens';
import { LoginScreenProps } from '../../types';
import { createStyles } from './Login.themed.styles';

function LoginScreen({ navigation }: LoginScreenProps) {
  const spotifyAuthContext = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { setSpotifyAuth } = spotifyAuthContext as SpotifyAuthContextData;
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
      if (setSpotifyAuth && session.refreshToken) {
        setSpotifyAuth({
          ...session,
          expired: false,
        });
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
          <ThemedText variant="h1" style={styles.header}>
            Bedfellow
          </ThemedText>
          <ThemedText variant="body" style={styles.subHeader}>
            Discover the stories behind the music
          </ThemedText>
          <ThemedButton
            variant="primary"
            size="large"
            fullWidth
            onPress={authenticate}
            style={{
              marginTop: theme.spacing.xxl,
              marginHorizontal: theme.spacing.xl,
            }}
          >
            Login with Spotify
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemeTransition>
  );
}

export default LoginScreen;
