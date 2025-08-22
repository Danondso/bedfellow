import React from 'react';
import { StatusBar, View, ViewStyle, Platform, StatusBarStyle } from 'react-native';
import { useSafeAreaInsets, SafeAreaViewProps } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../theme/types';
import { useStatusBarStyle } from '../../context/ThemeContext/ThemeTransition';

interface ThemedSafeAreaViewProps extends Omit<SafeAreaViewProps, 'style'> {
  style?: ViewStyle;
  statusBarStyle?: StatusBarStyle | 'auto';
  statusBarBackground?: string;
  statusBarTranslucent?: boolean;
  statusBarHidden?: boolean;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  variant?: 'default' | 'surface' | 'transparent';
  padding?: keyof Theme['spacing'] | 'none';
  paddingHorizontal?: keyof Theme['spacing'] | 'none';
  paddingVertical?: keyof Theme['spacing'] | 'none';
}

export const ThemedSafeAreaView: React.FC<ThemedSafeAreaViewProps> = ({
  style,
  statusBarStyle = 'auto',
  statusBarBackground,
  statusBarTranslucent = false,
  statusBarHidden = false,
  edges = ['top', 'bottom', 'left', 'right'],
  variant = 'default',
  padding,
  paddingHorizontal,
  paddingVertical,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const autoStatusBarStyle = useStatusBarStyle();

  // Get background color based on variant
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'surface':
        return theme.colors.surface[500];
      case 'transparent':
        return 'transparent';
      case 'default':
      default:
        return theme.colors.background[500];
    }
  };

  // Calculate padding based on edges
  const getEdgePadding = (): ViewStyle => {
    const edgePadding: ViewStyle = {};

    if (edges.includes('top')) {
      edgePadding.paddingTop = insets.top;
    }
    if (edges.includes('bottom')) {
      edgePadding.paddingBottom = insets.bottom;
    }
    if (edges.includes('left')) {
      edgePadding.paddingLeft = insets.left;
    }
    if (edges.includes('right')) {
      edgePadding.paddingRight = insets.right;
    }

    return edgePadding;
  };

  // Additional padding from props
  const getAdditionalPadding = (): ViewStyle => {
    const additionalPadding: ViewStyle = {};

    if (padding && padding !== 'none') {
      additionalPadding.padding = theme.spacing[padding];
    }
    if (paddingHorizontal && paddingHorizontal !== 'none') {
      additionalPadding.paddingHorizontal = theme.spacing[paddingHorizontal];
    }
    if (paddingVertical && paddingVertical !== 'none') {
      additionalPadding.paddingVertical = theme.spacing[paddingVertical];
    }

    return additionalPadding;
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: getBackgroundColor(),
    ...getEdgePadding(),
    ...getAdditionalPadding(),
    ...style,
  };

  // Determine status bar style
  const resolvedStatusBarStyle = statusBarStyle === 'auto' ? autoStatusBarStyle : statusBarStyle;
  const resolvedStatusBarBackground = statusBarBackground || getBackgroundColor();

  return (
    <>
      <StatusBar
        barStyle={resolvedStatusBarStyle}
        backgroundColor={Platform.OS === 'android' ? resolvedStatusBarBackground : undefined}
        translucent={statusBarTranslucent}
        hidden={statusBarHidden}
      />
      <View style={containerStyle} {...props}>
        {children}
      </View>
    </>
  );
};

// Screen wrapper component that combines SafeAreaView with common patterns
interface ThemedScreenProps extends ThemedSafeAreaViewProps {
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardAvoiding?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ThemedScreen: React.FC<ThemedScreenProps> = ({
  scrollable = false,
  refreshing = false,
  onRefresh,
  keyboardAvoiding = false,
  loading = false,
  error = null,
  onRetry,
  children,
  ...safeAreaProps
}) => {
  const { theme } = useTheme();

  // Import necessary components dynamically to avoid circular dependencies
  const { ScrollView } = require('react-native');
  const { RefreshControl } = require('react-native');
  const { KeyboardAvoidingView } = require('react-native');
  const { ActivityIndicator } = require('react-native');
  const ThemedText = require('./ThemedText').default;
  const ThemedButton = require('./ThemedButton').default;
  const ThemedView = require('./ThemedView').default;

  const content = (
    <>
      {loading && (
        <ThemedView centered flex={1}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </ThemedView>
      )}
      {error && !loading && (
        <ThemedView centered flex={1} padding="lg">
          <ThemedText variant="h6" color="error" align="center">
            {error}
          </ThemedText>
          {onRetry && (
            <ThemedButton variant="primary" onPress={onRetry} style={{ marginTop: theme.spacing.md }}>
              Retry
            </ThemedButton>
          )}
        </ThemedView>
      )}
      {!loading && !error && children}
    </>
  );

  const wrappedContent = scrollable ? (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        ) : undefined
      }
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const finalContent = keyboardAvoiding ? (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      {wrappedContent}
    </KeyboardAvoidingView>
  ) : (
    wrappedContent
  );

  return <ThemedSafeAreaView {...safeAreaProps}>{finalContent}</ThemedSafeAreaView>;
};

// Tab screen wrapper (for use in tab navigators)
export const ThemedTabScreen: React.FC<ThemedSafeAreaViewProps> = ({
  edges = ['left', 'right'], // Typically don't need top/bottom for tab screens
  ...props
}) => {
  return <ThemedSafeAreaView edges={edges} {...props} />;
};

// Modal screen wrapper
export const ThemedModalScreen: React.FC<ThemedSafeAreaViewProps> = ({
  variant = 'surface',
  edges = ['top'], // Modals typically only need top edge
  ...props
}) => {
  return <ThemedSafeAreaView variant={variant} edges={edges} {...props} />;
};

// Export a single index file for all themed components
export { default as ThemedView } from './ThemedView';
export { default as ThemedText } from './ThemedText';
export { default as ThemedButton } from './ThemedButton';
export { default as ThemedCard } from './ThemedCard';

export default ThemedSafeAreaView;
