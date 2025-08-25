import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import OwlMascot from './OwlMascot';

interface AnimatedOwlProps {
  size?: number;
  variant?: 'default' | 'sleeping' | 'winking' | 'happy' | 'outlined';
  style?: ViewStyle;
  animationType?: 'bounce' | 'rotate' | 'pulse' | 'float';
  duration?: number;
  animated?: boolean;
}

const AnimatedOwl: React.FC<AnimatedOwlProps> = ({
  size = 120,
  variant = 'default',
  style,
  animationType = 'bounce',
  duration = 1000,
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const createAnimation = () => {
      switch (animationType) {
        case 'bounce':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: duration / 2,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: duration / 2,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
              }),
            ])
          );

        case 'rotate':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: duration / 4,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: -1,
                duration: duration / 2,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: duration / 4,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
            ])
          );

        case 'pulse':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: duration / 2,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: duration / 2,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          );

        case 'float':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: duration,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: duration,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
            ])
          );

        default:
          return null;
      }
    };

    const animation = createAnimation();
    if (animation) {
      animation.start();
    }

    return () => {
      animatedValue.setValue(0);
    };
  }, [animationType, duration, animatedValue]);

  const getTransform = () => {
    switch (animationType) {
      case 'bounce':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        };

      case 'rotate':
        return {
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: ['-10deg', '0deg', '10deg'],
              }),
            },
          ],
        };

      case 'pulse':
        return {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
          ],
        };

      case 'float':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              }),
            },
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 3, 0],
              }),
            },
          ],
        };

      default:
        return {};
    }
  };

  return (
    <Animated.View style={[style, animated ? getTransform() : {}]}>
      <OwlMascot size={size} variant={variant} animated={animated} />
    </Animated.View>
  );
};

export default AnimatedOwl;
