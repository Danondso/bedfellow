import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/types';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface[50],
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    lastCard: {
      marginBottom: theme.spacing.xxl,
    },
    cardGradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: theme.borderRadius.lg,
    },
    mainContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    imageContainer: {
      marginRight: theme.spacing.md,
    },
    albumImage: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface[200],
    },
    placeholderImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    trackInfo: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    artistName: {
      fontSize: theme.typography.sm,
      color: theme.colors.text[400],
      fontWeight: '500',
      marginBottom: 2,
    },
    trackName: {
      fontSize: theme.typography.base,
      color: theme.colors.text[800],
      fontWeight: '600',
      marginBottom: 4,
    },
    yearText: {
      fontSize: theme.typography.xs,
      color: theme.colors.text[300],
      fontStyle: 'italic',
    },
    expandableContent: {
      overflow: 'hidden',
    },
    samplesContainer: {
      padding: theme.spacing.md,
      paddingTop: 0,
    },
    samplesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border[100],
    },
    samplesTitle: {
      fontSize: theme.typography.base,
      fontWeight: '600',
      color: theme.colors.primary[600],
      marginLeft: theme.spacing.sm,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    loadingText: {
      marginLeft: theme.spacing.sm,
      color: theme.colors.text[400],
      fontSize: theme.typography.sm,
    },
    samplesList: {
      gap: theme.spacing.sm,
    },
    sampleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background[50],
      borderRadius: theme.borderRadius.md,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.secondary[400],
    },
    sampleArtworkContainer: {
      marginRight: theme.spacing.sm,
    },
    sampleArtwork: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface[200],
    },
    sampleArtworkPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    sampleInfo: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    sampleArtist: {
      fontSize: theme.typography.sm,
      color: theme.colors.text[400],
      fontWeight: '500',
    },
    sampleTrack: {
      fontSize: theme.typography.sm,
      color: theme.colors.text[800],
      fontWeight: '600',
      marginTop: 2,
    },
    sampleYear: {
      fontSize: theme.typography.xs,
      color: theme.colors.text[300],
      fontStyle: 'italic',
      marginTop: 2,
    },
    sampleActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    actionButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface[100],
    },
    noSamplesText: {
      textAlign: 'center',
      color: theme.colors.text[300],
      fontSize: theme.typography.sm,
      fontStyle: 'italic',
      padding: theme.spacing.lg,
    },
  });
