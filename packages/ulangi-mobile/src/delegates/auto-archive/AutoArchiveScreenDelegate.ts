/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableAutoArchiveSettings } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { config } from '../../constants/config';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { LevelSelectionMenuDelegate } from '../vocabulary/LevelSelectionMenuDelegate';

@boundClass
export class AutoArchiveScreenDelegate {
  private eventBus: EventBus;
  private autoArchiveSettings: ObservableAutoArchiveSettings;
  private levelSelectionMenuDelegate: LevelSelectionMenuDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    autoArchiveSettings: ObservableAutoArchiveSettings,
    levelSelectionMenuDelegate: LevelSelectionMenuDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.autoArchiveSettings = autoArchiveSettings;
    this.levelSelectionMenuDelegate = levelSelectionMenuDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public save(): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__EDIT, {
        user: {
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: this.autoArchiveSettings.autoArchiveEnabled,
                spacedRepetitionLevelThreshold: this.autoArchiveSettings
                  .spacedRepetitionLevelThreshold,
                writingLevelThreshold: this.autoArchiveSettings
                  .writingLevelThreshold,
              },
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
            this.showSavaFailedDialog(errorCode);
          },
        ),
      ),
    );
  }

  public showLevelMenuForSpacedRepetition(): void {
    this.levelSelectionMenuDelegate.show(
      [0, config.spacedRepetition.maxLevel],
      this.autoArchiveSettings.spacedRepetitionLevelThreshold,
      (level): void => {
        this.autoArchiveSettings.spacedRepetitionLevelThreshold = level;
      },
    );
  }

  public showLevelMenuForWriting(): void {
    this.levelSelectionMenuDelegate.show(
      [0, config.writing.maxLevel],
      this.autoArchiveSettings.writingLevelThreshold,
      (level): void => {
        this.autoArchiveSettings.writingLevelThreshold = level;
      },
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

  private showSavaFailedDialog(errorCode: string): void {
    this.dialogDelegate.showFailedDialog(errorCode, {
      title: 'SAVE FAILED',
    });
  }
}
