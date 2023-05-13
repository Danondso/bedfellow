import defaultPalette from './styles';

enum FONT_SIZES {
  XX_SMALL = 4,
  X_SMALL = 8,
  SMALL = 16,
  MEDIUM = 24,
  LARGE = 32,
  X_LARGE = 48,
}

const BASE_PADDING: number = 16;
const padding: Record<string, number> = {
  eighth: BASE_PADDING / 8,
  quarter: BASE_PADDING / 4,
  half: BASE_PADDING / 2,
  base: BASE_PADDING,
  oneAndAHalf: BASE_PADDING * 1.5,
  double: BASE_PADDING * 2,
  triple: BASE_PADDING * 3,
  quadruple: BASE_PADDING * 4,
  quintuple: BASE_PADDING * 5,
  sextuple: BASE_PADDING * 6,
  septuple: BASE_PADDING * 7,
  octuple: BASE_PADDING * 8,
  nonuple: BASE_PADDING * 9,
  decuple: BASE_PADDING * 10,
};

const BORDER_RADIUS: number = 16;

export default {
  padding,
  defaultPalette,
  borderRadius: BORDER_RADIUS,
  fontSizes: FONT_SIZES,
};
