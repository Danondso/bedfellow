import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  view: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  buttonWrapper: ViewStyle;
};

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

export default StyleSheet.create<Style>({
  view: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: defaultPalette.accent,
  },
  buttonText: {
    color: defaultPalette.primaryBackground100,
  },
  buttonWrapper: {
    padding: padding.base,
  },
});
