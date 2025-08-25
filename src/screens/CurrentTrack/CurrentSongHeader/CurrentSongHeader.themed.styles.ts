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
      width: '90%', // Slightly narrower for more side margin
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: theme.spacing.xl, // Adjusted top padding
      paddingBottom: theme.spacing.lg, // Adjusted bottom padding
      backgroundColor: theme.colors.surface[50], // Slightly elevated sand surface
      borderColor: theme.colors.border[100], // Softer border for warm aesthetic
      borderWidth: 1,
      borderRadius: theme.borderRadius['3xl'], // Extra rounded for warm aesthetic
      marginTop: theme.spacing.xxxl, // Extra top margin for proper spacing from top
      marginBottom: theme.spacing.xl, // Good spacing before samples
      // Enhanced warm shadow
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8, // Android shadow
    },
    artistName: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      textAlign: 'center',
      color: theme.colors.text[700], // Slightly muted for hierarchy
      marginTop: theme.spacing.xs, // Small spacing between track and artist
    },
    trackName: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      textAlign: 'center',
      color: theme.colors.text[900], // Primary text color for main track
      lineHeight: theme.typography['2xl'] * 1.2, // Better line height for serif
    },
    albumDescription: {
      textAlign: 'center',
      color: theme.colors.text[600], // Muted for secondary info
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.sm,
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
