import { colors } from './colors';
import { spacing } from './spacing';
import { fontSize } from './fontSize';
import { fontWeight } from './fontWeight';
import { borderRadius } from './borderRadius';

export const lightTheme = {
  colors: colors.light,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
};

export const darkTheme = {
  colors: colors.dark,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
};

export type Theme = typeof lightTheme;
