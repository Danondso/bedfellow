import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  artistName: TextStyle;
  noSamples: TextStyle;
  noSamplesWrapper: ViewStyle;
  snackBar: ViewStyle;
  view: ViewStyle;
};

const { defaultPalette, padding, fontSizes } = theme;

export default StyleSheet.create<Style>({
  artistName: {
    fontSize: fontSizes.SMALL,
  },
  noSamples: {
    fontSize: fontSizes.MEDIUM,
  },
  noSamplesWrapper: {
    marginTop: padding.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snackBar: {
    backgroundColor: defaultPalette.success,
  },
  view: {
    width: '100%',
    marginTop: padding.base,
    backgroundColor: defaultPalette.primaryBackground,
  },
});
