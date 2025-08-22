import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../theme/types';

type Style = {
  footerWrapper: ViewStyle;
  view: ViewStyle;
  button: ViewStyle;
  samplesHeading: TextStyle;
  trackListWrapper: ViewStyle;
  settingsButton: ViewStyle;
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create<Style>({
    footerWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '15%',
      backgroundColor: theme.colors.surface[600],
      ...theme.shadows.lg,
    },
    view: {
      flex: 1,
      backgroundColor: theme.colors.background[500],
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
      top: 50,
      right: 20,
      zIndex: 100,
      padding: theme.spacing.sm,
      backgroundColor: `${theme.colors.surface[800]}CC`, // More opaque background
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border[400],
      ...theme.shadows.lg,
    },
  });

export default createStyles;
