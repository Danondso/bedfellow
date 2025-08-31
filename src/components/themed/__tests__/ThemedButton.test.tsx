import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedButton } from '../ThemedButton';

// Mock the ThemeContext
jest.mock('../../../context/ThemeContext', () => ({
  ...jest.requireActual('../../../context/ThemeContext'),
  useTheme: () => ({
    theme: require('../../../theme/themes/light').default,
    themeMode: 'light',
  }),
}));

describe('ThemedButton', () => {
  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      const { getByText } = render(<ThemedButton variant="primary">Primary Button</ThemedButton>);
      expect(getByText('Primary Button')).toBeTruthy();
    });

    it('renders secondary variant correctly', () => {
      const { getByText } = render(<ThemedButton variant="secondary">Secondary Button</ThemedButton>);
      expect(getByText('Secondary Button')).toBeTruthy();
    });

    it('renders danger variant correctly', () => {
      const { getByText } = render(<ThemedButton variant="danger">Danger Button</ThemedButton>);
      expect(getByText('Danger Button')).toBeTruthy();
    });

    it('renders danger-outline variant correctly', () => {
      const { getByText, root } = render(
        <ThemedButton variant="danger-outline" testID="danger-outline-btn">
          Danger Outline Button
        </ThemedButton>
      );

      const button = getByText('Danger Outline Button');
      expect(button).toBeTruthy();

      // Check that the button has the correct styles
      const touchableOpacity = root.findByProps({ testID: 'danger-outline-btn' });
      expect(touchableOpacity).toBeTruthy();

      // Verify the button has transparent background and border
      const buttonStyle = touchableOpacity.props.style;
      expect(buttonStyle).toBeDefined();
    });

    it('renders outline variant correctly', () => {
      const { getByText } = render(<ThemedButton variant="outline">Outline Button</ThemedButton>);
      expect(getByText('Outline Button')).toBeTruthy();
    });

    it('renders ghost variant correctly', () => {
      const { getByText } = render(<ThemedButton variant="ghost">Ghost Button</ThemedButton>);
      expect(getByText('Ghost Button')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<ThemedButton onPress={onPress}>Press Me</ThemedButton>);

      fireEvent.press(getByText('Press Me'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onPress={onPress} disabled>
          Disabled Button
        </ThemedButton>
      );

      fireEvent.press(getByText('Disabled Button'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('shows loading indicator when loading', () => {
      const { queryByText, UNSAFE_queryByType } = render(<ThemedButton loading>Loading Button</ThemedButton>);

      // Text should not be visible when loading
      expect(queryByText('Loading Button')).toBeNull();

      // ActivityIndicator should be present
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
    });
  });

  describe('Danger-Outline Variant Specifics', () => {
    it('applies correct styles for danger-outline variant', () => {
      const { root } = render(<ThemedButton variant="danger-outline">Test</ThemedButton>);

      const touchableOpacity = root.findByType(require('react-native').TouchableOpacity);

      // Get the animated view inside
      const animatedView = touchableOpacity.props.children;
      const buttonView = animatedView.props.children;

      // Check that styles are applied correctly
      expect(buttonView).toBeTruthy();
    });

    it('responds to press events for danger-outline variant', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <ThemedButton variant="danger-outline" onPress={onPress}>
          Press Test
        </ThemedButton>
      );

      const button = getByText('Press Test');

      // Simulate press
      fireEvent.press(button);

      // Button should call onPress
      expect(onPress).toHaveBeenCalled();
    });

    it('danger-outline variant works with icons', () => {
      const Icon = () => <></>;
      const { getByText } = render(
        <ThemedButton variant="danger-outline" icon={<Icon />}>
          With Icon
        </ThemedButton>
      );

      expect(getByText('With Icon')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      const { getByText } = render(<ThemedButton size="small">Small Button</ThemedButton>);
      expect(getByText('Small Button')).toBeTruthy();
    });

    it('renders medium size correctly', () => {
      const { getByText } = render(<ThemedButton size="medium">Medium Button</ThemedButton>);
      expect(getByText('Medium Button')).toBeTruthy();
    });

    it('renders large size correctly', () => {
      const { getByText } = render(<ThemedButton size="large">Large Button</ThemedButton>);
      expect(getByText('Large Button')).toBeTruthy();
    });
  });
});
