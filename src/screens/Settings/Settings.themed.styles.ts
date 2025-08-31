import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../theme/types';

type Style = {
  container: ViewStyle;
  safeArea: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  backButtonContainer: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  themePreview: ViewStyle;
  previewRow: ViewStyle;
  colorSwatch: ViewStyle;
  previewLabel: TextStyle;
  settingItem: ViewStyle;
  settingInfo: ViewStyle;
  settingLabel: TextStyle;
  themeSwitcher: ViewStyle;
  harmonyInfo: TextStyle;
  actionButtons: ViewStyle;
  actionButton: ViewStyle;
  resetButton: ViewStyle;
  infoItem: ViewStyle;
  footer: ViewStyle;
  backButton: ViewStyle;
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background[50],
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: theme.spacing.xl, // More generous top padding
      paddingBottom: theme.spacing.xxxl, // Very generous bottom padding
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.background[50],
    },
    backButtonContainer: {
      marginBottom: theme.spacing.sm + theme.spacing.xs / 2, // 10 = 8 + 2
      width: theme.spacing.xl + theme.spacing.sm, // 40 = 32 + 8
      height: theme.spacing.xl + theme.spacing.sm, // 40 = 32 + 8
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerTitle: {
      fontSize: theme.typography['3xl'],
      fontFamily: 'Georgia',
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
      color: theme.colors.text[900],
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: theme.typography.base,
      color: theme.colors.text[600],
      lineHeight: theme.typography.base * 1.5,
    },
    section: {
      marginHorizontal: theme.spacing.xl, // More generous side margins
      marginBottom: theme.spacing.xxl, // More space between sections
      padding: theme.spacing.xl, // More internal padding
      backgroundColor: theme.colors.surface[50],
      borderRadius: theme.borderRadius['2xl'],
      borderWidth: 1,
      borderColor: theme.colors.border[100],
      // Warm shadow
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.08)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: theme.typography.lg,
      fontFamily: 'Georgia',
      fontWeight: '600',
      marginBottom: theme.spacing.xl, // More space after section titles
      color: theme.colors.text[800],
      letterSpacing: -0.3,
    },
    themePreview: {
      padding: theme.spacing.xl, // More generous internal padding
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.xl, // More space after preview
      backgroundColor: theme.colors.surface[100],
      borderWidth: 1,
      borderColor: theme.colors.border[100],
    },
    previewRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.sm + theme.spacing.xs / 2, // 10 = 8 + 2
    },
    colorSwatch: {
      width: theme.spacing.xxl + theme.spacing.sm, // 56 = 48 + 8
      height: theme.spacing.xxl + theme.spacing.sm, // 56 = 48 + 8
      borderRadius: theme.borderRadius.full,
      borderWidth: 2,
      borderColor: theme.colors.background[50],
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    previewLabel: {
      textAlign: 'center',
      marginTop: 5,
      color: theme.colors.text[700],
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg, // More generous vertical padding
      paddingHorizontal: theme.spacing.lg, // More generous horizontal padding
      marginBottom: theme.spacing.md, // More space between items
      backgroundColor: theme.colors.background[50],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border[50],
    },
    settingInfo: {
      flex: 1,
      marginRight: 10,
    },
    settingLabel: {
      fontSize: theme.typography.base,
      fontWeight: '500',
      color: theme.colors.text[800],
      letterSpacing: -0.2,
    },
    themeSwitcher: {
      flex: 1,
      maxWidth: 200,
    },
    harmonyInfo: {
      marginTop: 2,
      color: theme.colors.text[600],
    },
    actionButtons: {
      gap: theme.spacing.xs,
    },
    actionButton: {
      marginBottom: theme.spacing.md, // More space between buttons
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    },
    resetButton: {
      borderColor: theme.colors.error[500],
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md, // More generous padding
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.background[50],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm, // More space between info items
    },
    footer: {
      paddingHorizontal: theme.spacing.md + theme.spacing.xs, // 20 = 16 + 4
      paddingTop: theme.spacing.md + theme.spacing.xs, // 20
    },
    backButton: {
      width: '100%',
    },
  });

export default createStyles;
