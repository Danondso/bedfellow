import React from 'react';
import { View, ViewStyle, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../theme/types';
import ThemedText from './ThemedText';
import { themedStyles } from '../../theme/utils';

interface ThemedCardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof Theme['spacing'] | 'none';
  margin?: keyof Theme['spacing'] | 'none';
  rounded?: keyof Theme['borderRadius'];
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  variant = 'elevated',
  padding = 'md',
  margin,
  rounded = 'lg',
  onPress,
  disabled = false,
  children,
  style,
}) => {
  const { theme } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface[400],
          ...theme.shadows.base,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface[300],
          borderWidth: 1,
          borderColor: theme.colors.border[400],
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.surface[500],
        };
      default:
        return {};
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: theme.borderRadius[rounded],
    overflow: 'hidden',
    ...getVariantStyle(),
    ...(padding !== 'none' ? { padding: theme.spacing[padding] } : {}),
    ...(margin ? { margin: theme.spacing[margin] } : {}),
    ...(disabled ? { opacity: 0.6 } : {}),
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} disabled={disabled} onPress={onPress} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

// Card Header component
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, avatar, action, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
        },
        style,
      ]}
    >
      {avatar && <View style={{ marginRight: theme.spacing.md }}>{avatar}</View>}
      <View style={{ flex: 1 }}>
        <ThemedText variant="h6" weight="semibold">
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText variant="bodySmall" color="muted">
            {subtitle}
          </ThemedText>
        )}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
};

// Card Content component
interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          paddingVertical: theme.spacing.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Card Actions component
interface CardActionsProps {
  children: React.ReactNode;
  alignment?: 'left' | 'right' | 'center' | 'space-between';
  style?: ViewStyle;
}

export const CardActions: React.FC<CardActionsProps> = ({ children, alignment = 'right', style }) => {
  const { theme } = useTheme();

  const getAlignmentStyle = (): ViewStyle => {
    switch (alignment) {
      case 'left':
        return { justifyContent: 'flex-start' };
      case 'center':
        return { justifyContent: 'center' };
      case 'space-between':
        return { justifyContent: 'space-between' };
      case 'right':
      default:
        return { justifyContent: 'flex-end' };
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: theme.spacing.md,
          gap: theme.spacing.sm,
          ...getAlignmentStyle(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Card Media component
interface CardMediaProps {
  source: ImageSourcePropType;
  height?: number;
  aspectRatio?: number;
  overlay?: React.ReactNode;
  style?: ViewStyle;
}

export const CardMedia: React.FC<CardMediaProps> = ({ source, height = 200, aspectRatio, overlay, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          overflow: 'hidden',
          backgroundColor: theme.colors.surface[200],
          ...(aspectRatio ? { aspectRatio } : { height }),
        },
        style,
      ]}
    >
      <Image
        source={source}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
      {overlay && (
        <View
          style={{
            ...themedStyles.fillParent,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'flex-end',
            padding: theme.spacing.md,
          }}
        >
          {overlay}
        </View>
      )}
    </View>
  );
};

// List Card component for list items
interface ListCardProps extends ThemedCardProps {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
}

export const ListCard: React.FC<ListCardProps> = ({ leading, title, subtitle, trailing, onPress, ...cardProps }) => {
  const { theme } = useTheme();

  return (
    <ThemedCard onPress={onPress} padding="md" {...cardProps}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leading && <View style={{ marginRight: theme.spacing.md }}>{leading}</View>}
        <View style={{ flex: 1 }}>
          <ThemedText variant="body" weight="medium">
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText variant="bodySmall" color="muted">
              {subtitle}
            </ThemedText>
          )}
        </View>
        {trailing && <View style={{ marginLeft: theme.spacing.md }}>{trailing}</View>}
      </View>
    </ThemedCard>
  );
};

// Stat Card component
interface StatCardProps extends ThemedCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  ...cardProps
}) => {
  const { theme } = useTheme();

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'muted';
    }
  };

  return (
    <ThemedCard variant="filled" padding="md" {...cardProps}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <ThemedText variant="caption" color="muted" uppercase>
            {label}
          </ThemedText>
          <ThemedText variant="h3" weight="bold" style={{ marginVertical: theme.spacing.xs }}>
            {value}
          </ThemedText>
          {change && (
            <ThemedText variant="bodySmall" color={getChangeColor()}>
              {change}
            </ThemedText>
          )}
        </View>
        {icon && <View style={{ marginLeft: theme.spacing.md }}>{icon}</View>}
      </View>
    </ThemedCard>
  );
};

export default ThemedCard;
