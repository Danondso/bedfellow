import { ViewStyle } from 'react-native';
import { Theme } from '../../../theme/types';

export type SpacingValue = keyof Theme['spacing'] | 'none';

/**
 * Applies spacing (padding/margin) based on theme values
 */
export const applySpacing = (
  theme: Theme,
  options: {
    padding?: SpacingValue;
    paddingHorizontal?: SpacingValue;
    paddingVertical?: SpacingValue;
    paddingTop?: SpacingValue;
    paddingBottom?: SpacingValue;
    paddingLeft?: SpacingValue;
    paddingRight?: SpacingValue;
    margin?: SpacingValue;
    marginHorizontal?: SpacingValue;
    marginVertical?: SpacingValue;
    marginTop?: SpacingValue;
    marginBottom?: SpacingValue;
    marginLeft?: SpacingValue;
    marginRight?: SpacingValue;
  }
): ViewStyle => {
  const style: ViewStyle = {};

  // Helper to get spacing value
  const getSpacingValue = (value?: SpacingValue): number | undefined => {
    if (!value || value === 'none') return undefined;
    return theme.spacing[value];
  };

  // Apply padding
  if (options.padding !== undefined) {
    const value = getSpacingValue(options.padding);
    if (value !== undefined) style.padding = value;
  }
  if (options.paddingHorizontal !== undefined) {
    const value = getSpacingValue(options.paddingHorizontal);
    if (value !== undefined) style.paddingHorizontal = value;
  }
  if (options.paddingVertical !== undefined) {
    const value = getSpacingValue(options.paddingVertical);
    if (value !== undefined) style.paddingVertical = value;
  }
  if (options.paddingTop !== undefined) {
    const value = getSpacingValue(options.paddingTop);
    if (value !== undefined) style.paddingTop = value;
  }
  if (options.paddingBottom !== undefined) {
    const value = getSpacingValue(options.paddingBottom);
    if (value !== undefined) style.paddingBottom = value;
  }
  if (options.paddingLeft !== undefined) {
    const value = getSpacingValue(options.paddingLeft);
    if (value !== undefined) style.paddingLeft = value;
  }
  if (options.paddingRight !== undefined) {
    const value = getSpacingValue(options.paddingRight);
    if (value !== undefined) style.paddingRight = value;
  }

  // Apply margin
  if (options.margin !== undefined) {
    const value = getSpacingValue(options.margin);
    if (value !== undefined) style.margin = value;
  }
  if (options.marginHorizontal !== undefined) {
    const value = getSpacingValue(options.marginHorizontal);
    if (value !== undefined) style.marginHorizontal = value;
  }
  if (options.marginVertical !== undefined) {
    const value = getSpacingValue(options.marginVertical);
    if (value !== undefined) style.marginVertical = value;
  }
  if (options.marginTop !== undefined) {
    const value = getSpacingValue(options.marginTop);
    if (value !== undefined) style.marginTop = value;
  }
  if (options.marginBottom !== undefined) {
    const value = getSpacingValue(options.marginBottom);
    if (value !== undefined) style.marginBottom = value;
  }
  if (options.marginLeft !== undefined) {
    const value = getSpacingValue(options.marginLeft);
    if (value !== undefined) style.marginLeft = value;
  }
  if (options.marginRight !== undefined) {
    const value = getSpacingValue(options.marginRight);
    if (value !== undefined) style.marginRight = value;
  }

  return style;
};
