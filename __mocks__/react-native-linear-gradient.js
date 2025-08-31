// Mock for react-native-linear-gradient
const React = require('react');
const { View } = require('react-native');

const LinearGradient = React.forwardRef((props, ref) => {
  const { colors, start, end, style, children, ...restProps } = props;
  return React.createElement(
    View,
    {
      ...restProps,
      style,
      ref,
      testID: 'linear-gradient',
    },
    children
  );
});

LinearGradient.displayName = 'LinearGradient';

module.exports = LinearGradient;
module.exports.default = LinearGradient;
