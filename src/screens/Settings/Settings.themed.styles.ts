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
      paddingBottom: theme.spacing.md + theme.spacing.xs, // 20 = 16 + 4
    },
    header: {
      paddingHorizontal: theme.spacing.md + theme.spacing.xs, // 20 = 16 + 4
      paddingTop: theme.spacing.sm + 2, // 10 = 8 + 2
      paddingBottom: theme.spacing.sm + 2, // 10
    },
    backButtonContainer: {
      marginBottom: 10,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.colors.text[900],
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.text[600],
    },
    section: {
      paddingHorizontal: theme.spacing.md + theme.spacing.xs, // 20 = 16 + 4
      paddingVertical: theme.spacing.md - 1, // 15
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 15,
      color: theme.colors.text[800],
    },
    themePreview: {
      padding: theme.spacing.md - 1, // 15
      borderRadius: theme.borderRadius.lg + theme.borderRadius.base, // 12 = 8 + 4
      marginBottom: theme.spacing.md + theme.spacing.xs, // 20 = 16 + 4
      backgroundColor: theme.colors.surface[100],
      borderWidth: 1,
      borderColor: theme.colors.border[200],
    },
    previewRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    colorSwatch: {
      width: 60,
      height: 60,
      borderRadius: 30,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
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
      paddingVertical: 12,
    },
    settingInfo: {
      flex: 1,
      marginRight: 10,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.text[800],
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
      marginTop: 10,
    },
    actionButton: {
      marginBottom: 10,
    },
    resetButton: {
      borderColor: theme.colors.error[500],
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
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
