import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableDataSharingScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class DataSharingScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableDataSharingScreen;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableDataSharingScreen,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public toggle(): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__EDIT, {
        user: {
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_DATA_SHARING,
              dataValue: !this.observableScreen.optedIn,
            },
          ],
        },
      }),
      group(
        on(
          ActionType.USER__EDITING,
          (): void => {
            this.showSavingDialog();
          },
        ),
        once(
          ActionType.USER__EDIT_SUCCEEDED,
          (): void => {
            this.showSaveSucceededDialog();
          },
        ),
        once(
          ActionType.USER__EDIT_FAILED,
          ({ errorCode }): void => {
            this.showSaveFailedDialog(errorCode);
          },
        ),
      ),
    );
  }

  private showSavingDialog(): void {
    this.dialogDelegate.show({
      message: 'Saving. Please wait...',
    });
  }

  private showSaveSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Saved successfully.',
      onClose: (): void => {
        this.navigatorDelegate.pop();
      },
    });
  }

  private showSaveFailedDialog(errorCode: string): void {
    this.dialogDelegate.showFailedDialog(errorCode, {
      title: 'SAVE FAILED',
    });
  }
}
