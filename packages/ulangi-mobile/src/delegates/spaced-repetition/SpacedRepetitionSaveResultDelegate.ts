/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { Feedback } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import { ObservableMap } from 'mobx';

import { AutoArchiveSettingsDelegate } from '../auto-archive/AutoArchiveSettingsDelegate';

export class SpacedRepetitionSaveResultDelegate {
  private eventBus: EventBus;
  private vocabularyList: ObservableMap<string, ObservableVocabulary>;
  private feedbackList: ObservableMap<string, Feedback>;
  private autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate;

  public constructor(
    eventBus: EventBus,
    vocabularyList: ObservableMap<string, ObservableVocabulary>,
    feedbackList: ObservableMap<string, Feedback>,
    autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate,
  ) {
    this.eventBus = eventBus;
    this.vocabularyList = vocabularyList;
    this.feedbackList = feedbackList;
    this.autoArchiveSettingsDelegate = autoArchiveSettingsDelegate;
  }

  public save(callback: {
    onSaving: () => void;
    onSaveSucceeded: () => void;
    onSaveFailed: (errorBag: ErrorBag) => void;
  }): void {
    const autoArchiveSettings = this.autoArchiveSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.SPACED_REPETITION__SAVE_RESULT, {
        vocabularyList: this.vocabularyList,
        feedbackList: this.feedbackList,
        autoArchiveSettings,
      }),
      group(
        on(ActionType.SPACED_REPETITION__SAVING_RESULT, callback.onSaving),
        once(
          ActionType.SPACED_REPETITION__SAVE_RESULT_SUCCEEDED,
          callback.onSaveSucceeded,
        ),
        once(
          ActionType.SPACED_REPETITION__SAVE_RESULT_FAILED,
          (errorBag): void => callback.onSaveFailed(errorBag),
        ),
      ),
    );
  }
}
