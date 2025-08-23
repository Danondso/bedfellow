import React, { useState, useRef } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  GestureResponderEvent,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from './ThemedText';
import { addAlpha } from '../../theme/utils';

interface ThemedButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  rounded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  ripple?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  rounded = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  style,
  textStyle,
  ripple = true,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Handle press animations
  const handlePressIn = (event: GestureResponderEvent) => {
    setIsPressed(true);
    if (ripple && !disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    setIsPressed(false);
    if (ripple && !disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    onPressOut?.(event);
  };

  // Get button size styles
  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          button: {
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            minHeight: 32,
          },
          text: {
            fontSize: theme.typography.sm,
          },
        };
      case 'large':
        return {
          button: {
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            minHeight: 56,
          },
          text: {
            fontSize: theme.typography.lg,
          },
        };
      case 'medium':
      default:
        return {
          button: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            minHeight: 44,
          },
          text: {
            fontSize: theme.typography.base,
          },
        };
    }
  };

  // Get variant styles
  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    const isDisabled = disabled || loading;

    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: isDisabled
              ? theme.colors.primary[300]
              : isPressed
                ? theme.colors.primary[600]
                : theme.colors.primary[500],
          },
          text: {
            color: theme.mode === 'dark' ? theme.colors.text[900] : theme.colors.text[50],
          },
        };

      case 'secondary':
        return {
          button: {
            backgroundColor: isDisabled
              ? theme.colors.secondary[300]
              : isPressed
                ? theme.colors.secondary[600]
                : theme.colors.secondary[500],
          },
          text: {
            color: theme.mode === 'dark' ? theme.colors.text[900] : theme.colors.text[50],
          },
        };

      case 'accent':
        return {
          button: {
            backgroundColor: isDisabled
              ? theme.colors.accent[300]
              : isPressed
                ? theme.colors.accent[600]
                : theme.colors.accent[500],
          },
          text: {
            color: theme.mode === 'dark' ? theme.colors.text[900] : theme.colors.text[50],
          },
        };

      case 'ghost':
        return {
          button: {
            backgroundColor: isPressed ? addAlpha(theme.colors.primary[500], 0.1) : 'transparent',
          },
          text: {
            color: isDisabled ? theme.colors.text[400] : theme.colors.primary[500],
          },
        };

      case 'outline':
        return {
          button: {
            backgroundColor: isPressed ? addAlpha(theme.colors.primary[500], 0.05) : 'transparent',
            borderWidth: 1,
            borderColor: isDisabled ? theme.colors.border[300] : theme.colors.primary[500],
          },
          text: {
            color: isDisabled ? theme.colors.text[400] : theme.colors.primary[500],
          },
        };

      case 'danger':
        return {
          button: {
            backgroundColor: isDisabled
              ? theme.colors.error[300]
              : isPressed
                ? theme.colors.error[600]
                : theme.colors.error[500],
          },
          text: {
            color: theme.colors.text[50],
          },
        };

      case 'success':
        return {
          button: {
            backgroundColor: isDisabled
              ? theme.colors.success[300]
              : isPressed
                ? theme.colors.success[600]
                : theme.colors.success[500],
          },
          text: {
            color: theme.colors.text[50],
          },
        };

      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rounded ? 999 : theme.borderRadius.md,
    ...sizeStyles.button,
    ...variantStyles.button,
    ...(fullWidth ? { width: '100%' } : {}),
    ...style,
  };

  const textStyles: TextStyle = {
    ...sizeStyles.text,
    ...variantStyles.text,
    fontWeight: '600',
    ...textStyle,
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={buttonStyle}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size={size === 'small' ? 'small' : 'small'} color={variantStyles.text.color} />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={{ marginRight: theme.spacing.xs }}>{icon}</View>}
            {typeof children === 'string' ? <ThemedText style={textStyles}>{children}</ThemedText> : children}
            {icon && iconPosition === 'right' && <View style={{ marginLeft: theme.spacing.xs }}>{icon}</View>}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Icon button variant
interface ThemedIconButtonProps extends Omit<ThemedButtonProps, 'children' | 'fullWidth'> {
  icon: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const ThemedIconButton: React.FC<ThemedIconButtonProps> = ({
  icon,
  size = 'medium',
  variant = 'ghost',
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getIconButtonSize = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 32,
          padding: theme.spacing.xs,
        };
      case 'large':
        return {
          width: 48,
          height: 48,
          padding: theme.spacing.sm,
        };
      case 'medium':
      default:
        return {
          width: 40,
          height: 40,
          padding: theme.spacing.xs,
        };
    }
  };

  return (
    <ThemedButton variant={variant} size={size} rounded style={{ ...getIconButtonSize(), ...style }} {...props}>
      {icon}
    </ThemedButton>
  );
};

// Floating Action Button
interface ThemedFABProps extends ThemedButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  mini?: boolean;
}

export const ThemedFAB: React.FC<ThemedFABProps> = ({ position = 'bottom-right', mini = false, style, ...props }) => {
  const { theme } = useTheme();

  const getPositionStyle = (): ViewStyle => {
    const offset = theme.spacing.md;
    switch (position) {
      case 'bottom-right':
        return { position: 'absolute', bottom: offset, right: offset };
      case 'bottom-left':
        return { position: 'absolute', bottom: offset, left: offset };
      case 'top-right':
        return { position: 'absolute', top: offset, right: offset };
      case 'top-left':
        return { position: 'absolute', top: offset, left: offset };
    }
  };

  const fabStyle: ViewStyle = {
    ...getPositionStyle(),
    width: mini ? 40 : 56,
    height: mini ? 40 : 56,
    borderRadius: mini ? 20 : 28,
    ...theme.shadows.lg,
    ...style,
  };

  return <ThemedButton variant="accent" size={mini ? 'small' : 'medium'} rounded style={fabStyle} {...props} />;
};

export default ThemedButton;
