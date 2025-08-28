import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, ViewStyle } from 'react-native';
import Icon, { type IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../context/ThemeContext';

interface FloatingActionButtonProps {
  icon: IoniconsIconName;
  onPress: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  style?: any;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  position = 'top-right',
  color,
  backgroundColor,
  size = 'medium',
  animated = true,
  style,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [animated, scaleAnim, rotateAnim]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: theme.spacing.xl + theme.spacing.sm, // 40 = 32 + 8
          height: theme.spacing.xl + theme.spacing.sm, // 40 = 32 + 8
          iconSize: theme.spacing.md + theme.spacing.xs / 2, // 18 = 16 + 2
        };
      case 'large':
        return {
          width: theme.spacing.xxl + theme.spacing.sm, // 56 = 48 + 8
          height: theme.spacing.xxl + theme.spacing.sm, // 56 = 48 + 8
          iconSize: theme.spacing.lg + theme.spacing.xs / 2, // 26 = 24 + 2
        };
      case 'medium':
      default:
        return {
          width: theme.spacing.xxl, // 48
          height: theme.spacing.xxl, // 48
          iconSize: theme.spacing.lg - theme.spacing.xs / 2, // 22 = 24 - 2
        };
    }
  };

  const getPositionStyles = (): ViewStyle => {
    const basePosition = {
      position: 'absolute' as const,
      zIndex: 1000,
    };

    switch (position) {
      case 'top-left':
        return {
          ...basePosition,
          top: theme.spacing.xl, // Adjusted for better positioning
          left: theme.spacing.xl,
        };
      case 'top-right':
        return {
          ...basePosition,
          top: theme.spacing.xl, // Adjusted for better positioning
          right: theme.spacing.xl,
        };
      case 'bottom-left':
        return {
          ...basePosition,
          bottom: theme.spacing.fabOffset, // 120px offset for proper positioning
          left: theme.spacing.xl,
        };
      case 'bottom-right':
        return {
          ...basePosition,
          bottom: theme.spacing.fabOffset, // 120px offset for proper positioning
          right: theme.spacing.xl,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const positionStyles = getPositionStyles();

  const styles = StyleSheet.create({
    button: {
      ...positionStyles,
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: theme.borderRadius.full,
      backgroundColor: backgroundColor || theme.colors.surface[100],
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border[100],
      // Warm elevated shadow
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.14)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
      ...style, // Apply custom styles
    } as ViewStyle,
    pressed: {
      transform: [{ scale: 0.95 }],
    } as ViewStyle,
  });

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.button,
        {
          transform: [{ scale: scaleAnim }, { rotate: animated ? spin : '0deg' }],
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon name={icon} size={sizeStyles.iconSize} color={color || theme.colors.primary[600]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FloatingActionButton;
