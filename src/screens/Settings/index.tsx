import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import ThemedView from '../../components/themed/ThemedView';
import ThemedText from '../../components/themed/ThemedText';
import ThemedButton from '../../components/themed/ThemedButton';
import ThemeSwitcher, { DarkModeToggle } from '../../components/themed/ThemeSwitcher';
import { ThemeTransition } from '../../context/ThemeContext/ThemeTransition';
import { useAdvancedDynamicTheme } from '../../context/ThemeContext/dynamicTheme';
import { createStyles } from './Settings.themed.styles';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, themeMode, isDynamicEnabled, toggleDynamicTheme, resetToDefaults } = useTheme();
  const { clearCache, validateAccessibility } = useAdvancedDynamicTheme(null);
  const styles = createStyles(theme);

  const handleResetTheme = () => {
    Alert.alert('Reset Theme', 'This will reset all theme settings to their defaults. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await resetToDefaults();
          Alert.alert('Success', 'Theme settings have been reset to defaults');
        },
      },
    ]);
  };

  const handleClearCache = async () => {
    await clearCache();
    Alert.alert('Cache Cleared', 'Color extraction cache has been cleared');
  };

  const handleValidateTheme = () => {
    const validation = validateAccessibility();
    if (validation) {
      if (validation.valid) {
        Alert.alert('Accessibility Check', 'Current theme meets WCAG AA standards! ✓');
      } else {
        Alert.alert('Accessibility Issues', validation.issues.join('\n'), [{ text: 'OK' }]);
      }
    }
  };

  return (
    <ThemeTransition type="fade" duration={300}>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <ThemedText variant="title" style={styles.headerTitle}>
                Settings
              </ThemedText>
              <ThemedText variant="body" color="muted" style={styles.headerSubtitle}>
                Customize your app experience
              </ThemedText>
            </View>

            {/* Theme Section */}
            <View style={styles.section}>
              <ThemedText variant="subtitle" style={styles.sectionTitle}>
                Theme
              </ThemedText>

              {/* Current Theme Preview */}
              <View style={styles.themePreview}>
                <View style={styles.previewRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary[500] }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary[500] }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.accent[500] }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.background[500] }]} />
                </View>
                <ThemedText variant="caption" style={styles.previewLabel}>
                  Current Theme: {themeMode}
                </ThemedText>
              </View>

              {/* Theme Mode Selector */}
              <View style={styles.settingItem}>
                <ThemedText variant="body" style={styles.settingLabel}>
                  Theme Mode
                </ThemedText>
                <ThemeSwitcher variant="segmented" showDynamicToggle={false} style={styles.themeSwitcher} />
              </View>

              {/* Dynamic Theme Toggle */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <ThemedText variant="body" style={styles.settingLabel}>
                    Dynamic Album Colors
                  </ThemedText>
                  <ThemedText variant="caption" color="muted">
                    Extract colors from album artwork
                  </ThemedText>
                </View>
                <ThemedButton
                  variant={isDynamicEnabled ? 'primary' : 'outline'}
                  size="small"
                  onPress={toggleDynamicTheme}
                >
                  {isDynamicEnabled ? 'Enabled' : 'Disabled'}
                </ThemedButton>
              </View>

              {/* Quick Dark Mode Toggle */}
              <View style={styles.settingItem}>
                <ThemedText variant="body" style={styles.settingLabel}>
                  Quick Toggle
                </ThemedText>
                <DarkModeToggle />
              </View>
            </View>

            {/* Advanced Theme Options */}
            <View style={styles.section}>
              <ThemedText variant="subtitle" style={styles.sectionTitle}>
                Advanced
              </ThemedText>

              {/* Color Harmony Selector */}
              <View style={styles.settingItem}>
                <ThemedText variant="body" style={styles.settingLabel}>
                  Color Harmony
                </ThemedText>
                <ThemedText variant="caption" color="muted" style={styles.harmonyInfo}>
                  Algorithm for dynamic color generation
                </ThemedText>
              </View>

              {/* Theme Actions */}
              <View style={styles.actionButtons}>
                <ThemedButton variant="outline" size="medium" onPress={handleValidateTheme} style={styles.actionButton}>
                  Check Accessibility
                </ThemedButton>

                <ThemedButton variant="outline" size="medium" onPress={handleClearCache} style={styles.actionButton}>
                  Clear Color Cache
                </ThemedButton>

                <ThemedButton
                  variant="outline"
                  size="medium"
                  onPress={handleResetTheme}
                  style={[styles.actionButton, styles.resetButton]}
                >
                  Reset to Defaults
                </ThemedButton>
              </View>
            </View>

            {/* App Info */}
            <View style={styles.section}>
              <ThemedText variant="subtitle" style={styles.sectionTitle}>
                About
              </ThemedText>

              <View style={styles.infoItem}>
                <ThemedText variant="caption" color="muted">
                  Bedfellow
                </ThemedText>
                <ThemedText variant="caption" color="muted">
                  Version 0.2.0
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <ThemedText variant="caption" color="muted">
                  Theme System v2.0
                </ThemedText>
                <ThemedText variant="caption" color="muted">
                  WCAG AA Compliant
                </ThemedText>
              </View>
            </View>

            {/* Back Button */}
            <View style={styles.footer}>
              <ThemedButton
                variant="primary"
                size="large"
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                Back to App
              </ThemedButton>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    </ThemeTransition>
  );
};

export default SettingsScreen;
