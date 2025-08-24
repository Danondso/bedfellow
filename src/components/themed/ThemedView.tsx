import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../theme/types';
import { themedStyles } from '../../theme/utils';
import { applySpacing, SpacingValue, commonViewVariants } from './shared';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'card' | 'modal' | 'transparent';
  padding?: SpacingValue;
  paddingHorizontal?: SpacingValue;
  paddingVertical?: SpacingValue;
  margin?: SpacingValue;
  marginHorizontal?: SpacingValue;
  marginVertical?: SpacingValue;
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
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
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

  // Use shared variant styles
  const variantStyle = commonViewVariants[variant](theme);

  // Use shared spacing utility
  const spacingStyles = applySpacing(theme, {
    padding,
    paddingHorizontal,
    paddingVertical,
    margin,
    marginHorizontal,
    marginVertical,
  });

  const computedStyle: ViewStyle = {
    ...variantStyle,
    ...spacingStyles,
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
