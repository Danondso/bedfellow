import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  view: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  buttonWrapper: ViewStyle;
};

const { defaultPalette, padding } = theme;

export default StyleSheet.create<Style>({
  view: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderWidth: padding.quarter,
    borderRadius: padding.double,
  },
  buttonText: {
    color: defaultPalette.primaryBackground100,
  },
  buttonWrapper: {
    flex: 1,
    padding: padding.base,
  },
});
