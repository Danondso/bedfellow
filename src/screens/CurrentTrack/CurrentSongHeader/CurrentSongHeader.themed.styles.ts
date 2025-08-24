import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../../theme/types';

type Style = {
  view: ViewStyle;
  currentSongView: ViewStyle;
  artistName: TextStyle;
  trackName: TextStyle;
  albumDescription: TextStyle;
  button: ViewStyle;
  samplesHeading: TextStyle;
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create<Style>({
    view: {
      flex: 1,
      backgroundColor: theme.colors.background[50], // Light sand background
    },
    currentSongView: {
      position: 'relative',
      flex: 1 / 3,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: theme.spacing.xxl,
      paddingBottom: theme.spacing.md,
      borderColor: theme.colors.border[200], // Soft border for warm aesthetic
      borderWidth: 1,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.md,
    },
    artistName: {
      padding: theme.spacing.xs,
      fontWeight: '400',
      textAlign: 'center',
      fontSize: theme.typography.base,
      color: theme.colors.text[800],
    },
    trackName: {
      padding: theme.spacing.md,
      fontSize: theme.typography.lg,
      fontWeight: '500',
      textAlign: 'center',
      color: theme.colors.text[900],
    },
    albumDescription: {
      textAlign: 'center',
      fontSize: theme.typography.xs,
      color: theme.colors.text[700],
    },
    button: {
      borderRadius: theme.borderRadius.md,
      borderColor: theme.colors.success[500],
      borderWidth: 1,
      padding: theme.spacing.md,
      width: '100%',
    },
    samplesHeading: {
      padding: theme.spacing.md,
      paddingBottom: 0,
      fontSize: theme.typography.lg,
      fontWeight: '500',
      color: theme.colors.text[900],
    },
  });

export default createStyles;
