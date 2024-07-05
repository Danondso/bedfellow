import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../../theme';

type Style = {
  trackImage: ImageStyle;
  trackItem: ViewStyle;
  trackListWrapper: ViewStyle;
  trackListTitle: TextStyle;
};

const { defaultPalette, padding, borderRadius } = theme;

export default StyleSheet.create<Style>({
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
  trackListTitle: {
    width: '100%',
    alignItems: 'center',
  },
});
