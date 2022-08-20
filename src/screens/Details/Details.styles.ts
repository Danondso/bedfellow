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
};

const { defaultPalette, padding, borderRadius } = theme;

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
  artistName: {
    padding: padding.eighth,
    fontSize: padding.base,
    fontWeight: '400',
    textAlign: 'center',
    color: defaultPalette.primaryText,
  },
  trackName: {
    padding: padding.base,
    fontSize: padding.double,
    fontWeight: '600',
    textAlign: 'center',
    color: defaultPalette.primaryText,
  },
  albumDescription: {
    fontSize: padding.base,
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
    fontSize: padding.double,
    fontWeight: '400',
  },
});
