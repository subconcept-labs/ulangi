import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableDataSharingScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { DialogDelegate } from '../dialog/DialogDelegate';

@boundClass
export class DataSharingScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableDataSharingScreen;
  private dialogDelegate: DialogDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableDataSharingScreen,
    dialogDelegate: DialogDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
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
            this.dialogDelegate.showSavingDialog();
          },
        ),
        once(
          ActionType.USER__EDIT_SUCCEEDED,
          (): void => {
            this.dialogDelegate.showSaveSucceededDialog();
          },
        ),
        once(
          ActionType.USER__EDIT_FAILED,
          (errorBag): void => {
            this.dialogDelegate.showSaveFailedDialog(errorBag);
          },
        ),
      ),
    );
  }
}
