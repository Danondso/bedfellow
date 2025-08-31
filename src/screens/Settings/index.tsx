import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../context/ThemeContext';
import ThemedView from '../../components/themed/ThemedView';
import ThemedText from '../../components/themed/ThemedText';
import ThemedButton from '../../components/themed/ThemedButton';
import SoftHeader from '../../components/navigation/SoftHeader';
import ThemeSwitcher from '../../components/themed/ThemeSwitcher';
import { ThemeTransition } from '../../context/ThemeContext/ThemeTransition';
import { useAdvancedDynamicTheme } from '../../context/ThemeContext/dynamicTheme';
import { createStyles } from './Settings.themed.styles';

const SettingsScreen: React.FC = () => {
  const { theme, themeMode, resetToDefaults } = useTheme();
  const { clearCache } = useAdvancedDynamicTheme(null);
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

  return (
    <ThemeTransition type="fade" duration={300}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background[50] }]}
        edges={['left', 'right']}
      >
        <SoftHeader title="Settings" showBackButton />
        <ThemedView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Theme Section */}
            <View style={styles.section}>
              <ThemedText variant="h4" style={styles.sectionTitle}>
                Appearance
              </ThemedText>

              {/* Current Theme Preview */}
              <View style={styles.themePreview}>
                <View style={styles.previewRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary[500] }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary[500] }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.accent[500] }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.surface[200] }]} />
                </View>
                <ThemedText variant="caption" style={styles.previewLabel}>
                  Active: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode
                </ThemedText>
              </View>

              <ThemeSwitcher variant="segmented" showDynamicToggle={false} style={{ marginBottom: theme.spacing.md }} />
            </View>

            {/* Advanced Theme Options */}
            <View style={styles.section}>
              <ThemedText variant="h4" style={styles.sectionTitle}>
                Options
              </ThemedText>

              {/* Theme Actions */}
              <View style={styles.actionButtons}>
                <ThemedButton variant="outline" size="medium" onPress={handleClearCache} style={styles.actionButton}>
                  <Icon name="trash-outline" size={18} color={theme.colors.primary[600]} />
                  <ThemedText variant="body"> Clear Cache</ThemedText>
                </ThemedButton>

                <ThemedButton
                  variant="danger-outline"
                  size="medium"
                  onPress={handleResetTheme}
                  style={styles.actionButton}
                >
                  <Icon name="refresh-outline" size={18} color={theme.colors.error[600]} />
                  <ThemedText variant="body" style={{ color: theme.colors.error[600] }}>
                    {' '}
                    Reset All Settings
                  </ThemedText>
                </ThemedButton>
              </View>
            </View>

            {/* App Info */}
            <View style={styles.section}>
              <ThemedText variant="h4" style={styles.sectionTitle}>
                About Bedfellow
              </ThemedText>

              <View style={styles.infoItem}>
                <ThemedText variant="body" style={{ fontWeight: '500' }}>
                  App Version
                </ThemedText>
                <ThemedText variant="body" color="muted">
                  0.2.0
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <ThemedText variant="body" style={{ fontWeight: '500' }}>
                  Theme Engine
                </ThemedText>
                <ThemedText variant="body" color="muted">
                  v2.0
                </ThemedText>
              </View>

              <View style={{ ...styles.infoItem, marginTop: theme.spacing.md }}>
                <ThemedText
                  variant="caption"
                  style={{ textAlign: 'center', width: '100%', color: theme.colors.text[500] }}
                >
                  Made with ♪ for music lovers
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </ThemeTransition>
  );
};

export default SettingsScreen;
