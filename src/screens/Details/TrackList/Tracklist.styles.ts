import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  view: ViewStyle;
  trackItem: ViewStyle;
  trackImage: ImageStyle;
  trackName: TextStyle;
  artistName: TextStyle;
};

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

export default StyleSheet.create<Style>({
  view: {
    width: '80%',
    marginTop: padding.base,
    backgroundColor: defaultPalette.primaryBackground,
  },
  trackItem: {
    marginVertical: '3%',
    flex: 1,
    flexDirection: 'row',
    padding: padding.base,
    backgroundColor: defaultPalette.secondaryBackground,
    borderColor: defaultPalette.borderColor,
    borderWidth: 1,
    borderRadius,
  },
  trackName: {
    fontSize: fontSizes[1],
  },
  artistName: {
    fontSize: fontSizes[0],
  },
  trackImage: {
    borderColor: defaultPalette.borderColor,
    borderWidth: 1,
  },
});
