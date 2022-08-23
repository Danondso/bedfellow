import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../theme';

type Style = {
  view: ViewStyle;
  currentSongView: ViewStyle;
  trackListView: ViewStyle;
  artistName: TextStyle;
  trackName: TextStyle;
  albumDescription: TextStyle;
  button: ViewStyle;
  samplesHeading: TextStyle;
  trackListWrapper: ViewStyle;
};

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

export default StyleSheet.create<Style>({
  view: {
    flex: 1,
    backgroundColor: defaultPalette.primaryBackground,
  },
  currentSongView: {
    position: 'relative',
    flex: 1 / 3,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultPalette.success,
    paddingTop: padding.double,
    paddingBottom: padding.base,
    borderColor: defaultPalette.primaryText,
    borderWidth: 1,
  },
  trackListView: {
    flex: 2 / 3,
  },
  trackListWrapper: {
    alignItems: 'center',
  },
  artistName: {
    padding: padding.eighth,
    fontSize: fontSizes[0],
    fontWeight: '400',
    textAlign: 'center',
    color: defaultPalette.primaryText,
  },
  trackName: {
    padding: padding.base,
    fontSize: fontSizes[2],
    fontWeight: '600',
    textAlign: 'center',
    color: defaultPalette.primaryText,
  },
  albumDescription: {
    fontSize: fontSizes[0],
    color: defaultPalette.primaryText,
    textAlign: 'center',
  },
  button: {
    borderRadius,
    borderColor: defaultPalette.success,
    padding: padding.base,
    width: '100%',
  },
  samplesHeading: {
    padding: padding.base,
    paddingBottom: 0,
    fontSize: fontSizes[2],
    fontWeight: '400',
  },
});
