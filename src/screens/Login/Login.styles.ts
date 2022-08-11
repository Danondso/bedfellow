import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from '../../theme';

type Style = {
  view: ViewStyle;
  loginButtonText: TextStyle;
  header: TextStyle;
  subHeader: TextStyle;
  loginView: ViewStyle;
  button: ViewStyle;
  loginButtonView: ViewStyle;
};

const { defaultPalette, padding, borderRadius } = theme;

export default StyleSheet.create<Style>({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultPalette.primaryBackground,
  },
  header: {
    paddingTop: padding.triple,
    fontSize: padding.triple,
  },
  subHeader: {
    fontSize: padding.base,
    textAlign: 'center',
  },
  loginView: {
    alignItems: 'center',
    width: '80%',
    paddingBottom: 200,
    backgroundColor: defaultPalette.secondaryBackground,
    borderRadius,
  },
  loginButtonView: {
    paddingTop: padding.double,
  },
  loginButtonText: {
    fontSize: padding.oneAndAHalf,
    fontWeight: '700',
    color: defaultPalette.black100,
  },
  button: {
    borderRadius,
    padding: padding.base,
    width: '100%',
    backgroundColor: defaultPalette.red100,
  },
});
