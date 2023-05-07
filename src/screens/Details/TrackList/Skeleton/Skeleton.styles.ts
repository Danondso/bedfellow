import { StyleSheet, ViewStyle } from 'react-native';
import theme from '../../../../theme';

type Style = {
  skeletonLoader: ViewStyle;
  trackItem: ViewStyle;
  trackListWrapper: ViewStyle;
};

const { defaultPalette, padding, borderRadius } = theme;

export default StyleSheet.create<Style>({
  skeletonLoader: {
    flex: 1,
    height: 275,
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
});
