/**
 * Color pallette
 * Everything starting with 100 denotes a 'base' color in the context of the application
 * so green100 is our green, so green200 would denote a deviation from that.
 * I don't make design systems so this is a 'I'm feeling my through it' solution.
 */

enum ColorPalette {
  primaryBackground = 'primaryBackground',
  primaryBackground100 = 'primaryBackground100',
  secondaryBackground = 'secondaryBackground',
  success = 'success',
  accent = 'accent',
  error = 'error',
  primaryText = 'primaryTex†',
  shadow = 'shadow',
  borderColor = 'borderColor',
}

const defaultPalette: Record<ColorPalette, string> = {
  [ColorPalette.primaryBackground]: '#FBF2C4',
  [ColorPalette.primaryBackground100]: '#FEF9E0',
  [ColorPalette.secondaryBackground]: '#E5C185',
  [ColorPalette.success]: '#74A892',
  [ColorPalette.accent]: '#008585',
  [ColorPalette.error]: '#C7522A',
  [ColorPalette.primaryText]: '#343941', // #64748B => saving this boi for something later
  [ColorPalette.shadow]: '#535A63',
  [ColorPalette.borderColor]: '#00000',
};

export default defaultPalette;
