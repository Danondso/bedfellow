import { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../../theme/types';

export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Common size definitions for buttons
 */
export const getButtonSizeStyles = (size: ComponentSize, theme: Theme): ViewStyle => {
  const sizeStyles: Record<ComponentSize, ViewStyle> = {
    small: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      minHeight: 32,
    },
    medium: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 40,
    },
    large: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 48,
    },
  };

  return sizeStyles[size];
};

/**
 * Common text size styles
 */
export const getTextSizeStyles = (size: ComponentSize): TextStyle => {
  const sizeStyles: Record<ComponentSize, TextStyle> = {
    small: {
      fontSize: 14,
      lineHeight: 20,
    },
    medium: {
      fontSize: 16,
      lineHeight: 24,
    },
    large: {
      fontSize: 18,
      lineHeight: 28,
    },
  };

  return sizeStyles[size];
};

/**
 * Icon button size styles
 */
export const getIconButtonSizeStyles = (size: ComponentSize, theme: Theme): ViewStyle => {
  const sizeStyles: Record<ComponentSize, ViewStyle> = {
    small: {
      width: 32,
      height: 32,
      padding: theme.spacing.xs,
    },
    medium: {
      width: 40,
      height: 40,
      padding: theme.spacing.sm,
    },
    large: {
      width: 48,
      height: 48,
      padding: theme.spacing.md,
    },
  };

  return sizeStyles[size];
};

/**
 * Get icon size based on component size
 */
export const getIconSize = (size: ComponentSize): number => {
  const iconSizes: Record<ComponentSize, number> = {
    small: 16,
    medium: 20,
    large: 24,
  };

  return iconSizes[size];
};
