import React, { useEffect, useRef, ReactNode } from 'react';
import { Animated, ViewStyle, Platform, Easing, View } from 'react-native';
import { useTheme } from './index';

interface ThemeTransitionProps {
  children: ReactNode;
  duration?: number;
  style?: ViewStyle;
  type?: 'fade' | 'scale' | 'slide' | 'rotate' | 'none';
  delay?: number;
}

// Component that provides smooth transitions when theme changes
export const ThemeTransition: React.FC<ThemeTransitionProps> = ({
  children,
  duration = 300,
  style,
  type = 'fade',
  delay = 0,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const previousThemeRef = useRef(theme.mode);

  useEffect(() => {
    // Only animate if the theme mode actually changed
    if (previousThemeRef.current !== theme.mode) {
      const runAnimation = () => {
        switch (type) {
          case 'fade':
            // Fade out and in
            Animated.sequence([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease),
              }),
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration / 2,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease),
              }),
            ]).start();
            break;

          case 'scale':
            // Scale down and up
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: duration / 2,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease),
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: duration / 2,
                useNativeDriver: true,
                easing: Easing.out(Easing.elastic(1)),
              }),
            ]).start();
            break;

          case 'slide':
            // Slide out and in
            Animated.sequence([
              Animated.timing(slideAnim, {
                toValue: 100,
                duration: duration / 2,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease),
              }),
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1.5)),
              }),
            ]).start();
            break;

          case 'rotate':
            // Rotate transition
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }).start(() => {
              rotateAnim.setValue(0);
            });
            break;

          case 'none':
            // No animation
            break;
        }
      };

      if (delay > 0) {
        setTimeout(runAnimation, delay);
      } else {
        runAnimation();
      }

      previousThemeRef.current = theme.mode;
    }
  }, [theme.mode, fadeAnim, scaleAnim, slideAnim, rotateAnim, duration, type, delay]);

  const getAnimatedStyle = () => {
    switch (type) {
      case 'fade':
        return { opacity: fadeAnim };
      case 'scale':
        return { transform: [{ scale: scaleAnim }] };
      case 'slide':
        return { transform: [{ translateX: slideAnim }] };
      case 'rotate':
        return {
          transform: [
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };

  return <Animated.View style={[{ flex: 1 }, getAnimatedStyle(), style]}>{children}</Animated.View>;
};

// Hook for animated theme values
export const useAnimatedThemeValue = (lightValue: any, darkValue: any, duration: number = 300) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toValue = theme.mode === 'dark' ? 1 : 0;

    Animated.timing(animatedValue, {
      toValue,
      duration,
      useNativeDriver: false, // Can't use native driver for color animations
    }).start();
  }, [theme.mode, animatedValue, duration]);

  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [lightValue, darkValue],
  });
};

// Component for smooth color transitions
interface ThemedAnimatedViewProps {
  lightStyle?: ViewStyle;
  darkStyle?: ViewStyle;
  children: ReactNode;
  duration?: number;
  easing?: (value: number) => number;
  useSpring?: boolean;
}

export const ThemedAnimatedView: React.FC<ThemedAnimatedViewProps> = ({
  lightStyle = {},
  darkStyle = {},
  children,
  duration = 300,
  easing = Easing.inOut(Easing.ease),
  useSpring = false,
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(theme.mode === 'dark' ? 1 : 0)).current;

  useEffect(() => {
    const toValue = theme.mode === 'dark' ? 1 : 0;

    if (useSpring) {
      Animated.spring(animatedValue, {
        toValue,
        tension: 40,
        friction: 7,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing,
        useNativeDriver: false,
      }).start();
    }
  }, [theme.mode, animatedValue, duration, easing, useSpring]);

  // Extract animatable properties
  const animatedStyle: any = {};

  // Handle background color
  if (lightStyle.backgroundColor && darkStyle.backgroundColor) {
    animatedStyle.backgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lightStyle.backgroundColor as string, darkStyle.backgroundColor as string],
    });
  }

  // Handle border color
  if (lightStyle.borderColor && darkStyle.borderColor) {
    animatedStyle.borderColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lightStyle.borderColor as string, darkStyle.borderColor as string],
    });
  }

  // Handle shadow color (iOS)
  if (lightStyle.shadowColor && darkStyle.shadowColor) {
    animatedStyle.shadowColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lightStyle.shadowColor as string, darkStyle.shadowColor as string],
    });
  }

  // Handle opacity
  if (lightStyle.opacity !== undefined && darkStyle.opacity !== undefined) {
    animatedStyle.opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lightStyle.opacity, darkStyle.opacity],
    });
  }

  // Combine static and animated styles
  const finalStyle = {
    ...lightStyle,
    ...(theme.mode === 'dark' ? darkStyle : {}),
    ...animatedStyle,
  };

  return <Animated.View style={finalStyle}>{children}</Animated.View>;
};

// Status bar theme transition helper
export const useStatusBarStyle = () => {
  const { theme } = useTheme();
  const [barStyle, setBarStyle] = React.useState<'light-content' | 'dark-content'>(
    theme.mode === 'dark' ? 'light-content' : 'dark-content'
  );

  useEffect(() => {
    // Delay status bar change slightly for smoother transition
    const timer = setTimeout(() => {
      setBarStyle(theme.mode === 'dark' ? 'light-content' : 'dark-content');
    }, 150);

    return () => clearTimeout(timer);
  }, [theme.mode]);

  return barStyle;
};

// Navigation bar theme transition (Android only)
export const useNavigationBarStyle = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // This would require a native module to actually change the navigation bar
      // For now, this is a placeholder for the logic
      const backgroundColor = theme.colors.background[500];
      const isLight = theme.mode === 'light';

      // Would call native module here
      // NativeModules.NavigationBar.setBackgroundColor(backgroundColor);
      // NativeModules.NavigationBar.setLightMode(isLight);
    }
  }, [theme]);
};

// Staggered theme transition for lists
interface StaggeredThemeTransitionProps {
  children: ReactNode[];
  duration?: number;
  staggerDelay?: number;
  type?: 'fade' | 'scale' | 'slide';
}

export const StaggeredThemeTransition: React.FC<StaggeredThemeTransitionProps> = ({
  children,
  duration = 300,
  staggerDelay = 50,
  type = 'fade',
}) => {
  const { theme } = useTheme();
  const previousThemeRef = useRef(theme.mode);
  const animatedValues = useRef(React.Children.map(children, () => new Animated.Value(1)) || []).current;

  useEffect(() => {
    if (previousThemeRef.current !== theme.mode) {
      const animations = animatedValues.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * staggerDelay),
          Animated.timing(anim, {
            toValue: type === 'scale' ? 0.8 : 0,
            duration: duration / 2,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5)),
          }),
        ]);
      });

      Animated.parallel(animations).start();
      previousThemeRef.current = theme.mode;
    }
  }, [theme.mode, animatedValues, duration, staggerDelay, type]);

  return (
    <>
      {React.Children.map(children, (child, index) => (
        <Animated.View
          key={index}
          style={{
            opacity: type === 'fade' ? animatedValues[index] : 1,
            transform: type === 'scale' ? [{ scale: animatedValues[index] }] : [],
          }}
        >
          {child}
        </Animated.View>
      ))}
    </>
  );
};

// Parallax theme transition
interface ParallaxThemeTransitionProps {
  children: ReactNode;
  backgroundChildren?: ReactNode;
  foregroundChildren?: ReactNode;
  duration?: number;
}

export const ParallaxThemeTransition: React.FC<ParallaxThemeTransitionProps> = ({
  children,
  backgroundChildren,
  foregroundChildren,
  duration = 400,
}) => {
  const { theme } = useTheme();
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const foregroundAnim = useRef(new Animated.Value(0)).current;
  const previousThemeRef = useRef(theme.mode);

  useEffect(() => {
    if (previousThemeRef.current !== theme.mode) {
      Animated.parallel([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: duration * 1.2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(foregroundAnim, {
          toValue: 1,
          duration: duration * 0.8,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start(() => {
        backgroundAnim.setValue(0);
        foregroundAnim.setValue(0);
      });

      previousThemeRef.current = theme.mode;
    }
  }, [theme.mode, backgroundAnim, foregroundAnim, duration]);

  return (
    <View style={{ flex: 1 }}>
      {backgroundChildren && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [
              {
                translateY: backgroundAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          }}
        >
          {backgroundChildren}
        </Animated.View>
      )}

      <View style={{ flex: 1 }}>{children}</View>

      {foregroundChildren && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [
              {
                translateY: foregroundAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              },
            ],
          }}
        >
          {foregroundChildren}
        </Animated.View>
      )}
    </View>
  );
};

// Hook for theme-aware animations
export const useThemeAnimation = (
  lightValue: number,
  darkValue: number,
  options: {
    duration?: number;
    easing?: (value: number) => number;
    useNativeDriver?: boolean;
  } = {}
) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(theme.mode === 'dark' ? darkValue : lightValue)).current;

  useEffect(() => {
    const toValue = theme.mode === 'dark' ? darkValue : lightValue;

    Animated.timing(animatedValue, {
      toValue,
      duration: options.duration || 300,
      easing: options.easing || Easing.inOut(Easing.ease),
      useNativeDriver: options.useNativeDriver !== false,
    }).start();
  }, [theme.mode, lightValue, darkValue, options.duration, options.easing, options.useNativeDriver]);

  return animatedValue;
};

// Cross-fade transition component
interface CrossFadeThemeTransitionProps {
  lightContent: ReactNode;
  darkContent: ReactNode;
  duration?: number;
}

export const CrossFadeThemeTransition: React.FC<CrossFadeThemeTransitionProps> = ({
  lightContent,
  darkContent,
  duration = 300,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(theme.mode === 'dark' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: theme.mode === 'dark' ? 0 : 1,
      duration,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [theme.mode, fadeAnim, duration]);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fadeAnim,
        }}
      >
        {lightContent}
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }}
      >
        {darkContent}
      </Animated.View>
    </View>
  );
};

export default ThemeTransition;
