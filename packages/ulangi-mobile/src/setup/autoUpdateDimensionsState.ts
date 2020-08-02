/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableDimensions } from '@ulangi/ulangi-observable';
import { Dimensions, ScaledSize } from 'react-native';

export function autoUpdateDimensionsState(
  observableDimensions: ObservableDimensions,
): Function {
  const changeHandler = ({
    window,
    screen,
  }: {
    window: ScaledSize;
    screen: ScaledSize;
  }): void => {
    observableDimensions.screenWidth = screen.width;
    observableDimensions.screenHeight = screen.height;
    observableDimensions.windowWidth = window.width;
    observableDimensions.windowHeight = window.height;
  };

  Dimensions.addEventListener('change', changeHandler);

  return (): void => {
    Dimensions.removeEventListener('change', changeHandler);
  };
}
