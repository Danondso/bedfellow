import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../theme/types';

type Style = {
  view: ViewStyle;
  button: ViewStyle;
  samplesHeading: TextStyle;
  trackListWrapper: ViewStyle;
  settingsButton: ViewStyle;
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create<Style>({
    view: {
      flex: 1,
      backgroundColor: theme.colors.background[50], // Light sand background
    },
    trackListWrapper: {
      alignItems: 'center',
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
    settingsButton: {
      position: 'absolute',
      top: theme.spacing.xxxl - theme.spacing.xs, // 60 = 64 - 4
      right: theme.spacing.lg,
      zIndex: 100,
      padding: theme.spacing.md, // More generous padding
      backgroundColor: `${theme.colors.surface[100]}F2`, // Warm sand with higher opacity
      borderRadius: theme.borderRadius.full, // Fully rounded
      borderWidth: 1,
      borderColor: theme.colors.border[200], // Softer border
      // Subtle warm shadow
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4, // Android shadow
    },
  });

export default createStyles;
