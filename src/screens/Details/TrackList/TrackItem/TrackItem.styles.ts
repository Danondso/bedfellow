import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../../theme';

type Style = {
  artistName: TextStyle;
  trackImage: ImageStyle;
  trackItem: ViewStyle;
  trackListWrapper: ViewStyle;
  trackName: TextStyle;
};

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

export default StyleSheet.create<Style>({
  artistName: {
    fontSize: fontSizes.SMALL,
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
});
