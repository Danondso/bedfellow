import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.typography.title.fontSize,
      fontWeight: theme.typography.title.fontWeight as any,
      color: theme.colors.text[900],
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text[600],
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.subtitle.fontSize,
      fontWeight: theme.typography.subtitle.fontWeight as any,
      color: theme.colors.text[800],
      marginBottom: theme.spacing.md,
    },
    themePreview: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface[100],
      marginBottom: theme.spacing.lg,
      ...theme.shadows.md,
    },
    previewRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.md,
    },
    colorSwatch: {
      width: 60,
      height: 60,
      borderRadius: 30,
      ...theme.shadows.sm,
    },
    previewLabel: {
      textAlign: 'center',
      marginTop: theme.spacing.xs,
      color: theme.colors.text[700],
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border[200],
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text[900],
    },
    themeSwitcher: {
      flex: 1,
      maxWidth: 200,
    },
    harmonySelector: {
      marginTop: theme.spacing.md,
    },
    harmonyOption: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.surface[200],
    },
    harmonyOptionSelected: {
      backgroundColor: theme.colors.primary[500],
    },
    harmonyOptionText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text[800],
    },
    harmonyOptionTextSelected: {
      color: theme.colors.text[100],
    },
    harmonyInfo: {
      marginTop: theme.spacing.xxs,
      color: theme.colors.text[600],
    },
    actionButtons: {
      marginTop: theme.spacing.md,
    },
    actionButton: {
      marginBottom: theme.spacing.sm,
    },
    resetButton: {
      borderColor: theme.colors.error[500],
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    backButton: {
      width: '100%',
    },

    // Theme preview components
    previewContainer: {
      backgroundColor: theme.colors.surface[100],
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      ...theme.shadows.md,
    },
    previewTitle: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text[600],
      marginBottom: theme.spacing.xs,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    colorItem: {
      width: '22%',
      aspectRatio: 1,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.xs,
    },

    // Toggle styles
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggleLabel: {
      marginRight: theme.spacing.sm,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text[800],
    },

    // Accessibility indicators
    accessibilityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.success[100],
    },
    accessibilityBadgeText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.success[800],
      marginLeft: theme.spacing.xs,
    },

    // Advanced settings
    advancedContainer: {
      marginTop: theme.spacing.md,
    },
    advancedToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    advancedContent: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border[200],
    },

    // Slider styles
    sliderContainer: {
      marginVertical: theme.spacing.sm,
    },
    sliderLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text[700],
      marginBottom: theme.spacing.xs,
    },
    sliderValue: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.primary[600],
      fontWeight: '600',
    },
    slider: {
      height: 40,
    },
  });

export default createStyles;
