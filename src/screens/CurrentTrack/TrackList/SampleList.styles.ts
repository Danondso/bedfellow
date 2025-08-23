import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  artistName: TextStyle;
  noSamples: TextStyle;
  noSamplesWrapper: ViewStyle;
  snackBar: ViewStyle;
  snackBarSuccess: ViewStyle;
  snackBarFail: ViewStyle;
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
    marginTop: 100, // Push down below Dynamic Island and settings button
    alignItems: 'center',
    justifyContent: 'center',
  },
  snackBarFail: {
    backgroundColor: defaultPalette.error,
  },
  snackBarSuccess: {
    backgroundColor: defaultPalette.success,
  },
  snackBar: {
    zIndex: 999,
    marginBottom: padding.nonuple,
  },
  view: {
    width: '100%',
    marginTop: padding.base,
    backgroundColor: defaultPalette.primaryBackground,
  },
});
