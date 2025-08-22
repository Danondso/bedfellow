import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../theme';

type Style = {
  view: ViewStyle;
  currentSongView: ViewStyle;
  artistName: TextStyle;
  trackName: TextStyle;
  albumDescription: TextStyle;
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
    paddingTop: padding.quadruple,
    paddingBottom: padding.base,
    borderColor: defaultPalette.primaryText,
    borderWidth: 1,
  },
  artistName: {
    padding: padding.eighth,
    fontWeight: '400',
    textAlign: 'center',
  },
  trackName: {
    padding: padding.base,
    fontSize: fontSizes.SMALL,
    fontWeight: '600',
    textAlign: 'center',
  },
  albumDescription: {
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
    fontSize: fontSizes.LARGE,
    fontWeight: '400',
  },
});
