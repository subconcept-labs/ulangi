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
import * as _ from 'lodash';

import {
  Layout,
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../utils/responsive';
import { textButtonStyles } from './TextButtonStyles';

export type RoundedCornerButtonOptions =
  | OutlineRoundedCornerButtonOptions
  | SolidRoundedCornerButtonOptions;

export interface SolidRoundedCornerButtonOptions {
  kind: 'solid';
  size: ButtonSize;
  borderRadius: number;
  textColor: string;
  backgroundColor: string;
}

export interface OutlineRoundedCornerButtonOptions {
  kind: 'outline';
  size: ButtonSize;
  borderRadius: number;
  textColor: string;
}

export class RoundedCornerButtonStyles extends ResponsiveStyleSheet<
  ButtonStyles,
  RoundedCornerButtonOptions
> {
  protected readonly borderWidthBySize: Map<ButtonSize, number> = Map([
    [ButtonSize.X_LARGE, 4],
    [ButtonSize.LARGE, 3],
    [ButtonSize.NORMAL, 2],
    [ButtonSize.SMALL, 1],
    [ButtonSize.X_SMALL, 1],
  ]);

  public getBorderWidthBySize(size: ButtonSize): number {
    return assertExists(this.borderWidthBySize.get(size));
  }

  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
    options: RoundedCornerButtonOptions,
  ): ButtonStyles {
    const { size, borderRadius, textColor } = options;

    const buttonStyle =
      options.kind === 'solid'
        ? {
            borderRadius,
            backgroundColor: options.backgroundColor,
          }
        : {
            borderRadius,
            borderWidth: scaleByFactor(this.getBorderWidthBySize(size)),
            borderColor: textColor,
          };

    const textStyle = {
      color: textColor,
    };

    const disabledButtonStyle = {
      backgroundColor: '#999',
    };

    return _.merge(
      {},
      textButtonStyles.baseStyles(scaleByFactor, scaleByBreakpoints, layout, {
        size,
        fontWeight: 'bold',
      }),
      {
        buttonStyle,
        textStyle,
        disabledButtonStyle,
      },
    );
  }

  public lightStyles(): Partial<ButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ButtonStyles> {
    return {};
  }

  public getSolidBackgroundStyles(
    size: ButtonSize,
    borderRadius: number,
    backgroundColor: string,
    textColor: string,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      kind: 'solid',
      size,
      borderRadius,
      textColor,
      backgroundColor,
    });
  }

  public getOutlineStyles(
    size: ButtonSize,
    borderRadius: number,
    textColor: string,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      kind: 'outline',
      size,
      borderRadius,
      textColor,
    });
  }
}
export const roundedCornerButtonStyles = new RoundedCornerButtonStyles();
