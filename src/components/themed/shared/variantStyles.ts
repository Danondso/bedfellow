import { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../../theme/types';

/**
 * Generic variant style generator
 */
export const createVariantStyles = <T extends string, S extends ViewStyle | TextStyle>(
  variants: Record<T, (theme: Theme, states?: ComponentStates) => S>,
  theme: Theme,
  variant: T,
  states?: ComponentStates
): S => {
  const variantFunction = variants[variant];
  if (!variantFunction) {
    throw new Error(`Unknown variant: ${variant}`);
  }
  return variantFunction(theme, states);
};

export interface ComponentStates {
  isPressed?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isFocused?: boolean;
  isActive?: boolean;
}

/**
 * Common variant definitions for reuse across components
 */
export const commonButtonVariants = {
  primary: (theme: Theme, states?: ComponentStates): ViewStyle => ({
    backgroundColor: states?.isDisabled
      ? theme.colors.primary[300]
      : states?.isPressed
        ? theme.colors.primary[700]
        : theme.colors.primary[500],
  }),
  secondary: (theme: Theme, states?: ComponentStates): ViewStyle => ({
    backgroundColor: states?.isDisabled
      ? theme.colors.secondary[300]
      : states?.isPressed
        ? theme.colors.secondary[700]
        : theme.colors.secondary[500],
  }),
  accent: (theme: Theme, states?: ComponentStates): ViewStyle => ({
    backgroundColor: states?.isDisabled
      ? theme.colors.accent[300]
      : states?.isPressed
        ? theme.colors.accent[700]
        : theme.colors.accent[500],
  }),
  ghost: (theme: Theme, states?: ComponentStates): ViewStyle => ({
    backgroundColor: states?.isPressed
      ? `${theme.colors.primary[500]}10` // 10% opacity
      : 'transparent',
  }),
  outline: (theme: Theme, states?: ComponentStates): ViewStyle => ({
    backgroundColor: states?.isPressed
      ? `${theme.colors.primary[500]}05` // 5% opacity
      : 'transparent',
    borderWidth: 1,
    borderColor: states?.isDisabled ? theme.colors.border[300] : theme.colors.primary[500],
  }),
  danger: (theme: Theme, states?: ComponentStates): ViewStyle => ({
    backgroundColor: states?.isDisabled
      ? theme.colors.error[300]
      : states?.isPressed
        ? theme.colors.error[700]
        : theme.colors.error[500],
  }),
  success: (theme: Theme, states?: ComponentStates): ViewStyle => ({
    backgroundColor: states?.isDisabled
      ? theme.colors.success[300]
      : states?.isPressed
        ? theme.colors.success[700]
        : theme.colors.success[500],
  }),
};

export const commonCardVariants = {
  elevated: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.surface[100],
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }),
  outlined: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.surface[100],
    borderWidth: 1,
    borderColor: theme.colors.border[200],
  }),
  filled: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.surface[200],
  }),
};

export const commonViewVariants = {
  default: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.background[500],
  }),
  surface: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.surface[500],
  }),
  card: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.surface[400],
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.base,
  }),
  modal: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.surface[300],
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.xl,
  }),
  transparent: (): ViewStyle => ({
    backgroundColor: 'transparent',
  }),
};
