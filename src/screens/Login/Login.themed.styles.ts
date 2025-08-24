import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../theme/types';

type Style = {
  view: ViewStyle;
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
      // Use warm sand background for welcoming feel
      backgroundColor: theme.colors.background[100],
    },
    header: {
      paddingTop: theme.spacing.xl,
      fontSize: 56, // Larger for impact
      fontWeight: 'bold',
      color: theme.colors.primary[600], // Teal for brand
      // Serif font will be applied via ThemedText
    },
    subHeader: {
      fontSize: theme.typography.lg,
      color: theme.colors.text[600], // Softer muted text
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      fontStyle: 'italic', // Playful touch
    },
    loginView: {
      alignItems: 'center',
      width: '85%',
      paddingBottom: 120,
      paddingTop: theme.spacing.xxl,
      backgroundColor: theme.colors.surface[50], // Lighter surface
      borderRadius: theme.borderRadius['3xl'], // Softer, rounder corners
      ...theme.shadows.sm, // Subtle shadow
    },
    loginButtonView: {
      backgroundColor: theme.colors.primary[500],
      borderWidth: 1,
      borderColor: theme.colors.primary[600],
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.lg,
      overflow: 'hidden',
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
