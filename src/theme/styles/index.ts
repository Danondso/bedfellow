/**
 * Color pallette
 * Everything starting with 100 denotes a 'base' color in the context of the application
 * so green100 is our green, so green200 would denote a deviation from that.
 * I don't make design systems so this is a 'I'm feeling my through it' solution.
 */

// shoot for these levels
// primary, secondary, success, warning, error
const defaultPalette: Record<string, string> = {
  secondaryBackground: '#E5C185',
  primaryBackground: '#FBF2C4',
  primaryBackground100: '#FEF9E0',
  success: '#74A892',
  accent: '#008585',
  error: '#C7522A',
  primaryText: '#343941', // #64748B => saving this boi for something later
  shadow: '#535A63',
};

export default defaultPalette;
