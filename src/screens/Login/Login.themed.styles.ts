import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../theme/types';

type Style = {
  view: ViewStyle;
  loginButtonText: TextStyle;
  header: TextStyle;
  subHeader: TextStyle;
  loginView: ViewStyle;
  button: ViewStyle;
  loginButtonView: ViewStyle;
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create<Style>({
    view: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background[500],
    },
    header: {
      paddingTop: theme.spacing.xl,
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.text[900],
    },
    subHeader: {
      fontSize: theme.typography.base,
      color: theme.colors.text[700],
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    loginView: {
      alignItems: 'center',
      width: '80%',
      paddingBottom: 200,
      backgroundColor: theme.colors.surface[500],
      borderColor: theme.colors.surface[600],
      borderWidth: 1,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.lg,
    },
    loginButtonView: {
      backgroundColor: theme.colors.primary[500],
      borderWidth: 1,
      borderColor: theme.colors.primary[600],
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.lg,
      overflow: 'hidden',
    },
    loginButtonText: {
      fontSize: theme.typography.base,
      fontWeight: '600',
      color: theme.colors.text[100],
    },
    button: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default createStyles;
