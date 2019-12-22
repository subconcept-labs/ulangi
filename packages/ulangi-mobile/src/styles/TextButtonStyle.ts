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

import { config } from '../constants/config';

export class TextButtonStyle {
  private static readonly heightBySize: Map<ButtonSize, number> = Map([
    [ButtonSize.X_LARGE, 52], // checked
    [ButtonSize.LARGE, 46], // checked
    [ButtonSize.NORMAL, 36], // checked
    [ButtonSize.SMALL, 26], // checked
    [ButtonSize.X_SMALL, 22], // checked
  ]);

  private static readonly paddingHorizontalBySize: Map<
    ButtonSize,
    number
  > = Map([
    [ButtonSize.X_LARGE, 26],
    [ButtonSize.LARGE, 22],
    [ButtonSize.NORMAL, 18], // checked
    [ButtonSize.SMALL, 14], // checked
    [ButtonSize.X_SMALL, 10], // checked
  ]);

  private static readonly fontSizeBySize: Map<ButtonSize, number> = Map([
    [ButtonSize.X_LARGE, 20], // checked
    [ButtonSize.LARGE, 17], // checked
    [ButtonSize.NORMAL, 15], // checked
    [ButtonSize.SMALL, 14], // checked
    [ButtonSize.X_SMALL, 12], // checked
  ]);

  public static getNormalStyles(size: ButtonSize): ButtonStyles {
    const buttonStyle = {
      height: TextButtonStyle.getHeightBySize(size),
      paddingHorizontal: TextButtonStyle.getPaddingHorizontalBySize(size),
    };

    const textStyle = {
      color: config.styles.primaryColor,
      fontSize: TextButtonStyle.getFontSizelBySize(size),
    };

    const disabledButtonStyle = {};

    const disabledTextStyle = {
      color: '#999',
    };

    return {
      textStyle,
      buttonStyle,
      disabledTextStyle,
      disabledButtonStyle,
    };
  }

  public static getBoldStyles(size: ButtonSize): ButtonStyles {
    return _.merge(TextButtonStyle.getNormalStyles(size), {
      textStyle: {
        fontWeight: 'bold',
      },
    });
  }

  public static getHeightBySize(size: ButtonSize): number {
    return assertExists(TextButtonStyle.heightBySize.get(size));
  }

  public static getPaddingHorizontalBySize(size: ButtonSize): number {
    return assertExists(TextButtonStyle.paddingHorizontalBySize.get(size));
  }

  public static getFontSizelBySize(size: ButtonSize): number {
    return assertExists(TextButtonStyle.fontSizeBySize.get(size));
  }
}
