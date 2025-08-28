import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { type IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../themed/ThemedText';

interface SoftHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: IoniconsIconName;
    onPress: () => void;
    color?: string;
  };
  transparent?: boolean;
  customBackAction?: () => void;
}

const SoftHeader: React.FC<SoftHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  transparent = false,
  customBackAction,
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: insets.top + theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      backgroundColor: transparent ? 'transparent' : theme.colors.background[50],
      borderBottomWidth: transparent ? 0 : 1,
      borderBottomColor: theme.colors.border[50],
    } as ViewStyle,
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
    leftSection: {
      flex: 1,
      alignItems: 'flex-start',
    } as ViewStyle,
    centerSection: {
      flex: 3,
      alignItems: 'center',
    } as ViewStyle,
    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    } as ViewStyle,
    button: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface[100],
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border[100],
      // Soft shadow
      shadowColor: theme.colors.shadow || 'rgba(52, 57, 65, 0.08)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
    titleContainer: {
      alignItems: 'center',
    } as ViewStyle,
    title: {
      fontSize: theme.typography.xl,
      fontFamily: 'Georgia',
      fontWeight: '600',
      color: theme.colors.text[900],
      letterSpacing: -0.3,
    } as TextStyle,
    subtitle: {
      fontSize: theme.typography.sm,
      color: theme.colors.text[600],
      marginTop: theme.spacing.xs,
    } as TextStyle,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBackButton && navigation.canGoBack() && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="chevron-back-outline" size={22} color={theme.colors.primary[600]} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          {title && (
            <View style={styles.titleContainer}>
              <ThemedText style={styles.title}>{title}</ThemedText>
              {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
            </View>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightAction && (
            <TouchableOpacity
              style={styles.button}
              onPress={rightAction.onPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name={rightAction.icon} size={22} color={rightAction.color || theme.colors.primary[600]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default SoftHeader;
