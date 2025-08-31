// Mock for react-native-svg
const React = require('react');
const { View } = require('react-native');

// Mock all SVG components as View
const createMockComponent = (name) => {
  return React.forwardRef((props, ref) => {
    return React.createElement(View, { ...props, ref, testID: `svg-${name}` });
  });
};

// List of SVG components to mock
const svgComponents = [
  'Svg',
  'Circle',
  'Ellipse',
  'G',
  'Text',
  'TSpan',
  'TextPath',
  'Path',
  'Polygon',
  'Polyline',
  'Line',
  'Rect',
  'Use',
  'Image',
  'Symbol',
  'Defs',
  'LinearGradient',
  'RadialGradient',
  'Stop',
  'ClipPath',
  'Pattern',
  'Mask',
  'Marker',
  'ForeignObject',
];

// Create mock exports
const mockExports = {};
svgComponents.forEach((component) => {
  mockExports[component] = createMockComponent(component);
});

// Default export is Svg
mockExports.default = mockExports.Svg;

module.exports = mockExports;
