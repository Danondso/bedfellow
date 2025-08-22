import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../theme';

type Style = {
  footerWrapper: ViewStyle;
  view: ViewStyle;
  button: ViewStyle;
  samplesHeading: TextStyle;
  trackListWrapper: ViewStyle;
};

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

export default StyleSheet.create<Style>({
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '15%',
  },
  view: {
    flex: 1,
    backgroundColor: defaultPalette.primaryBackground,
  },
  trackListWrapper: {
    alignItems: 'center',
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
