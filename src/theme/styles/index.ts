/**
 * Color pallette
 * Everything starting with 100 denotes a 'base' color in the context of the application
 * so green100 is our green, so green200 would denote a deviation from that.
 * I don't make design systems so this is a 'I'm feeling my through it' solution.
 */

// shoot for these levels
// primary, secondary, success, warning, error
const defaultPalette: Record<string, string> = {
  secondaryBackground: '#e5c185',
  primaryBackground: '#fbf2c4',
  success: '#74a892',
  accent: '#008585',
  error: '#c7522a',
  primaryText: '#343941', // #64748B => saving this boi for something later
  shadow: '#535A63',
};

export default defaultPalette;
