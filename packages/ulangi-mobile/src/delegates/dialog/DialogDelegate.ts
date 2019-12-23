/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { Dialog } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class DialogDelegate {
  private errorConverter = new ErrorConverter();

  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(dialog: Dialog): void {
    this.navigatorDelegate.showDialog(dialog, this.styles);
  }

  public showSuccessDialog(dialog: Partial<Dialog>): void {
    this.navigatorDelegate.showDialog(
      _.merge(
        {
          testID: LightBoxDialogIds.SUCCESS_DIALOG,
          message: dialog.message || 'Success',
          showCloseButton: true,
          closeOnTouchOutside: true,
        },
        dialog,
      ),
      this.styles,
    );
  }

  public showFailedDialog(errorCode: string, dialog: Partial<Dialog>): void {
    this.navigatorDelegate.showDialog(
      _.merge(
        {
          testID: LightBoxDialogIds.FAILED_DIALOG,
          message: this.errorConverter.convertToMessage(errorCode),
          showCloseButton: true,
          closeOnTouchOutside: true,
        },
        dialog,
      ),
      this.styles,
    );
  }

  public dismiss(): void {
    this.navigatorDelegate.dismissLightBox();
  }
}
