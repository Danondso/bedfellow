import React from 'react';
import Svg, { Circle, Ellipse, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface OwlMascotProps {
  size?: number;
  variant?: 'default' | 'sleeping' | 'winking' | 'happy' | 'outlined';
  style?: ViewStyle;
}

const OwlMascot: React.FC<OwlMascotProps> = ({ size = 120, variant = 'default', style }) => {
  const { theme } = useTheme();

  // Scale all measurements based on size
  const scale = size / 120;

  // Warm brand colors
  const primaryColor = theme.colors.primary[500]; // Teal
  const secondaryColor = theme.colors.secondary[500]; // Sage
  const accentColor = theme.colors.accent[500]; // Rust
  const sandColor = theme.colors.surface[200];
  const lightSandColor = theme.colors.surface[100];

  // For outlined variant - high contrast
  if (variant === 'outlined') {
    const strokeColor = theme.colors.text[700];
    const strokeWidth = 2;

    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <G transform={`scale(${scale})`}>
            {/* Body outline */}
            <Ellipse cx="60" cy="70" rx="35" ry="40" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />

            {/* Head outline */}
            <Circle cx="60" cy="35" r="28" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />

            {/* Ear tufts */}
            <Path
              d="M 35 25 L 30 15 L 38 20 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            <Path
              d="M 85 25 L 90 15 L 82 20 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />

            {/* Eyes - simple dots */}
            <Circle cx="48" cy="35" r="3" fill={strokeColor} />
            <Circle cx="72" cy="35" r="3" fill={strokeColor} />

            {/* Beak */}
            <Path
              d="M 60 40 L 55 45 L 60 48 L 65 45 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />

            {/* Wings */}
            <Path
              d="M 30 55 Q 25 70 30 85"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 90 55 Q 95 70 90 85"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />

            {/* Feet */}
            <Path
              d="M 45 105 L 45 115 M 45 115 L 40 118 M 45 115 L 45 118 M 45 115 L 50 118"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M 75 105 L 75 115 M 75 115 L 70 118 M 75 115 L 75 118 M 75 115 L 80 118"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </View>
    );
  }

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          {/* Gradient for body */}
          <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={secondaryColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={primaryColor} stopOpacity="1" />
          </LinearGradient>

          {/* Gradient for belly */}
          <LinearGradient id="bellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={lightSandColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={sandColor} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <G transform={`scale(${scale})`}>
          {/* Body */}
          <Ellipse cx="60" cy="70" rx="35" ry="40" fill="url(#bodyGradient)" />

          {/* Belly */}
          <Ellipse cx="60" cy="75" rx="25" ry="28" fill="url(#bellyGradient)" />

          {/* Head */}
          <Circle cx="60" cy="35" r="28" fill={primaryColor} />

          {/* Ear tufts */}
          <Path d="M 35 25 L 30 15 L 38 20 Z" fill={secondaryColor} />
          <Path d="M 85 25 L 90 15 L 82 20 Z" fill={secondaryColor} />

          {/* Eye backgrounds */}
          <Circle cx="48" cy="35" r="12" fill={lightSandColor} />
          <Circle cx="72" cy="35" r="12" fill={lightSandColor} />

          {/* Eyes based on variant */}
          {variant === 'sleeping' ? (
            <>
              <Path d="M 40 35 Q 48 38 56 35" stroke={theme.colors.text[700]} strokeWidth="2" fill="none" />
              <Path d="M 64 35 Q 72 38 80 35" stroke={theme.colors.text[700]} strokeWidth="2" fill="none" />
            </>
          ) : variant === 'winking' ? (
            <>
              <Circle cx="48" cy="35" r="6" fill={theme.colors.text[800]} />
              <Circle cx="48" cy="35" r="2" fill={lightSandColor} />
              <Path d="M 64 35 Q 72 38 80 35" stroke={theme.colors.text[700]} strokeWidth="2" fill="none" />
            </>
          ) : variant === 'happy' ? (
            <>
              <Path
                d="M 42 33 Q 48 36 54 33"
                stroke={theme.colors.text[800]}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M 66 33 Q 72 36 78 33"
                stroke={theme.colors.text[800]}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* Default eyes */}
              <Circle cx="48" cy="35" r="6" fill={theme.colors.text[800]} />
              <Circle cx="72" cy="35" r="6" fill={theme.colors.text[800]} />
              {/* Eye shine */}
              <Circle cx="50" cy="33" r="2" fill={lightSandColor} />
              <Circle cx="74" cy="33" r="2" fill={lightSandColor} />
            </>
          )}

          {/* Beak */}
          <Path d="M 60 40 L 55 45 L 60 48 L 65 45 Z" fill={accentColor} />

          {/* Wings */}
          <Ellipse cx="30" cy="70" rx="12" ry="25" fill={secondaryColor} transform="rotate(-15 30 70)" />
          <Ellipse cx="90" cy="70" rx="12" ry="25" fill={secondaryColor} transform="rotate(15 90 70)" />

          {/* Feet */}
          <Path
            d="M 45 105 L 45 115 M 45 115 L 40 118 M 45 115 L 45 118 M 45 115 L 50 118"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M 75 105 L 75 115 M 75 115 L 70 118 M 75 115 L 75 118 M 75 115 L 80 118"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Musical note (brand element) */}
          <Path
            d="M 85 50 L 85 60 M 85 50 L 90 48 L 90 58 M 85 60 Q 82 62 82 59 Q 82 56 85 60 M 90 58 Q 87 60 87 57 Q 87 54 90 58"
            stroke={theme.colors.primary[400]}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </G>
      </Svg>
    </View>
  );
};

export default OwlMascot;
