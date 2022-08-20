import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  view: ViewStyle;
  trackItem: ViewStyle;
  trackName: TextStyle;
  artistName: TextStyle;
};

const { defaultPalette, padding } = theme;

export default StyleSheet.create<Style>({
  view: {
    marginTop: padding.base,
    backgroundColor: defaultPalette.primaryBackground,
  },
  trackItem: {
    padding: padding.double,
    backgroundColor: defaultPalette.secondaryBackground,
  },
  trackName: {
    fontSize: padding.double,
  },
  artistName: {
    fontSize: padding.base,
  },
});
