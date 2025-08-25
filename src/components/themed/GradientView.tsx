import React from 'react';
import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

interface GradientViewProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'warm' | 'subtle' | 'brand';
  direction?: 'vertical' | 'horizontal' | 'diagonal' | 'radial';
  style?: ViewStyle;
  intensity?: 'light' | 'medium' | 'strong';
}

const GradientView: React.FC<GradientViewProps> = ({
  children,
  variant = 'warm',
  direction = 'vertical',
  style,
  intensity = 'medium',
}) => {
  const { theme } = useTheme();

  const getGradientColors = () => {
    const alpha = intensity === 'light' ? '20' : intensity === 'strong' ? '60' : '40';

    switch (variant) {
      case 'primary':
        return [theme.colors.primary[400] + alpha, theme.colors.primary[600] + alpha];
      case 'secondary':
        return [theme.colors.secondary[400] + alpha, theme.colors.secondary[600] + alpha];
      case 'accent':
        return [theme.colors.accent[400] + alpha, theme.colors.accent[600] + alpha];
      case 'warm':
        return [theme.colors.surface[50] + 'FF', theme.colors.surface[200] + 'FF'];
      case 'subtle':
        return [theme.colors.background[50] + 'FF', theme.colors.background[100] + 'FF'];
      case 'brand':
        // Special brand gradient from sage to teal
        return [
          theme.colors.secondary[500] + alpha, // Sage
          theme.colors.primary[500] + alpha, // Teal
        ];
      default:
        return [theme.colors.surface[100] + 'FF', theme.colors.surface[200] + 'FF'];
    }
  };

  const getGradientDirection = () => {
    switch (direction) {
      case 'horizontal':
        return { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } };
      case 'diagonal':
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
      case 'radial':
        return { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } };
      case 'vertical':
      default:
        return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } };
    }
  };

  const colors = getGradientColors();
  const gradientDirection = getGradientDirection();

  return (
    <LinearGradient
      colors={colors}
      start={gradientDirection.start}
      end={gradientDirection.end}
      style={[
        {
          borderRadius: theme.borderRadius['2xl'],
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientView;
