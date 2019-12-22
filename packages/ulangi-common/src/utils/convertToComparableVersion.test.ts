/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { convertToComparableVersion } from './convertToComparableVersion';

describe('convertToComparableVersion', (): void => {
  test('should convert 2.11.342 to 0002.0011.0342', (): void => {
    expect(convertToComparableVersion('2.11.342')).toEqual('0002.0011.0342');
  });

  test('should convert 2.11.342-beta.0 to 0002.0011.0342', (): void => {
    expect(convertToComparableVersion('2.11.342')).toEqual('0002.0011.0342');
  });

  test('should convert 2.11.342-0 to 0002.0011.0342', (): void => {
    expect(convertToComparableVersion('2.11.342')).toEqual('0002.0011.0342');
  });

  test('should throw if convert 2.11.0342', (): void => {
    expect((): string => convertToComparableVersion('2.11.0342')).toThrow();
  });

  test('should throw if convert 1.1.10000', (): void => {
    expect((): string => convertToComparableVersion('1.1.10000')).toThrow();
  });

  test('should throw if convert 10000.1.1', (): void => {
    expect((): string => convertToComparableVersion('10000.11.1')).toThrow();
  });

  test('should throw if convert 1.10000.1', (): void => {
    expect((): string => convertToComparableVersion('1.10000.1')).toThrow();
  });
});
