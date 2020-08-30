import { assertExists } from '@ulangi/assert';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';

import { config } from '../constants/config';

export class TextButtonStyles {
  protected readonly heightBySize: Map<ButtonSize, number> = new Map([
    [ButtonSize.X_LARGE, 52],
    [ButtonSize.LARGE, 46],
    [ButtonSize.NORMAL, 36],
    [ButtonSize.SMALL, 26],
    [ButtonSize.X_SMALL, 22],
  ]);

  protected readonly paddingHorizontalBySize: Map<ButtonSize, number> = new Map(
    [
      [ButtonSize.X_LARGE, 26],
      [ButtonSize.LARGE, 22],
      [ButtonSize.NORMAL, 18],
      [ButtonSize.SMALL, 14],
      [ButtonSize.X_SMALL, 10],
    ],
  );

  protected readonly fontSizeBySize: Map<ButtonSize, number> = new Map([
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

  public baseStyles(options: {
    size: ButtonSize;
    fontWeight: 'normal' | 'bold';
  }): ButtonStyles {
    const { size, fontWeight } = options;

    const buttonStyle = {
      height: `${this.getHeightBySize(size)}px`,
      paddingLeft: `${this.getPaddingHorizontalBySize(size)}px`,
      paddingRight: `${this.getPaddingHorizontalBySize(size)}px`,
      background: 'transparent'
    };

    const textStyle = {
      color: config.styles.primaryColor,
      fontSize: this.getFontSizelBySize(size),
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

  public getNormalStyles(size: ButtonSize): ButtonStyles {
    return this.baseStyles({
      size,
      fontWeight: 'normal',
    });
  }

  public getBoldStyles(size: ButtonSize): ButtonStyles {
    return this.baseStyles({
      size,
      fontWeight: 'bold',
    });
  }
}

export const textButtonStyles = new TextButtonStyles();
