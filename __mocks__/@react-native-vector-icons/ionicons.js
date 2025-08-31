// Mock for @react-native-vector-icons/ionicons
const React = require('react');
const { Text } = require('react-native');

const Icon = React.forwardRef((props, ref) => {
  const { name, size, color, ...restProps } = props;
  return React.createElement(
    Text,
    {
      ...restProps,
      ref,
      style: [{ fontSize: size || 12, color: color || 'black' }, props.style],
      testID: `icon-${name}`,
    },
    name || 'icon'
  );
});

Icon.displayName = 'Icon';

module.exports = Icon;
module.exports.default = Icon;
