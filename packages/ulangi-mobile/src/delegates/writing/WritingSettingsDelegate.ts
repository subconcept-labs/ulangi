/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableSetStore } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class WritingSettingsDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;

  public constructor(eventBus: EventBus, setStore: ObservableSetStore) {
    this.eventBus = eventBus;
    this.setStore = setStore;
  }

  public getCurrentSettings(): {
    initialInterval: number;
    limit: number;
    feedbackButtons: 3 | 4 | 5;
  } {
    const initialInterval =
      typeof this.setStore.existingCurrentSet.writingInitialInterval !==
      'undefined'
        ? this.setStore.existingCurrentSet.writingInitialInterval
        : config.writing.defaultInitialInterval;

    const limit =
      typeof this.setStore.existingCurrentSet.writingMaxLimit !== 'undefined'
        ? this.setStore.existingCurrentSet.writingMaxLimit
        : config.writing.maxPerLesson;

    const feedbackButtons =
      typeof this.setStore.existingCurrentSet.writingFeedbackButtons !==
      'undefined'
        ? this.setStore.existingCurrentSet.writingFeedbackButtons
        : config.writing.defaultFeedbackButtons;

    return {
      initialInterval,
      limit,
      feedbackButtons,
    };
  }

  public saveSettings(
    newSettings: {
      initialInterval: number;
      limit: number;
      feedbackButtons: 3 | 4 | 5;
    },
    callback: {
      onSaving: () => void;
      onSaveSucceeded: () => void;
      onSaveFailed: (errorBag: ErrorBag) => void;
    },
  ): void {
    const currentSet = this.setStore.existingCurrentSet;

    const originalSettings = this.getCurrentSettings();

    const editedExtraData: DeepPartial<SetExtraDataItem>[] = [];

    // Only set the cycle interval value if it is changed
    if (originalSettings.initialInterval !== newSettings.initialInterval) {
      editedExtraData.push({
        dataName: SetExtraDataName.WRITING_INITIAL_INTERVAL,
        dataValue: newSettings.initialInterval,
      });
    }

    if (originalSettings.limit !== newSettings.limit) {
      editedExtraData.push({
        dataName: SetExtraDataName.WRITING_MAX_LIMIT,
        dataValue: newSettings.limit,
      });
    }

    if (originalSettings.feedbackButtons !== newSettings.feedbackButtons) {
      editedExtraData.push({
        dataName: SetExtraDataName.WRITING_FEEDBACK_BUTTONS,
        dataValue: newSettings.feedbackButtons,
      });
    }

    const editedSet = {
      setId: currentSet.setId,
      extraData: editedExtraData,
    };

    this.eventBus.pubsub(
      createAction(ActionType.SET__EDIT, { set: editedSet }),
      group(
        on(ActionType.SET__EDITING, callback.onSaving),
        once(ActionType.SET__EDIT_SUCCEEDED, callback.onSaveSucceeded),
        once(
          ActionType.SET__EDIT_FAILED,
          (errorBag): void => {
            callback.onSaveFailed(errorBag);
          },
        ),
      ),
    );
  }
}
