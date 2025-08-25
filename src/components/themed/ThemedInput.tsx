import React, { useState, useRef } from 'react';
import { TextInput, TextInputProps, View, ViewStyle, TextStyle, Animated, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from './ThemedText';

interface ThemedInputProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  variant?: 'filled' | 'outlined' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  error?: boolean;
  errorText?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  variant = 'minimal',
  size = 'medium',
  fullWidth = false,
  error = false,
  errorText,
  label,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  disabled = false,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderWidth = useRef(new Animated.Value(1)).current;
  const borderColor = useRef(new Animated.Value(0)).current;

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(borderWidth, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderColor, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    props.onFocus?.(e);
  };

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(borderWidth, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    props.onBlur?.(e);
  };

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          fontSize: theme.typography.sm,
          borderRadius: theme.borderRadius['2xl'], // Rounded for warm aesthetic
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          fontSize: theme.typography.lg,
          borderRadius: theme.borderRadius['3xl'], // Extra rounded for warm aesthetic
        };
      case 'medium':
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.typography.base,
          borderRadius: theme.borderRadius['2xl'], // Rounded for warm aesthetic
        };
    }
  };

  // Get variant-based styles
  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      backgroundColor: 'transparent',
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: disabled ? theme.colors.surface[200] : theme.colors.surface[100], // Warm sand background
          borderWidth: 0,
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: error
            ? theme.colors.error[500]
            : isFocused
              ? theme.colors.primary[500]
              : theme.colors.border[300],
        };
      case 'minimal':
      default:
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: error
            ? theme.colors.error[400]
            : isFocused
              ? theme.colors.primary[400]
              : theme.colors.border[200], // Softer border for minimal style
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? theme.colors.error[400] : theme.colors.border[200],
      error ? theme.colors.error[500] : theme.colors.primary[500],
    ],
  });

  const containerViewStyle: ViewStyle = {
    width: fullWidth ? '100%' : undefined,
    ...containerStyle,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    ...sizeStyles,
    ...variantStyles,
    opacity: disabled ? 0.6 : 1,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    color: theme.colors.text[900],
    fontSize: sizeStyles.fontSize,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: undefined,
    }),
    padding: 0, // Reset default padding
    ...inputStyle,
  };

  return (
    <View style={containerViewStyle}>
      {label && (
        <ThemedText variant="label" color={error ? 'error' : 'text'} style={{ marginBottom: theme.spacing.xs }}>
          {label}
        </ThemedText>
      )}

      <Animated.View
        style={[
          inputContainerStyle,
          variant === 'minimal' && {
            borderColor: animatedBorderColor,
            borderWidth: borderWidth,
          },
        ]}
      >
        {leftIcon && <View style={{ marginRight: theme.spacing.sm }}>{leftIcon}</View>}

        <TextInput
          {...props}
          style={textInputStyle}
          placeholderTextColor={theme.colors.text[500]} // Darker placeholder for readability
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {rightIcon && <View style={{ marginLeft: theme.spacing.sm }}>{rightIcon}</View>}
      </Animated.View>

      {(helperText || errorText) && (
        <ThemedText variant="caption" color={error ? 'error' : 'muted'} style={{ marginTop: theme.spacing.xs }}>
          {errorText || helperText}
        </ThemedText>
      )}
    </View>
  );
};

// Specialized input components
export const ThemedSearchInput: React.FC<ThemedInputProps> = (props) => {
  return (
    <ThemedInput
      variant="minimal"
      placeholder="Search..."
      leftIcon={
        <ThemedText color="muted" style={{ fontSize: 16 }}>
          🔍
        </ThemedText>
      }
      {...props}
    />
  );
};

export const ThemedPasswordInput: React.FC<ThemedInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ThemedInput
      secureTextEntry={!showPassword}
      rightIcon={
        <ThemedText color="muted" style={{ fontSize: 16 }} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </ThemedText>
      }
      {...props}
    />
  );
};

export const ThemedEmailInput: React.FC<ThemedInputProps> = (props) => {
  return <ThemedInput keyboardType="email-address" autoCapitalize="none" autoCorrect={false} {...props} />;
};

export const ThemedNumberInput: React.FC<ThemedInputProps> = (props) => {
  return <ThemedInput keyboardType="numeric" {...props} />;
};

export const ThemedMultilineInput: React.FC<ThemedInputProps> = (props) => {
  const { theme } = useTheme();

  return (
    <ThemedInput
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      inputStyle={{
        minHeight: 100,
        paddingTop: theme.spacing.sm,
      }}
      {...props}
    />
  );
};

export default ThemedInput;
