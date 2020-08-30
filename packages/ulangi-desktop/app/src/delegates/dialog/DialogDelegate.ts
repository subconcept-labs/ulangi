import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Dialog, ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { ObservableLightBox } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { errorConverter } from '../../converters/ErrorConverter';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class DialogDelegate {
  private observableLightBox: ObservableLightBox;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableLightBox: ObservableLightBox,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableLightBox = observableLightBox;
    this.navigatorDelegate = navigatorDelegate;
  }

  public show(dialog: Dialog): void {
    this.observableLightBox.dialog = dialog;
    this.navigatorDelegate.showLightBox(ScreenName.LIGHT_BOX_DIALOG_SCREEN, {});
  }

  public showSuccessDialog(dialog: Partial<Dialog>): void {
    this.show(
      _.merge(
        {
          testID: 'SUCCESS_DIALOG',
          message: dialog.message || 'Success',
          showCloseButton: true,
          closeOnTouchOutside: true,
        },
        dialog,
      ),
    );
  }

  public showFailedDialog(errorBag: ErrorBag, options?: Partial<Dialog>): void {
    this.show(
      _.merge(
        {
          testID: 'FAILED_DIALOG',
          message: errorConverter.convertToMessage(errorBag),
          showCloseButton: true,
          closeOnTouchOutside: true,
        },
        options,
      ),
    );
  }

  public dismiss(): void {
    this.navigatorDelegate.dismissLightBox();
  }

  public showSavingDialog(): void {
    this.show({
      message: 'Saving. Please wait...',
    });
  }

  public showSaveSucceededDialog(): void {
    this.showSuccessDialog({
      message: 'Saved successfully.',
      onClose: (): void => {
        this.navigatorDelegate.dismissScreen();
      },
    });
  }

  public showSaveFailedDialog(errorBag: ErrorBag): void {
    this.showFailedDialog(errorBag, {
      title: 'SAVE FAILED',
    });
  }
}
