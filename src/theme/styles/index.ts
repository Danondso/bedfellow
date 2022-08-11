/**
 * Color pallette
 * Everything starting with 100 denotes a 'base' color in the context of the application
 * so green100 is our green, so green200 would denote a deviation from that.
 * I don't make design systems so this is a 'I'm feeling my through it' solution.
 */

const defaultPalette: Record<string, string> = {
  secondaryBackground: '#e5c185',
  primaryBackground: '#fbf2c4',
  green100: '#74a892',
  teal100: '#008585',
  red100: '#c7522a',
  white100: '#ffffff',
  black100: '#000000',
};

export default defaultPalette;
