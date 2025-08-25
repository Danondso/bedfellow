import React, { useRef } from 'react';
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
import { useComponentState, getButtonSizeStyles, getIconButtonSizeStyles, addAlpha, ComponentStates } from './shared';
import LinearGradient from 'react-native-linear-gradient';

interface ThemedButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'outline'
    | 'sage-outline'
    | 'danger'
    | 'success'
    | 'gradient'
    | 'spotify';
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
  gradient?: { colors: string[]; start?: { x: number; y: number }; end?: { x: number; y: number } };
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  style,
  textStyle,
  ripple = true,
  gradient,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const { theme } = useTheme();
  const { isPressed, isDisabled, handlers } = useComponentState(disabled, loading);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Handle press animations with shared state
  const handlePressIn = (event: GestureResponderEvent) => {
    handlers.onPressIn();
    if (ripple && !isDisabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.98, // More subtle scale for warm aesthetic
        useNativeDriver: true,
        friction: 4, // Softer spring
        tension: 350, // Gentler animation
      }).start();
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    handlers.onPressOut();
    if (ripple && !isDisabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4, // Match press in animation
        tension: 350,
      }).start();
    }
    onPressOut?.(event);
  };

  // Use shared size styles
  const buttonSizeStyles = getButtonSizeStyles(size, theme);
  const textSizeStyles: TextStyle = {
    fontSize: size === 'small' ? theme.typography.sm : size === 'large' ? theme.typography.lg : theme.typography.base,
  };

  // Get variant styles
  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    const states: ComponentStates = { isPressed, isDisabled };

    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: states.isDisabled
              ? theme.colors.primary[300]
              : states.isPressed
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
            backgroundColor: states.isDisabled
              ? theme.colors.secondary[300]
              : states.isPressed
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
            backgroundColor: states.isDisabled
              ? theme.colors.accent[300]
              : states.isPressed
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
            backgroundColor: states.isPressed ? addAlpha(theme.colors.primary[500], 0.1) : 'transparent',
          },
          text: {
            color: states.isDisabled ? theme.colors.text[500] : theme.colors.primary[500], // Darker disabled text
          },
        };

      case 'outline':
        return {
          button: {
            backgroundColor: states.isPressed ? addAlpha(theme.colors.primary[500], 0.05) : 'transparent',
            borderWidth: 1,
            borderColor: states.isDisabled ? theme.colors.border[300] : theme.colors.primary[500],
          },
          text: {
            color: states.isDisabled ? theme.colors.text[500] : theme.colors.primary[500], // Darker disabled text
          },
        };

      case 'sage-outline':
        return {
          button: {
            backgroundColor: states.isPressed ? addAlpha(theme.colors.secondary[500], 0.05) : 'transparent',
            borderWidth: 1,
            borderColor: states.isDisabled ? theme.colors.border[300] : theme.colors.secondary[500],
          },
          text: {
            color: states.isDisabled ? theme.colors.text[500] : theme.colors.secondary[600], // Darker disabled text
          },
        };

      case 'danger':
        return {
          button: {
            backgroundColor: states.isDisabled
              ? theme.colors.error[300]
              : states.isPressed
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
            backgroundColor: states.isDisabled
              ? theme.colors.success[300]
              : states.isPressed
                ? theme.colors.success[600]
                : theme.colors.success[500],
          },
          text: {
            color: theme.colors.text[50],
          },
        };
      case 'gradient':
        return {
          button: {
            backgroundColor: 'transparent', // Background will be handled by LinearGradient
          },
          text: {
            color: theme.colors.text[50],
          },
        };
      case 'spotify':
        return {
          button: {
            backgroundColor: states.isDisabled ? '#1DB95466' : '#1DB954', // Spotify Green
            borderWidth: 0,
          },
          text: {
            color: '#FFFFFF',
          },
        };

      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const variantStyles = getVariantStyles();

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full, // Always use full border radius for warm aesthetic
    ...buttonSizeStyles,
    ...variantStyles.button,
    ...(fullWidth ? { width: '100%' } : {}),
    ...style,
  };

  const textStyles: TextStyle = {
    ...textSizeStyles,
    ...variantStyles.text,
    fontWeight: '600',
    ...textStyle,
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator size={size === 'small' ? 'small' : 'small'} color={variantStyles.text.color} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={{ marginRight: theme.spacing.xs }}>{icon}</View>}
          {typeof children === 'string' ? <ThemedText style={textStyles}>{children}</ThemedText> : children}
          {icon && iconPosition === 'right' && <View style={{ marginLeft: theme.spacing.xs }}>{icon}</View>}
        </>
      )}
    </>
  );

  // Use gradient for gradient variant or when gradient prop is provided
  const shouldUseGradient = variant === 'gradient' || gradient;
  const gradientColors = gradient?.colors || [
    theme.colors.secondary[500], // Sage
    theme.colors.primary[500], // Teal
  ];
  const gradientStart = gradient?.start || { x: 0, y: 0 };
  const gradientEnd = gradient?.end || { x: 1, y: 1 };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={shouldUseGradient ? {} : buttonStyle}
        {...props}
      >
        {shouldUseGradient ? (
          <LinearGradient
            colors={isDisabled ? [theme.colors.surface[300], theme.colors.surface[400]] : gradientColors}
            start={gradientStart}
            end={gradientEnd}
            style={buttonStyle}
          >
            {buttonContent}
          </LinearGradient>
        ) : (
          buttonContent
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

  const iconButtonStyles = getIconButtonSizeStyles(size, theme);

  return (
    <ThemedButton variant={variant} size={size} rounded style={{ ...iconButtonStyles, ...style }} {...props}>
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
