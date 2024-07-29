import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../../../theme';

type Style = {
  trackImage: ImageStyle;
  trackItem: ViewStyle;
  trackListWrapper: ViewStyle;
  trackListTitle: TextStyle;
  trackListText: TextStyle;
};

const { padding, borderRadius } = theme;

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
    borderRadius,
  },
  trackListWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackListText: {
    fontWeight: 'bold',
  },
  trackListTitle: {
    width: '100%',
    alignItems: 'center',
  },
});
