import defaultPalette from './styles';

const fontSizes = [16, 24, 32, 48];

const BASE: number = 16;
const padding: Record<string, number> = {
  eighth: BASE / 8,
  quarter: BASE / 4,
  half: BASE / 2,
  base: BASE,
  oneAndAHalf: BASE * 1.5,
  double: BASE * 2,
  triple: BASE * 3,
  quadruple: BASE * 4,
  quintuple: BASE * 5,
  sextuple: BASE * 6,
  septuple: BASE * 7,
  octuple: BASE * 8,
  nonuple: BASE * 9,
  dectuple: BASE * 10,
};

// TODO create a better system for borderRadius as more arise
const borderRadius: number = 16;

export default {
  padding,
  defaultPalette,
  borderRadius,
  fontSizes,
};
