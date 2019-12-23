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
import * as _ from 'lodash';

import { TextButtonStyle } from './TextButtonStyle';

export class RoundedCornerButtonStyle {
  private static readonly borderWidthBySize: Map<ButtonSize, number> = Map([
    [ButtonSize.X_LARGE, 4],
    [ButtonSize.LARGE, 3],
    [ButtonSize.NORMAL, 2],
    [ButtonSize.SMALL, 1], // checked
    [ButtonSize.X_SMALL, 1],
  ]);

  public static getFullBackgroundStyles(
    size: ButtonSize,
    borderRadius: number,
    backgroundColor: string,
    textColor: string,
  ): ButtonStyles {
    const buttonStyle = {
      borderRadius,
      backgroundColor,
    };

    const textStyle = {
      color: textColor,
    };

    const disabledButtonStyle = {
      backgroundColor: '#999',
    };

    return _.merge(TextButtonStyle.getBoldStyles(size), {
      buttonStyle,
      textStyle,
      disabledButtonStyle,
    });
  }

  public static getOutlineStyles(
    size: ButtonSize,
    borderRadius: number,
    color: string,
  ): ButtonStyles {
    const buttonStyle = {
      borderWidth: RoundedCornerButtonStyle.getBorderWidthBySize(size),
      borderRadius,
      borderColor: color,
    };

    const textStyle = {
      color,
    };

    const disabledButtonStyle = {
      borderColor: '#999',
    };

    return _.merge(TextButtonStyle.getBoldStyles(size), {
      buttonStyle,
      textStyle,
      disabledButtonStyle,
    });
  }

  private static getBorderWidthBySize(size: ButtonSize): number {
    return assertExists(RoundedCornerButtonStyle.borderWidthBySize.get(size));
  }
}
