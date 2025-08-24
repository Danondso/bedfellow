import React from 'react';
import { View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';

interface ThemedCalloutProps {
  title?: string;
  message: string;
  variant?: 'default' | 'important' | 'success' | 'warning' | 'info' | 'error';
  icon?: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export const ThemedCallout: React.FC<ThemedCalloutProps> = ({
  title,
  message,
  variant = 'default',
  icon,
  action,
  dismissible = false,
  onDismiss,
  style,
}) => {
  const { theme } = useTheme();

  // Get variant-based styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'important':
        // Use rust accent for important callouts as per PRD
        return {
          backgroundColor: `${theme.colors.accent[500]}15`, // Rust with low opacity
          borderColor: theme.colors.accent[500],
          iconColor: theme.colors.accent[600],
          titleColor: theme.colors.accent[700],
          messageColor: theme.colors.text[700],
        };
      case 'success':
        return {
          backgroundColor: `${theme.colors.success[500]}15`,
          borderColor: theme.colors.success[500],
          iconColor: theme.colors.success[600],
          titleColor: theme.colors.success[700],
          messageColor: theme.colors.text[700],
        };
      case 'warning':
        return {
          backgroundColor: `${theme.colors.warning[300]}20`,
          borderColor: theme.colors.warning[500],
          iconColor: theme.colors.warning[600],
          titleColor: theme.colors.warning[700],
          messageColor: theme.colors.text[700],
        };
      case 'error':
        return {
          backgroundColor: `${theme.colors.error[500]}15`,
          borderColor: theme.colors.error[500],
          iconColor: theme.colors.error[600],
          titleColor: theme.colors.error[700],
          messageColor: theme.colors.text[700],
        };
      case 'info':
        return {
          backgroundColor: `${theme.colors.info[500]}15`,
          borderColor: theme.colors.info[500],
          iconColor: theme.colors.info[600],
          titleColor: theme.colors.info[700],
          messageColor: theme.colors.text[700],
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface[100],
          borderColor: theme.colors.border[300],
          iconColor: theme.colors.primary[600],
          titleColor: theme.colors.text[900],
          messageColor: theme.colors.text[700],
        };
    }
  };

  const variantStyles = getVariantStyles();

  const calloutStyle: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderLeftWidth: 4,
    borderLeftColor: variantStyles.borderColor,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...style,
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: title ? theme.spacing.xs : 0,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
  };

  const titleStyle: TextStyle = {
    fontSize: theme.typography.base,
    fontWeight: '600',
    color: variantStyles.titleColor,
    marginBottom: theme.spacing.xs / 2,
  };

  const messageStyle: TextStyle = {
    fontSize: theme.typography.sm,
    color: variantStyles.messageColor,
    lineHeight: theme.typography.sm * 1.5,
  };

  const iconContainerStyle: ViewStyle = {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  };

  const dismissButtonStyle: ViewStyle = {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: theme.spacing.xs,
  };

  return (
    <View style={calloutStyle}>
      {dismissible && onDismiss && (
        <TouchableOpacity style={dismissButtonStyle} onPress={onDismiss}>
          <ThemedText style={{ fontSize: 18, color: variantStyles.messageColor }}>×</ThemedText>
        </TouchableOpacity>
      )}

      <View style={headerStyle}>
        {icon && <View style={iconContainerStyle}>{icon}</View>}

        <View style={contentStyle}>
          {title && <ThemedText style={titleStyle}>{title}</ThemedText>}
          <ThemedText style={messageStyle}>{message}</ThemedText>

          {action && (
            <View style={{ marginTop: theme.spacing.sm }}>
              <ThemedButton
                variant={variant === 'important' ? 'accent' : 'primary'}
                size="small"
                onPress={action.onPress}
              >
                {action.label}
              </ThemedButton>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// Compact inline callout for smaller messages
export const ThemedInlineCallout: React.FC<{
  message: string;
  variant?: ThemedCalloutProps['variant'];
  style?: ViewStyle;
}> = ({ message, variant = 'default', style }) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'important':
        return {
          backgroundColor: `${theme.colors.accent[500]}10`, // Rust with very low opacity
          textColor: theme.colors.accent[700],
        };
      case 'success':
        return {
          backgroundColor: `${theme.colors.success[500]}10`,
          textColor: theme.colors.success[700],
        };
      case 'warning':
        return {
          backgroundColor: `${theme.colors.warning[300]}15`,
          textColor: theme.colors.warning[700],
        };
      case 'error':
        return {
          backgroundColor: `${theme.colors.error[500]}10`,
          textColor: theme.colors.error[700],
        };
      case 'info':
        return {
          backgroundColor: `${theme.colors.info[500]}10`,
          textColor: theme.colors.info[700],
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface[100],
          textColor: theme.colors.text[700],
        };
    }
  };

  const variantStyles = getVariantStyles();

  const inlineStyle: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: theme.typography.sm,
    color: variantStyles.textColor,
  };

  return (
    <View style={inlineStyle}>
      <ThemedText style={textStyle}>{message}</ThemedText>
    </View>
  );
};

export default ThemedCallout;
