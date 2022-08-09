import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

type Style = {
  view: ViewStyle;
  text: TextStyle;
};

export default StyleSheet.create<Style>({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 200,
  },
  text: {
    fontSize: 32,
  },
});
