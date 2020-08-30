import { assertExists } from '@ulangi/assert';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { textButtonStyles } from './TextButtonStyles';

export type RoundedCornerButtonOptions =
  | OutlineRoundedCornerButtonOptions
  | SolidRoundedCornerButtonOptions;

export interface SolidRoundedCornerButtonOptions {
  kind: 'solid';
  size: ButtonSize;
  borderRadius: string;
  textColor: string;
  backgroundColor: string;
}

export interface OutlineRoundedCornerButtonOptions {
  kind: 'outline';
  size: ButtonSize;
  borderRadius: string;
  textColor: string;
}

export class RoundedCornerButtonStyles {
  protected readonly borderWidthBySize: Map<ButtonSize, number> = new Map([
    [ButtonSize.X_LARGE, 4],
    [ButtonSize.LARGE, 3],
    [ButtonSize.NORMAL, 2],
    [ButtonSize.SMALL, 1],
    [ButtonSize.X_SMALL, 1],
  ]);

  public getBorderWidthBySize(size: ButtonSize): number {
    return assertExists(this.borderWidthBySize.get(size));
  }

  public baseStyles(options: RoundedCornerButtonOptions): ButtonStyles {
    const { size, borderRadius, textColor } = options;

    const buttonStyle =
      options.kind === 'solid'
        ? {
            borderRadius,
            backgroundColor: options.backgroundColor,
          }
        : {
            borderRadius,
            borderWidth: this.getBorderWidthBySize(size),
            borderStyle: 'solid',
            borderColor: textColor,
          };

    const textStyle = {
      color: textColor,
    };

    const disabledButtonStyle =
      options.kind === 'solid'
        ? {
            backgroundColor: '#999',
          }
        : {
            borderColor: '#999',
          };

    return _.merge(
      {},
      textButtonStyles.baseStyles({
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

  public getSolidBackgroundStyles(
    size: ButtonSize,
    borderRadius: string,
    backgroundColor: string,
    textColor: string,
  ): ButtonStyles {
    return this.baseStyles({
      kind: 'solid',
      size,
      borderRadius,
      textColor,
      backgroundColor,
    });
  }

  public getOutlineStyles(
    size: ButtonSize,
    borderRadius: string,
    textColor: string,
  ): ButtonStyles {
    return this.baseStyles({
      kind: 'outline',
      size,
      borderRadius,
      textColor,
    });
  }
}

export const roundedCornerButtonStyles = new RoundedCornerButtonStyles();
