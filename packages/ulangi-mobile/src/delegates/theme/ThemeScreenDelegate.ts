/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableThemeScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { ThemeSelectionMenuDelegate } from './ThemeSelectionMenuDelegate';

@boundClass
export class ThemeScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableThemeScreen;
  private themeSelectionMenuDelegate: ThemeSelectionMenuDelegate;
  private dialogDelegate: DialogDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableThemeScreen,
    themeSelectionMenuDelegate: ThemeSelectionMenuDelegate,
    dialogDelegate: DialogDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.themeSelectionMenuDelegate = themeSelectionMenuDelegate;
    this.dialogDelegate = dialogDelegate;
  }

  public showThemeSelectionMenu(): void {
    this.themeSelectionMenuDelegate.show(
      this.observableScreen.settings.trigger,
      (trigger): void => {
        this.observableScreen.settings.trigger = trigger;
      },
    );
  }

  public save(): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__EDIT, {
        user: {
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_THEME,
              dataValue: {
                trigger: this.observableScreen.settings.trigger,
              },
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
