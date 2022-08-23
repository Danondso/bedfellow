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

const { defaultPalette, padding, borderRadius, fontSizes } = theme;

export default StyleSheet.create<Style>({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultPalette.primaryBackground,
  },
  header: {
    paddingTop: padding.triple,
    fontSize: fontSizes[3],
    color: defaultPalette.primaryText,
  },
  subHeader: {
    fontSize: fontSizes[0],
    color: defaultPalette.primaryText,
    textAlign: 'center',
  },
  loginView: {
    alignItems: 'center',
    width: '80%',
    paddingBottom: 200,
    backgroundColor: defaultPalette.secondaryBackground,
    borderColor: defaultPalette.primaryText,
    borderWidth: 1,
    borderRadius,
  },
  loginButtonView: {
    backgroundColor: defaultPalette.primaryBackground100,
    borderWidth: 1,
    borderColor: defaultPalette.primaryText,
    borderRadius,
    marginTop: padding.double,
  },
  loginButtonText: {
    fontSize: fontSizes[2],
    fontWeight: '400',
    color: defaultPalette.primaryText,
  },
  button: {
    borderRadius,
    borderColor: defaultPalette.success,
    padding: padding.base,
    width: '100%',
  },
});
