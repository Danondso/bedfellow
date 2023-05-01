import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  artistName: TextStyle;
  noSamples: TextStyle;
  noSamplesWrapper: ViewStyle;
  skeletonLoader: ViewStyle;
  trackImage: ImageStyle;
  trackItem: ViewStyle;
  trackListWrapper: ViewStyle;
  trackName: TextStyle;
  view: ViewStyle;
};

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

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
  skeletonLoader: {
    flex: 1,
    height: 275,
  },
  trackImage: {
    borderRadius: borderRadius / 4,
  },
  trackItem: {
    marginVertical: '3%',
    width: '80%',
    flex: 1,
    flexDirection: 'row',
    padding: padding.base,
    backgroundColor: defaultPalette.secondaryBackground,
    borderRadius,
  },
  trackListWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackName: {
    fontSize: fontSizes.MEDIUM,
  },
  view: {
    width: '100%',
    marginTop: padding.base,
    backgroundColor: defaultPalette.primaryBackground,
  },
});
