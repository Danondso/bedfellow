import React from 'react';
import { Text, TextProps, TextStyle, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../theme/types';
import { typography } from '../../theme/scales';

interface ThemedTextProps extends TextProps {
  variant?:
    | 'display'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'bodyLarge'
    | 'bodySmall'
    | 'caption'
    | 'label'
    | 'button';
  color?: 'primary' | 'secondary' | 'accent' | 'error' | 'warning' | 'success' | 'info' | 'text' | 'muted' | 'inverse';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  size?: keyof Theme['typography'];
  shade?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  selectable?: boolean;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color = 'text',
  weight,
  align,
  size,
  shade = 500,
  italic,
  underline,
  strikethrough,
  uppercase,
  lowercase,
  capitalize,
  lineHeight,
  letterSpacing,
  selectable = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // Get typography style based on variant
  const getVariantStyle = (): TextStyle => {
    if (size) {
      // If size is explicitly provided, use it
      return {
        fontSize: theme.typography[size],
        lineHeight: theme.typography[size] * 1.5,
      };
    }

    // Otherwise use the predefined variant styles
    return typography[variant] || typography.body;
  };

  // Get color based on color prop
  const getTextColor = (): string => {
    switch (color) {
      case 'primary':
        return theme.colors.primary[shade];
      case 'secondary':
        return theme.colors.secondary[shade];
      case 'accent':
        return theme.colors.accent[shade];
      case 'error':
        return theme.colors.error[shade];
      case 'warning':
        return theme.colors.warning[shade];
      case 'success':
        return theme.colors.success[shade];
      case 'info':
        return theme.colors.info[shade];
      case 'muted':
        return theme.colors.text[300];
      case 'inverse':
        return theme.mode === 'dark' ? theme.colors.text[100] : theme.colors.text[900];
      case 'text':
      default:
        return theme.colors.text[shade];
    }
  };

  // Get font weight
  const getFontWeight = (): TextStyle['fontWeight'] => {
    if (weight) {
      switch (weight) {
        case 'normal':
          return '400';
        case 'medium':
          return '500';
        case 'semibold':
          return '600';
        case 'bold':
          return '700';
        default:
          return '400';
      }
    }

    // Use variant's default weight if not specified
    const variantStyle = getVariantStyle();
    return variantStyle.fontWeight || '400';
  };

  // Get text decoration
  const getTextDecoration = (): TextStyle['textDecorationLine'] => {
    const decorations: string[] = [];
    if (underline) decorations.push('underline');
    if (strikethrough) decorations.push('line-through');

    if (decorations.length === 0) return 'none';
    if (decorations.length === 1) return decorations[0] as TextStyle['textDecorationLine'];
    return decorations.join(' ') as TextStyle['textDecorationLine'];
  };

  // Get text transform
  const getTextTransform = (): TextStyle['textTransform'] => {
    if (uppercase) return 'uppercase';
    if (lowercase) return 'lowercase';
    if (capitalize) return 'capitalize';
    return undefined;
  };

  const computedStyle: TextStyle = {
    ...getVariantStyle(),
    color: getTextColor(),
    fontWeight: getFontWeight(),
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
    textDecorationLine: getTextDecoration(),
    textTransform: getTextTransform(),
    ...(lineHeight !== undefined ? { lineHeight } : {}),
    ...(letterSpacing !== undefined ? { letterSpacing } : {}),
    ...(Platform.OS === 'ios' && selectable === false ? { userSelect: 'none' } : {}),
  };

  return (
    <Text style={[computedStyle, style]} selectable={selectable} {...props}>
      {children}
    </Text>
  );
};

// Specialized text components for common use cases
export const ThemedHeading: React.FC<ThemedTextProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }> = ({
  level = 1,
  ...props
}) => {
  const variant = `h${level}` as ThemedTextProps['variant'];
  return <ThemedText variant={variant} {...props} />;
};

export const ThemedTitle: React.FC<ThemedTextProps> = (props) => <ThemedText variant="h1" weight="bold" {...props} />;

export const ThemedSubtitle: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="h3" color="muted" {...props} />
);

export const ThemedParagraph: React.FC<ThemedTextProps> = (props) => <ThemedText variant="body" {...props} />;

export const ThemedCaption: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="caption" color="muted" {...props} />
);

export const ThemedLabel: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="label" weight="medium" {...props} />
);

export const ThemedButtonText: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="button" weight="semibold" uppercase {...props} />
);

export const ThemedErrorText: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="bodySmall" color="error" {...props} />
);

export const ThemedSuccessText: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="bodySmall" color="success" {...props} />
);

export const ThemedWarningText: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="bodySmall" color="warning" {...props} />
);

export const ThemedInfoText: React.FC<ThemedTextProps> = (props) => (
  <ThemedText variant="bodySmall" color="info" {...props} />
);

// Link component
interface ThemedLinkProps extends ThemedTextProps {
  onPress?: () => void;
  disabled?: boolean;
}

export const ThemedLink: React.FC<ThemedLinkProps> = ({ disabled = false, onPress, ...props }) => {
  return (
    <ThemedText
      color={disabled ? 'muted' : 'primary'}
      underline={!disabled}
      onPress={disabled ? undefined : onPress}
      {...props}
    />
  );
};

// Code/Monospace text
export const ThemedCode: React.FC<ThemedTextProps> = (props) => {
  const { theme } = useTheme();
  const { style, ...restProps } = props;

  return (
    <ThemedText
      style={[
        {
          fontFamily: Platform.select({
            ios: 'Menlo',
            android: 'monospace',
            default: 'monospace',
          }),
          backgroundColor: theme.colors.surface[300],
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: theme.spacing.xs / 2,
          borderRadius: theme.borderRadius.sm,
        },
        style,
      ]}
      {...restProps}
    />
  );
};

export default ThemedText;
