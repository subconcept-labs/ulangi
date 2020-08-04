import { Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

export const shortDimension = width < height ? width : height;
export const longDimension = width >= height ? width : height;

// x large scale by short dimension
export function xls(size: number): number {
  return Math.round(ms(size, 9));
}

// large scale by short dimension
export function ls(size: number): number {
  return Math.round(ms(size, 3));
}

// normal scale by short dimension
export function ns(size: number): number {
  return Math.round(ms(size, 1));
}

// small scale by short dimension
export function ss(size: number): number {
  return Math.round(ms(size, 0.1));
}
