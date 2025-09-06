import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../theme/types';

type Style = {
  container: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  title: TextStyle;
  searchContainer: ViewStyle;
  searchInput: TextStyle;
  emptyContainer: ViewStyle;
  emptyIcon: ViewStyle;
  emptyTitle: TextStyle;
  emptySubtitle: TextStyle;
  loadingContainer: ViewStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  footerLoader: ViewStyle;
  listContent: ViewStyle;
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background[50], // Light sand background like CurrentTrack
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xxxl, // Much larger top padding to clear the notch
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface[100],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border[200],
      position: 'relative',
      minHeight: 120,
    },
    backButton: {
      position: 'absolute',
      top: theme.spacing.xxxl, // Match the header's top padding to stay aligned
      left: theme.spacing.lg,
      zIndex: 100,
      width: theme.spacing.xl + theme.spacing.sm, // 40 = 32 + 8
      height: theme.spacing.xl + theme.spacing.sm, // 40 = 32 + 8
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface[200],
      borderRadius: theme.borderRadius.full,
    },
    title: {
      fontSize: theme.typography['2xl'],
      fontFamily: 'Georgia',
      fontWeight: '600',
      color: theme.colors.text[900],
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface[50],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border[200],
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.base,
      fontWeight: '500',
      color: theme.colors.text[900],
      marginLeft: theme.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxxl,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary[100],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: theme.typography.lg,
      fontWeight: '600',
      color: theme.colors.text[900],
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptySubtitle: {
      fontSize: theme.typography.base,
      color: theme.colors.text[600],
      textAlign: 'center',
      lineHeight: 22,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xxxl,
    },
    errorContainer: {
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.error[100],
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.error[200],
    },
    errorText: {
      fontSize: theme.typography.sm,
      color: theme.colors.error[700],
      textAlign: 'center',
      fontWeight: '500',
    },
    footerLoader: {
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing.xl,
    },
  });

export default createStyles;
