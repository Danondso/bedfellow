import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  view: ViewStyle;
  trackItem: ViewStyle;
  trackImage: ImageStyle;
  trackName: TextStyle;
  trackListWrapper: ViewStyle;
  noSamplesWrapper: ViewStyle;
  noSamples: TextStyle;
  artistName: TextStyle;
  skeletonLoader: ViewStyle;
};

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

export default StyleSheet.create<Style>({
  view: {
    width: '100%',
    marginTop: padding.base,
    backgroundColor: defaultPalette.primaryBackground,
  },
  trackItem: {
    marginVertical: '3%',
    width: '80%',
    flex: 1,
    flexDirection: 'row',
    padding: padding.base,
    backgroundColor: defaultPalette.secondaryBackground,
    borderColor: defaultPalette.borderColor,
    borderWidth: 1,
    borderRadius,
  },
  trackListWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackName: {
    fontSize: fontSizes.MEDIUM,
  },
  noSamples: {
    fontSize: fontSizes.MEDIUM,
  },
  noSamplesWrapper: {
    marginTop: padding.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistName: {
    fontSize: fontSizes.SMALL,
  },
  trackImage: {
    borderColor: defaultPalette.borderColor,
    borderRadius: borderRadius / 4,
    borderWidth: 1,
  },
  skeletonLoader: {
    flex: 1,
    height: 275,
  },
});
