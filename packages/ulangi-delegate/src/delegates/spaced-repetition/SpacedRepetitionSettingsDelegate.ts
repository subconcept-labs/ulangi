/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ReviewPriority,
  ReviewStrategy,
  SetExtraDataName,
} from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableSetStore } from '@ulangi/ulangi-observable';

interface SpacedRepetittionConfig {
  readonly maxPerLesson: number;
  readonly defaultInitialInterval: number;
  readonly defaultReviewStrategy: ReviewStrategy;
  readonly defaultReviewPriority: ReviewPriority;
  readonly defaultFeedbackButtons: 3 | 4 | 5;
  readonly defaultAutoplayAudio: boolean;
}

export class SpacedRepetitionSettingsDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private config: SpacedRepetittionConfig;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    config: SpacedRepetittionConfig
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.config = config;
  }

  public getCurrentSettings(): {
    initialInterval: number;
    limit: number;
    reviewStrategy: ReviewStrategy;
    reviewPriority: ReviewPriority;
    feedbackButtons: 3 | 4 | 5;
    autoplayAudio: boolean;
  } {
    const initialInterval =
      typeof this.setStore.existingCurrentSet
        .spacedRepetitionInitialInterval !== 'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionInitialInterval
        : this.config.defaultInitialInterval;

    const limit =
      typeof this.setStore.existingCurrentSet.spacedRepetitionMaxLimit !==
      'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionMaxLimit
        : this.config.maxPerLesson;

    const reviewStrategy =
      typeof this.setStore.existingCurrentSet.spacedRepetitionReviewStrategy !==
      'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionReviewStrategy
        : this.config.defaultReviewStrategy;

    const reviewPriority =
      typeof this.setStore.existingCurrentSet.spacedRepetitionReviewPriority !==
      'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionReviewPriority
        : this.config.defaultReviewPriority;

    const feedbackButtons =
      typeof this.setStore.existingCurrentSet
        .spacedRepetitionFeedbackButtons !== 'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionFeedbackButtons
        : this.config.defaultFeedbackButtons;

    const autoplayAudio =
      typeof this.setStore.existingCurrentSet.spacedRepetitionAutoplayAudio !==
      'undefined'
        ? this.setStore.existingCurrentSet.spacedRepetitionAutoplayAudio
        : this.config.defaultAutoplayAudio;

    return {
      initialInterval,
      limit,
      reviewStrategy,
      reviewPriority,
      feedbackButtons,
      autoplayAudio,
    };
  }

  public saveSettings(
    newSettings: {
      initialInterval: number;
      limit: number;
      reviewStrategy: ReviewStrategy;
      reviewPriority: ReviewPriority;
      feedbackButtons: 3 | 4 | 5;
      autoplayAudio: boolean;
    },
    callback: {
      onSaving: () => void;
      onSaveSucceeded: () => void;
      onSaveFailed: (errorBag: ErrorBag) => void;
    }
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

    if (originalSettings.reviewStrategy !== newSettings.reviewStrategy) {
      editedExtraData.push({
        dataName: SetExtraDataName.SPACED_REPETITION_REVIEW_STRATEGY,
        dataValue: newSettings.reviewStrategy,
      });
    }

    if (originalSettings.reviewPriority !== newSettings.reviewPriority) {
      editedExtraData.push({
        dataName: SetExtraDataName.SPACED_REPETITION_REVIEW_PRIORITY,
        dataValue: newSettings.reviewPriority,
      });
    }

    if (originalSettings.feedbackButtons !== newSettings.feedbackButtons) {
      editedExtraData.push({
        dataName: SetExtraDataName.SPACED_REPETITION_FEEDBACK_BUTTONS,
        dataValue: newSettings.feedbackButtons,
      });
    }

    if (originalSettings.autoplayAudio !== newSettings.autoplayAudio) {
      editedExtraData.push({
        dataName: SetExtraDataName.SPACED_REPETITION_AUTOPLAY_AUDIO,
        dataValue: newSettings.autoplayAudio,
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
          (errorBag): void => callback.onSaveFailed(errorBag)
        )
      )
    );
  }
}
