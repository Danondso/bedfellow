import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from './ThemedText';

interface ThemedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'important' | 'success' | 'warning' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  dot?: boolean;
  count?: number;
  maxCount?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ThemedBadge: React.FC<ThemedBadgeProps> = ({
  children,
  variant = 'default',
  size = 'small',
  dot = false,
  count,
  maxCount = 99,
  position = 'top-right',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  // Get size-based styles
  const getSizeStyles = () => {
    if (dot) {
      switch (size) {
        case 'small':
          return { width: 8, height: 8 };
        case 'large':
          return { width: 12, height: 12 };
        case 'medium':
        default:
          return { width: 10, height: 10 };
      }
    }

    switch (size) {
      case 'small':
        return {
          minWidth: 18,
          height: 18,
          paddingHorizontal: theme.spacing.xs / 2,
          fontSize: theme.typography.xs,
        };
      case 'large':
        return {
          minWidth: 24,
          height: 24,
          paddingHorizontal: theme.spacing.xs,
          fontSize: theme.typography.base,
        };
      case 'medium':
      default:
        return {
          minWidth: 20,
          height: 20,
          paddingHorizontal: theme.spacing.xs / 2,
          fontSize: theme.typography.sm,
        };
    }
  };

  // Get variant-based colors
  const getVariantColors = () => {
    switch (variant) {
      case 'important':
        // Use rust/coral for important callouts as per PRD
        return {
          backgroundColor: theme.colors.accent[500], // Rust color
          textColor: theme.colors.text[50],
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success[500],
          textColor: theme.colors.text[50],
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning[500],
          textColor: theme.colors.text[900],
        };
      case 'info':
        return {
          backgroundColor: theme.colors.info[500],
          textColor: theme.colors.text[50],
        };
      case 'neutral':
        return {
          backgroundColor: theme.colors.surface[300],
          textColor: theme.colors.text[700],
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.primary[500],
          textColor: theme.colors.text[50],
        };
    }
  };

  // Get position styles
  const getPositionStyle = (): ViewStyle => {
    const offset = -4;
    switch (position) {
      case 'top-right':
        return { position: 'absolute', top: offset, right: offset };
      case 'top-left':
        return { position: 'absolute', top: offset, left: offset };
      case 'bottom-right':
        return { position: 'absolute', bottom: offset, right: offset };
      case 'bottom-left':
        return { position: 'absolute', bottom: offset, left: offset };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantColors = getVariantColors();

  const badgeStyle: ViewStyle = {
    ...getPositionStyle(),
    ...(dot ? {} : sizeStyles),
    backgroundColor: variantColors.backgroundColor,
    borderRadius: theme.borderRadius.full, // Pill-shaped for warm aesthetic
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const badgeTextStyle: TextStyle = {
    fontSize: 'fontSize' in sizeStyles ? sizeStyles.fontSize : theme.typography.xs,
    color: variantColors.textColor,
    fontWeight: '600',
    ...textStyle,
  };

  const displayCount = count && count > maxCount ? `${maxCount}+` : count?.toString();

  if (dot) {
    return (
      <View style={{ position: 'relative' }}>
        {children}
        <View style={[badgeStyle, { width: sizeStyles.width, height: sizeStyles.height }]} />
      </View>
    );
  }

  if (count !== undefined) {
    return (
      <View style={{ position: 'relative' }}>
        {children}
        <View style={badgeStyle}>
          <ThemedText style={badgeTextStyle}>{displayCount}</ThemedText>
        </View>
      </View>
    );
  }

  return <View style={{ position: 'relative' }}>{children}</View>;
};

// Standalone badge for inline use
export const ThemedInlineBadge: React.FC<{
  text: string;
  variant?: ThemedBadgeProps['variant'];
  size?: ThemedBadgeProps['size'];
  style?: ViewStyle;
  textStyle?: TextStyle;
}> = ({ text, variant = 'default', size = 'medium', style, textStyle }) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs / 2,
          paddingHorizontal: theme.spacing.xs,
          fontSize: theme.typography.xs,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.typography.base,
        };
      case 'medium':
      default:
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          fontSize: theme.typography.sm,
        };
    }
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'important':
        return {
          backgroundColor: theme.colors.accent[500], // Rust for important
          textColor: theme.colors.text[50],
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success[500],
          textColor: theme.colors.text[50],
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning[400],
          textColor: theme.colors.text[900],
        };
      case 'info':
        return {
          backgroundColor: theme.colors.info[500],
          textColor: theme.colors.text[50],
        };
      case 'neutral':
        return {
          backgroundColor: theme.colors.surface[200],
          textColor: theme.colors.text[700],
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.primary[500],
          textColor: theme.colors.text[50],
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantColors = getVariantColors();

  const badgeStyle: ViewStyle = {
    ...sizeStyles,
    backgroundColor: variantColors.backgroundColor,
    borderRadius: theme.borderRadius.full, // Pill-shaped
    alignSelf: 'flex-start',
    ...style,
  };

  const badgeTextStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    color: variantColors.textColor,
    fontWeight: '600',
    ...textStyle,
  };

  return (
    <View style={badgeStyle}>
      <ThemedText style={badgeTextStyle}>{text}</ThemedText>
    </View>
  );
};

export default ThemedBadge;
