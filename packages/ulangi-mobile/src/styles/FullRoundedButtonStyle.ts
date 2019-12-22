/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import { Map } from 'immutable';

import { config } from '../constants/config';
import { RoundedCornerButtonStyle } from './RoundedCornerButtonStyle';
import { TextButtonStyle } from './TextButtonStyle';

export class FullRoundedButtonStyle {
  private static readonly borderRadiusBySize: Map<ButtonSize, number> = Map([
    [
      ButtonSize.X_LARGE,
      TextButtonStyle.getHeightBySize(ButtonSize.X_LARGE) / 2,
    ],
    [ButtonSize.LARGE, TextButtonStyle.getHeightBySize(ButtonSize.LARGE) / 2],
    [ButtonSize.NORMAL, TextButtonStyle.getHeightBySize(ButtonSize.NORMAL) / 2],
    [ButtonSize.SMALL, TextButtonStyle.getHeightBySize(ButtonSize.SMALL) / 2],
    [
      ButtonSize.X_SMALL,
      TextButtonStyle.getHeightBySize(ButtonSize.X_SMALL) / 2,
    ],
  ]);

  public static getFullBackgroundStyles(
    size: ButtonSize,
    backgroundColor: string,
    textColor: string
  ): ButtonStyles {
    return RoundedCornerButtonStyle.getFullBackgroundStyles(
      size,
      FullRoundedButtonStyle.getBorderRadiusBySize(size),
      backgroundColor,
      textColor
    );
  }

  public static getFullPrimaryBackgroundStyles(size: ButtonSize): ButtonStyles {
    return FullRoundedButtonStyle.getFullBackgroundStyles(
      size,
      config.styles.primaryColor,
      'white'
    );
  }

  public static getFullGreenBackgroundStyles(size: ButtonSize): ButtonStyles {
    return FullRoundedButtonStyle.getFullBackgroundStyles(
      size,
      config.styles.greenColor,
      'white'
    );
  }

  public static getFullGreyBackgroundStyles(size: ButtonSize): ButtonStyles {
    return FullRoundedButtonStyle.getFullBackgroundStyles(size, '#ddd', '#444');
  }

  public static getOutlineStyles(
    size: ButtonSize,
    color: string
  ): ButtonStyles {
    return RoundedCornerButtonStyle.getOutlineStyles(
      size,
      FullRoundedButtonStyle.getBorderRadiusBySize(size),
      color
    );
  }

  public static getGreyOutlineStyles(size: ButtonSize): ButtonStyles {
    return FullRoundedButtonStyle.getOutlineStyles(size, '#777');
  }

  public static getPrimaryOutlineStyles(size: ButtonSize): ButtonStyles {
    return FullRoundedButtonStyle.getOutlineStyles(
      size,
      config.styles.primaryColor
    );
  }

  public static getGreenOutlineStyles(size: ButtonSize): ButtonStyles {
    return FullRoundedButtonStyle.getOutlineStyles(
      size,
      config.styles.greenColor
    );
  }

  private static getBorderRadiusBySize(size: ButtonSize): number {
    return assertExists(FullRoundedButtonStyle.borderRadiusBySize.get(size));
  }
}
