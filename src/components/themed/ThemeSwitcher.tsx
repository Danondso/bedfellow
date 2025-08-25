import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode, Theme } from '../../theme/types';
import { spacingScale } from '../../theme/scales';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

// Theme mode options
const THEME_MODES = [
  { value: ThemeMode.LIGHT, label: 'Light', icon: '☀️' },
  { value: ThemeMode.DARK, label: 'Dark', icon: '🌙' },
  { value: ThemeMode.BRAND, label: 'Brand', icon: '🎨' },
  { value: ThemeMode.AUTO, label: 'System', icon: '⚙️' },
  { value: ThemeMode.DYNAMIC, label: 'Dynamic', icon: '🎵' },
];

interface ThemeSwitcherProps {
  variant?: 'buttons' | 'dropdown' | 'segmented' | 'list';
  showDynamicToggle?: boolean;
  showLabels?: boolean;
  style?: ViewStyle;
  onThemeChange?: (mode: ThemeMode) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'buttons',
  showDynamicToggle = true,
  showLabels = true,
  style,
  onThemeChange,
}) => {
  const { theme, themeMode, setThemeMode, isDynamicEnabled, toggleDynamicTheme } = useTheme();

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
    onThemeChange?.(mode);
  };

  switch (variant) {
    case 'buttons':
      return <ButtonSwitcher {...{ theme, themeMode, handleThemeChange, showLabels, style }} />;
    case 'segmented':
      return <SegmentedSwitcher {...{ theme, themeMode, handleThemeChange, style }} />;
    case 'list':
      return (
        <ListSwitcher
          {...{ theme, themeMode, handleThemeChange, isDynamicEnabled, toggleDynamicTheme, showDynamicToggle, style }}
        />
      );
    default:
      return null;
  }
};

// Button-based switcher
const ButtonSwitcher: React.FC<{
  theme: Theme;
  themeMode: ThemeMode;
  handleThemeChange: (mode: ThemeMode) => void;
  showLabels: boolean;
  style?: ViewStyle;
}> = ({ theme, themeMode, handleThemeChange, showLabels, style }) => {
  return (
    <View style={[styles.buttonContainer, style]}>
      {THEME_MODES.filter((mode) => mode.value !== ThemeMode.DYNAMIC).map((mode) => (
        <TouchableOpacity
          key={mode.value}
          style={[
            styles.themeButton,
            {
              backgroundColor: themeMode === mode.value ? theme.colors.primary[500] : theme.colors.surface[100], // Light sand for inactive
            },
          ]}
          onPress={() => handleThemeChange(mode.value)}
        >
          <ThemedText
            style={{
              fontSize: 24,
              marginBottom: showLabels ? 4 : 0,
            }}
          >
            {mode.icon}
          </ThemedText>
          {showLabels && (
            <ThemedText variant="caption" color={themeMode === mode.value ? 'inverse' : 'text'}>
              {mode.label}
            </ThemedText>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Segmented control switcher
const SegmentedSwitcher: React.FC<{
  theme: Theme;
  themeMode: ThemeMode;
  handleThemeChange: (mode: ThemeMode) => void;
  style?: ViewStyle;
}> = ({ theme, themeMode, handleThemeChange, style }) => {
  const modes = THEME_MODES.filter((mode) => mode.value !== ThemeMode.DYNAMIC && mode.value !== ThemeMode.AUTO);

  return (
    <View
      style={[
        styles.segmentedContainer,
        {
          backgroundColor: theme.colors.surface[100], // Light sand background
          borderRadius: theme.borderRadius.lg,
        },
        style,
      ]}
    >
      {modes.map((mode, index) => (
        <TouchableOpacity
          key={mode.value}
          style={[
            styles.segmentedButton,
            {
              backgroundColor: themeMode === mode.value ? theme.colors.primary[500] : 'transparent',
              borderTopLeftRadius: index === 0 ? theme.borderRadius.lg : 0,
              borderBottomLeftRadius: index === 0 ? theme.borderRadius.lg : 0,
              borderTopRightRadius: index === modes.length - 1 ? theme.borderRadius.lg : 0,
              borderBottomRightRadius: index === modes.length - 1 ? theme.borderRadius.lg : 0,
            },
          ]}
          onPress={() => handleThemeChange(mode.value)}
        >
          <ThemedText
            variant="body"
            color={themeMode === mode.value ? 'inverse' : 'text'}
            style={{ fontSize: 14, fontWeight: '600' }}
          >
            {mode.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// List-based switcher
const ListSwitcher: React.FC<{
  theme: Theme;
  themeMode: ThemeMode;
  handleThemeChange: (mode: ThemeMode) => void;
  isDynamicEnabled: boolean;
  toggleDynamicTheme: () => void;
  showDynamicToggle: boolean;
  style?: ViewStyle;
}> = ({ theme, themeMode, handleThemeChange, isDynamicEnabled, toggleDynamicTheme, showDynamicToggle, style }) => {
  return (
    <ThemedView style={style}>
      {THEME_MODES.filter((mode) => (!showDynamicToggle ? mode.value !== ThemeMode.DYNAMIC : true)).map((mode) => (
        <TouchableOpacity
          key={mode.value}
          style={[
            styles.listItem,
            {
              backgroundColor: themeMode === mode.value ? theme.colors.surface[200] : 'transparent', // Medium sand for active
            },
          ]}
          onPress={() => handleThemeChange(mode.value)}
        >
          <View style={styles.listItemContent}>
            <ThemedText style={{ fontSize: 20, marginRight: 12 }}>{mode.icon}</ThemedText>
            <ThemedText variant="body" weight={themeMode === mode.value ? 'semibold' : 'normal'}>
              {mode.label}
            </ThemedText>
          </View>
          {themeMode === mode.value && <ThemedText color="primary">✓</ThemedText>}
        </TouchableOpacity>
      ))}

      {showDynamicToggle && (
        <View style={[styles.listItem, styles.dynamicToggleItem]}>
          <View style={styles.listItemContent}>
            <ThemedText style={{ fontSize: 20, marginRight: 12 }}>🎨</ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText variant="body">Dynamic Album Colors</ThemedText>
              <ThemedText variant="caption" color="muted">
                Use colors from album artwork
              </ThemedText>
            </View>
          </View>
          <Switch
            value={isDynamicEnabled}
            onValueChange={toggleDynamicTheme}
            trackColor={{
              false: theme.colors.surface[600],
              true: theme.colors.primary[500],
            }}
            thumbColor={isDynamicEnabled ? theme.colors.primary[200] : theme.colors.surface[200]}
          />
        </View>
      )}
    </ThemedView>
  );
};

// Quick toggle for dark mode
export const DarkModeToggle: React.FC<{
  style?: ViewStyle;
}> = ({ style }) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const isDark = themeMode === ThemeMode.DARK || (themeMode === ThemeMode.AUTO && theme.mode === ThemeMode.DARK);

  const toggleDarkMode = () => {
    setThemeMode(isDark ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  return (
    <TouchableOpacity
      style={[
        styles.darkModeToggle,
        {
          backgroundColor: theme.colors.surface[100], // Light sand background
        },
        style,
      ]}
      onPress={toggleDarkMode}
    >
      <ThemedText style={{ fontSize: 24 }}>{isDark ? '🌙' : '☀️'}</ThemedText>
    </TouchableOpacity>
  );
};

// Floating theme switcher
export const FloatingThemeSwitcher: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}> = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const getPositionStyle = (): ViewStyle => {
    const offset = 16;
    switch (position) {
      case 'top-right':
        return { top: offset, right: offset };
      case 'top-left':
        return { top: offset, left: offset };
      case 'bottom-right':
        return { bottom: offset, right: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
    }
  };

  return (
    <View style={[styles.floatingContainer, getPositionStyle()]}>
      {isOpen && (
        <View
          style={[
            styles.floatingMenu,
            {
              backgroundColor: theme.colors.surface[200], // Medium sand for selected
              ...theme.shadows.lg,
            },
          ]}
        >
          <ThemeSwitcher variant="list" showDynamicToggle={false} />
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          {
            backgroundColor: theme.colors.accent[500],
            ...theme.shadows.xl,
          },
        ]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <ThemedText style={{ fontSize: 24 }}>{isOpen ? '✕' : '🎨'}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: spacingScale.sm + spacingScale.xs, // 12 = 8 + 4
  },
  themeButton: {
    padding: spacingScale.sm + spacingScale.xs, // 12 = 8 + 4
    borderRadius: spacingScale.sm + spacingScale.xs, // 12
    alignItems: 'center',
    minWidth: 70,
  },
  segmentedContainer: {
    flexDirection: 'row',
    padding: spacingScale.xs, // 4
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: spacingScale.sm, // 8
    paddingHorizontal: spacingScale.sm, // 8
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingScale.sm + spacingScale.xs, // 12 = 8 + 4
    paddingHorizontal: spacingScale.md, // 16
    borderRadius: spacingScale.sm, // 8
    marginBottom: spacingScale.xs, // 4
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dynamicToggleItem: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  darkModeToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  floatingMenu: {
    borderRadius: 12,
    marginBottom: 8,
    minWidth: 200,
    paddingVertical: 8,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemeSwitcher;
