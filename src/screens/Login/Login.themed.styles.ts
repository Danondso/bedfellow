import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../theme/types';

type Style = {
  view: ViewStyle;
  header: TextStyle;
  subHeader: TextStyle;
  loginView: ViewStyle;
  button: ViewStyle;
  loginButtonView: ViewStyle;
  providerContainer: ViewStyle;
  providerTitle: TextStyle;
  providerButtons: ViewStyle;
  providerButton: ViewStyle;
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
      paddingTop: theme.spacing.xxl, // More generous top padding
      paddingBottom: theme.spacing.lg,
      fontSize: theme.spacing.xxl, // 64px - using xxxl spacing as font size
      fontWeight: 'bold',
      color: theme.colors.primary[600], // Teal for brand
      letterSpacing: -1, // Tighter letter spacing for impact
      // Serif font will be applied via ThemedText
    },
    subHeader: {
      fontSize: theme.typography.lg,
      color: theme.colors.text[600], // Softer muted text
      textAlign: 'center',
      marginTop: theme.spacing.md, // More space after header
      marginBottom: theme.spacing.xl, // Space before button
      paddingHorizontal: theme.spacing.xl,
      lineHeight: theme.typography.lg * 1.6, // More generous line height
      fontStyle: 'italic', // Playful touch
    },
    loginView: {
      alignItems: 'center',
      width: '80%', // Slightly narrower for more breathing room
      paddingBottom: theme.spacing.xxxl * 2, // Very generous bottom padding
      paddingTop: theme.spacing.xxxl, // Very generous top padding
      paddingHorizontal: theme.spacing.xl,
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
      borderRadius: theme.borderRadius.xl, // More rounded button
      paddingVertical: theme.spacing.lg, // More generous vertical padding
      paddingHorizontal: theme.spacing.xxl, // More generous horizontal padding
      alignItems: 'center',
      justifyContent: 'center',
    },
    providerContainer: {
      width: '100%',
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    providerTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      color: theme.colors.text[600],
      fontWeight: '600',
    },
    providerButtons: {
      flexDirection: 'column',
    },
    providerButton: {
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
  });

export default createStyles;
