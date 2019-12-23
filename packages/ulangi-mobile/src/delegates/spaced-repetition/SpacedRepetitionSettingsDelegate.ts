/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableSetStore } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class SpacedRepetitionSettingsDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;

  public constructor(eventBus: EventBus, setStore: ObservableSetStore) {
    this.eventBus = eventBus;
    this.setStore = setStore;
  }

  public getCurrentSettings(): {
    initialInterval: number;
    limit: number;
  } {
    const initialInterval =
      typeof this.setStore.existingCurrentSet
        .spacedRepetitionInitialInterval !== 'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionInitialInterval
        : config.spacedRepetition.defaultInitialInterval;

    const limit =
      typeof this.setStore.existingCurrentSet.spacedRepetitionMaxLimit !==
      'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionMaxLimit
        : config.spacedRepetition.maxPerLesson;

    return {
      initialInterval,
      limit,
    };
  }

  public saveSettings(
    newSettings: {
      initialInterval: number;
      limit: number;
    },
    callback: {
      onSaving: () => void;
      onSaveSucceeded: () => void;
      onSaveFailed: (errorCode: string) => void;
    },
  ): void {
    const currentSet = this.setStore.existingCurrentSet;

    const originalSettings = this.getCurrentSettings();

    const editedExtraData: DeepPartial<SetExtraDataItem>[] = [];

    if (originalSettings.initialInterval !== newSettings.initialInterval) {
      editedExtraData.push({
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: newSettings.initialInterval,
      });
    }

    if (originalSettings.limit !== newSettings.limit) {
      editedExtraData.push({
        dataName: SetExtraDataName.SPACED_REPETITION_MAX_LIMIT,
        dataValue: newSettings.limit,
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
          ({ errorCode }): void => callback.onSaveFailed(errorCode),
        ),
      ),
    );
  }
}
