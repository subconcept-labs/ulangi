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
import { roundedCornerButtonStyles } from './RoundedCornerButtonStyles';
import { textButtonStyles } from './TextButtonStyles';

export type FullRoundedButtonOptions =
  | OutlineFullRoundedButtonOptions
  | SolidFullRoundedButtonOptions;

export interface SolidFullRoundedButtonOptions {
  kind: 'solid';
  size: ButtonSize;
  textColor: string;
  backgroundColor: string;
}

export interface OutlineFullRoundedButtonOptions {
  kind: 'outline';
  size: ButtonSize;
  textColor: string;
}

export class FullRoundedButtonStyles extends ResponsiveStyleSheet<
  ButtonStyles,
  FullRoundedButtonOptions
> {
  protected readonly borderRadiusBySize: Map<ButtonSize, number> = Map([
    [
      ButtonSize.X_LARGE,
      textButtonStyles.getHeightBySize(ButtonSize.X_LARGE) / 2,
    ],
    [ButtonSize.LARGE, textButtonStyles.getHeightBySize(ButtonSize.LARGE) / 2],
    [
      ButtonSize.NORMAL,
      textButtonStyles.getHeightBySize(ButtonSize.NORMAL) / 2,
    ],
    [ButtonSize.SMALL, textButtonStyles.getHeightBySize(ButtonSize.SMALL) / 2],
    [
      ButtonSize.X_SMALL,
      textButtonStyles.getHeightBySize(ButtonSize.X_SMALL) / 2,
    ],
  ]);

  public getBorderRadiusBySize(size: ButtonSize): number {
    return assertExists(this.borderRadiusBySize.get(size));
  }

  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
    options: FullRoundedButtonOptions,
  ): ButtonStyles {
    return roundedCornerButtonStyles.baseStyles(
      scaleByFactor,
      scaleByBreakpoints,
      layout,
      {
        ...options,
        borderRadius:
          scaleByFactor(this.getBorderRadiusBySize(options.size) * 2) / 2,
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
    backgroundColor: string,
    textColor: string,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      kind: 'solid',
      size,
      backgroundColor,
      textColor,
    });
  }

  public getSolidPrimaryBackgroundStyles(
    size: ButtonSize,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.getSolidBackgroundStyles(
      size,
      config.styles.primaryColor,
      'white',
      theme,
      layout,
    );
  }

  public getSolidGreenBackgroundStyles(
    size: ButtonSize,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.getSolidBackgroundStyles(
      size,
      config.styles.greenColor,
      'white',
      theme,
      layout,
    );
  }

  public getSolidGreyBackgroundStyles(
    size: ButtonSize,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.getSolidBackgroundStyles(size, '#ddd', '#444', theme, layout);
  }

  public getOutlineStyles(
    size: ButtonSize,
    textColor: string,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      kind: 'outline',
      size,
      textColor,
    });
  }

  public getGreyOutlineStyles(
    size: ButtonSize,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.getOutlineStyles(size, '#777', theme, layout);
  }

  public getPrimaryOutlineStyles(
    size: ButtonSize,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.getOutlineStyles(
      size,
      config.styles.primaryColor,
      theme,
      layout,
    );
  }

  public getGreenOutlineStyles(
    size: ButtonSize,
    theme: Theme,
    layout: Layout,
  ): ButtonStyles {
    return this.getOutlineStyles(size, config.styles.greenColor, theme, layout);
  }
}

export const fullRoundedButtonStyles = new FullRoundedButtonStyles();
