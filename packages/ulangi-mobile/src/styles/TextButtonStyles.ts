/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import { Map } from 'immutable';

import { config } from '../constants/config';
import {
  Layout,
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../utils/responsive';

export interface TextButtonOptions {
  size: ButtonSize;
  fontWeight: 'normal' | 'bold';
}

export class TextButtonStyles extends ResponsiveStyleSheet<
  ButtonStyles,
  TextButtonOptions
> {
  protected readonly heightBySize: Map<ButtonSize, number> = Map([
    [ButtonSize.X_LARGE, 52],
    [ButtonSize.LARGE, 46],
    [ButtonSize.NORMAL, 36],
    [ButtonSize.SMALL, 26],
    [ButtonSize.X_SMALL, 22],
  ]);

  protected readonly paddingHorizontalBySize: Map<ButtonSize, number> = Map([
    [ButtonSize.X_LARGE, 26],
    [ButtonSize.LARGE, 22],
    [ButtonSize.NORMAL, 18],
    [ButtonSize.SMALL, 14],
    [ButtonSize.X_SMALL, 10],
  ]);

  protected readonly fontSizeBySize: Map<ButtonSize, number> = Map([
    [ButtonSize.X_LARGE, 20],
    [ButtonSize.LARGE, 17],
    [ButtonSize.NORMAL, 15],
    [ButtonSize.SMALL, 14],
    [ButtonSize.X_SMALL, 12],
  ]);

  public getHeightBySize(size: ButtonSize): number {
    return assertExists(this.heightBySize.get(size));
  }

  public getPaddingHorizontalBySize(size: ButtonSize): number {
    return assertExists(this.paddingHorizontalBySize.get(size));
  }

  public getFontSizelBySize(size: ButtonSize): number {
    return assertExists(this.fontSizeBySize.get(size));
  }

  public baseStyles(
    scaleByFactor: ScaleByFactor,
    _: ScaleByBreakpoints,
    __: Layout,
    options: {
      size: ButtonSize;
      fontWeight: 'normal' | 'bold';
    },
  ): ButtonStyles {
    const { size, fontWeight } = options;

    const buttonStyle = {
      height: scaleByFactor(this.getHeightBySize(size)),
      paddingHorizontal: scaleByFactor(this.getPaddingHorizontalBySize(size)),
    };

    const textStyle = {
      color: config.styles.primaryColor,
      fontSize: scaleByFactor(this.getFontSizelBySize(size)),
      fontWeight,
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

  public lightStyles(): Partial<ButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ButtonStyles> {
    return {};
  }

  public getNormalStyles(
    size: ButtonSize,
    layout: Layout,
    theme: Theme,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      size,
      fontWeight: 'normal',
    });
  }

  public getBoldStyles(
    size: ButtonSize,
    layout: Layout,
    theme: Theme,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      size,
      fontWeight: 'bold',
    });
  }
}

export const textButtonStyles = new TextButtonStyles();
