import React, { useRef } from 'react';
import { TouchableOpacity, View, ViewStyle, TextStyle, Animated, GestureResponderEvent } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from './ThemedText';

interface ThemedChipProps {
  label: string;
  variant?: 'filled' | 'outlined' | 'soft';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  closeIcon?: React.ReactNode;
  onPress?: () => void;
  onClose?: () => void;
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ThemedChip: React.FC<ThemedChipProps> = ({
  label,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  closeIcon,
  onPress,
  onClose,
  selected = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && (onPress || onClose)) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        friction: 4,
        tension: 350,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && (onPress || onClose)) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 350,
      }).start();
    }
  };

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs / 2,
          paddingHorizontal: theme.spacing.sm,
          fontSize: theme.typography.xs,
          iconSize: 12,
          height: 24,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          fontSize: theme.typography.base,
          iconSize: 18,
          height: 40,
        };
      case 'medium':
      default:
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.typography.sm,
          iconSize: 14,
          height: 32,
        };
    }
  };

  // Get color values based on variant and color prop
  const getColorStyles = () => {
    const colorMap = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.info,
      neutral: theme.colors.surface,
    };

    const baseColor = colorMap[color] || theme.colors.primary;

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: disabled ? baseColor[200] : selected ? baseColor[600] : baseColor[500],
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: color === 'neutral' ? theme.colors.text[700] : theme.colors.text[50],
        };

      case 'outlined':
        return {
          backgroundColor: selected ? `${baseColor[500]}15` : 'transparent',
          borderColor: disabled ? baseColor[300] : baseColor[500],
          borderWidth: 1,
          textColor: disabled ? baseColor[400] : baseColor[600],
        };

      case 'soft':
        return {
          backgroundColor: disabled ? `${baseColor[300]}20` : selected ? `${baseColor[500]}30` : `${baseColor[500]}15`,
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: disabled ? baseColor[400] : baseColor[700],
        };

      default:
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: theme.colors.text[700],
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const colorStyles = getColorStyles();

  const chipStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full, // Pill-shaped for warm aesthetic
    height: sizeStyles.height,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    backgroundColor: colorStyles.backgroundColor,
    borderColor: colorStyles.borderColor,
    borderWidth: colorStyles.borderWidth,
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const chipTextStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    color: colorStyles.textColor,
    fontWeight: '500',
    ...textStyle,
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && <View style={{ marginRight: theme.spacing.xs }}>{icon}</View>}

      <ThemedText style={chipTextStyle}>{label}</ThemedText>

      {icon && iconPosition === 'right' && !closeIcon && <View style={{ marginLeft: theme.spacing.xs }}>{icon}</View>}

      {closeIcon && onClose && (
        <TouchableOpacity
          onPress={(e: GestureResponderEvent) => {
            e.stopPropagation();
            onClose();
          }}
          disabled={disabled}
          style={{ marginLeft: theme.spacing.xs }}
        >
          {closeIcon}
        </TouchableOpacity>
      )}
    </>
  );

  if (onPress || onClose) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={disabled}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={chipStyle}
        >
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <View style={chipStyle}>{renderContent()}</View>;
};

// Specialized chip components
export const ThemedFilterChip: React.FC<ThemedChipProps> = (props) => {
  return (
    <ThemedChip
      variant="outlined"
      icon={props.selected ? <ThemedText style={{ fontSize: 12 }}>✓</ThemedText> : undefined}
      iconPosition="left"
      {...props}
    />
  );
};

export const ThemedChoiceChip: React.FC<ThemedChipProps> = (props) => {
  return <ThemedChip variant={props.selected ? 'filled' : 'outlined'} {...props} />;
};

export const ThemedActionChip: React.FC<ThemedChipProps> = (props) => {
  return <ThemedChip variant="soft" {...props} />;
};

export const ThemedInputChip: React.FC<ThemedChipProps> = (props) => {
  return (
    <ThemedChip
      variant="filled"
      closeIcon={<ThemedText style={{ fontSize: 14, color: 'inherit' }}>×</ThemedText>}
      {...props}
    />
  );
};

// Chip group component for managing multiple chips
interface ThemedChipGroupProps {
  children: React.ReactNode;
  spacing?: 'small' | 'medium' | 'large';
  wrap?: boolean;
  style?: ViewStyle;
}

export const ThemedChipGroup: React.FC<ThemedChipGroupProps> = ({
  children,
  spacing = 'medium',
  wrap = true,
  style,
}) => {
  const { theme } = useTheme();

  const getSpacing = () => {
    switch (spacing) {
      case 'small':
        return theme.spacing.xs;
      case 'large':
        return theme.spacing.lg;
      case 'medium':
      default:
        return theme.spacing.sm;
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: getSpacing(),
    ...style,
  };

  return <View style={containerStyle}>{children}</View>;
};

export default ThemedChip;
