import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../theme/types';
import { themedStyles } from '../../theme/utils';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'card' | 'modal' | 'transparent';
  padding?: keyof Theme['spacing'] | 'none';
  margin?: keyof Theme['spacing'] | 'none';
  rounded?: keyof Theme['borderRadius'] | 'none';
  shadow?: keyof Theme['shadows'] | 'none';
  flex?: number;
  centered?: boolean;
  row?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  bordered?: boolean;
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  variant = 'default',
  padding,
  margin,
  rounded,
  shadow,
  flex,
  centered,
  row,
  fullWidth,
  fullHeight,
  bordered,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'surface':
        return {
          backgroundColor: theme.colors.surface[500],
        };
      case 'card':
        return {
          backgroundColor: theme.colors.surface[400],
          borderRadius: theme.borderRadius.lg,
          ...theme.shadows.base,
        };
      case 'modal':
        return {
          backgroundColor: theme.colors.surface[300],
          borderRadius: theme.borderRadius.xl,
          ...theme.shadows.xl,
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.background[500],
        };
    }
  };

  const computedStyle: ViewStyle = {
    ...getVariantStyle(),
    ...(padding && padding !== 'none' ? { padding: theme.spacing[padding] } : {}),
    ...(margin && margin !== 'none' ? { margin: theme.spacing[margin] } : {}),
    ...(rounded && rounded !== 'none' ? { borderRadius: theme.borderRadius[rounded] } : {}),
    ...(shadow && shadow !== 'none' ? theme.shadows[shadow] : {}),
    ...(flex !== undefined ? { flex } : {}),
    ...(centered ? themedStyles.centered : {}),
    ...(row ? themedStyles.row : {}),
    ...(fullWidth ? themedStyles.fullWidth : {}),
    ...(fullHeight ? themedStyles.fullHeight : {}),
    ...(bordered
      ? {
          borderWidth: 1,
          borderColor: theme.colors.border[500],
        }
      : {}),
  };

  return (
    <View style={[computedStyle, style]} {...props}>
      {children}
    </View>
  );
};

// Specialized view components for common patterns
export const ThemedCard: React.FC<ThemedViewProps> = (props) => <ThemedView variant="card" padding="md" {...props} />;

export const ThemedSurface: React.FC<ThemedViewProps> = (props) => <ThemedView variant="surface" {...props} />;

export const ThemedModal: React.FC<ThemedViewProps> = (props) => <ThemedView variant="modal" padding="lg" {...props} />;

export const ThemedContainer: React.FC<ThemedViewProps> = (props) => <ThemedView flex={1} padding="md" {...props} />;

export const ThemedRow: React.FC<ThemedViewProps> = (props) => <ThemedView row {...props} />;

export const ThemedCenteredView: React.FC<ThemedViewProps> = (props) => <ThemedView centered flex={1} {...props} />;

// Spacer component for consistent spacing
interface ThemedSpacerProps {
  size?: keyof Theme['spacing'];
  horizontal?: boolean;
}

export const ThemedSpacer: React.FC<ThemedSpacerProps> = ({ size = 'md', horizontal = false }) => {
  const { theme } = useTheme();
  const spacing = theme.spacing[size];

  return <View style={horizontal ? { width: spacing } : { height: spacing }} />;
};

// Divider component
interface ThemedDividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
  margin?: keyof Theme['spacing'];
}

export const ThemedDivider: React.FC<ThemedDividerProps> = ({
  orientation = 'horizontal',
  color,
  thickness = StyleSheet.hairlineWidth,
  margin,
}) => {
  const { theme } = useTheme();

  const dividerStyle: ViewStyle = {
    backgroundColor: color || theme.colors.divider[500],
    ...(orientation === 'horizontal'
      ? {
          height: thickness,
          width: '100%',
          marginVertical: margin ? theme.spacing[margin] : 0,
        }
      : {
          width: thickness,
          height: '100%',
          marginHorizontal: margin ? theme.spacing[margin] : 0,
        }),
  };

  return <View style={dividerStyle} />;
};

export default ThemedView;
