import { assertExists } from '@ulangi/assert';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';

import { config } from '../constants/config';
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

export class FullRoundedButtonStyles {
  protected readonly borderRadiusBySize: Map<ButtonSize, string> = new Map([
    [
      ButtonSize.X_LARGE,
      (textButtonStyles.getHeightBySize(ButtonSize.X_LARGE) / 2) + 'px',
    ],
    [
      ButtonSize.LARGE,
      (textButtonStyles.getHeightBySize(ButtonSize.LARGE) / 2) + 'px'
    ],
    [
      ButtonSize.NORMAL,
      (textButtonStyles.getHeightBySize(ButtonSize.NORMAL) / 2) + 'px'
    ],
    [
      ButtonSize.SMALL,
      (textButtonStyles.getHeightBySize(ButtonSize.SMALL) / 2) + 'px'
    ],
    [
      ButtonSize.X_SMALL,
      (textButtonStyles.getHeightBySize(ButtonSize.X_SMALL) / 2) + 'px'
    ],
  ]);

  public getBorderRadiusBySize(size: ButtonSize): string {
    return assertExists(this.borderRadiusBySize.get(size));
  }

  public baseStyles(options: FullRoundedButtonOptions): ButtonStyles {
    return roundedCornerButtonStyles.baseStyles({
      ...options,
      borderRadius: this.getBorderRadiusBySize(options.size),
    });
  }

  public getSolidBackgroundStyles(
    size: ButtonSize,
    backgroundColor: string,
    textColor: string,
  ): ButtonStyles {
    return this.baseStyles({
      kind: 'solid',
      size,
      backgroundColor,
      textColor,
    });
  }

  public getSolidPrimaryBackgroundStyles(size: ButtonSize): ButtonStyles {
    return this.getSolidBackgroundStyles(
      size,
      config.styles.primaryColor,
      'white',
    );
  }

  public getSolidGreenBackgroundStyles(size: ButtonSize): ButtonStyles {
    return this.getSolidBackgroundStyles(
      size,
      config.styles.greenColor,
      'white',
    );
  }

  public getSolidGreyBackgroundStyles(size: ButtonSize): ButtonStyles {
    return this.getSolidBackgroundStyles(size, '#ddd', '#444');
  }

  public getOutlineStyles(size: ButtonSize, textColor: string): ButtonStyles {
    return this.baseStyles({
      kind: 'outline',
      size,
      textColor,
    });
  }

  public getGreyOutlineStyles(size: ButtonSize): ButtonStyles {
    return this.getOutlineStyles(size, '#777');
  }

  public getPrimaryOutlineStyles(size: ButtonSize): ButtonStyles {
    return this.getOutlineStyles(size, config.styles.primaryColor);
  }

  public getGreenOutlineStyles(size: ButtonSize): ButtonStyles {
    return this.getOutlineStyles(size, config.styles.greenColor);
  }
}

export const fullRoundedButtonStyles = new FullRoundedButtonStyles();
