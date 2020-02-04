/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableFeatureManagementScreen,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { toJS } from 'mobx';

import { DialogDelegate } from '../dialog/DialogDelegate';

@boundClass
export class FeatureManagementScreenDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableFeatureManagementScreen;
  private dialogDelegate: DialogDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableScreen: ObservableFeatureManagementScreen,
    dialogDelegate: DialogDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
  }

  public save(): void {
    this.eventBus.pubsub(
      createAction(ActionType.SET__EDIT, {
        set: {
          setId: this.setStore.existingCurrentSet.setId,
          extraData: [
            {
              dataName: SetExtraDataName.SET_FEATURE_SETTINGS,
              dataValue: toJS(this.observableScreen.featureSettings),
            },
          ],
        },
      }),
      group(
        on(
          ActionType.SET__EDITING,
          (): void => {
            this.dialogDelegate.showSavingDialog();
          },
        ),
        once(
          ActionType.SET__EDIT_SUCCEEDED,
          (): void => {
            this.dialogDelegate.showSaveSucceededDialog();
          },
        ),
        once(
          ActionType.SET__EDIT_FAILED,
          (errorBag): void => {
            this.dialogDelegate.showSaveFailedDialog(errorBag);
          },
        ),
      ),
    );
  }
}
