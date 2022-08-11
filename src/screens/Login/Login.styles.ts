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
    color: defaultPalette.primaryText,
  },
  subHeader: {
    fontSize: padding.base,
    color: defaultPalette.primaryText,
    textAlign: 'center',
  },
  loginView: {
    alignItems: 'center',
    width: '80%',
    paddingBottom: 200,
    backgroundColor: defaultPalette.secondaryBackground,
    shadowColor: defaultPalette.shadow,
    shadowOpacity: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderRadius,
  },
  loginButtonView: {
    paddingTop: padding.double,
  },
  loginButtonText: {
    fontSize: padding.double,
    fontWeight: '500',
    color: defaultPalette.primaryText,
  },
  button: {
    borderRadius,
    borderColor: defaultPalette.success,
    padding: padding.base,
    width: '100%',
  },
});
