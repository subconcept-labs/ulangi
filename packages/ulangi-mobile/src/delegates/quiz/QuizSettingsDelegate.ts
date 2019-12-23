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

export class QuizSettingsDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;

  public constructor(eventBus: EventBus, setStore: ObservableSetStore) {
    this.eventBus = eventBus;
    this.setStore = setStore;
  }

  public getCurrentSettings(): {
    vocabularyPool: 'active' | 'learned';
    multipleChoiceQuizLimit: number;
    writingQuizLimit: number;
  } {
    const vocabularyPool = this.setStore.existingCurrentSet.quizVocabularyPool
      ? this.setStore.existingCurrentSet.quizVocabularyPool
      : config.quiz.defaultVocabularyPool;

    const multipleChoiceQuizLimit = this.setStore.existingCurrentSet
      .quizMultipleChoiceMaxLimit
      ? this.setStore.existingCurrentSet.quizMultipleChoiceMaxLimit
      : config.quiz.maxPerMultipleChoiceQuiz;

    const writingQuizLimit = this.setStore.existingCurrentSet
      .quizWritingMaxLimit
      ? this.setStore.existingCurrentSet.quizWritingMaxLimit
      : config.quiz.maxPerWritingQuiz;

    return {
      vocabularyPool,
      multipleChoiceQuizLimit,
      writingQuizLimit,
    };
  }

  public saveSettings(
    newSettings: {
      vocabularyPool: 'learned' | 'active';
      multipleChoiceQuizLimit: number;
      writingQuizLimit: number;
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

    // Only set the cycle interval value if it is changed
    if (originalSettings.vocabularyPool !== newSettings.vocabularyPool) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_VOCABULARY_POOL,
        dataValue: newSettings.vocabularyPool,
      });
    }

    if (
      originalSettings.multipleChoiceQuizLimit !==
      newSettings.multipleChoiceQuizLimit
    ) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_MULTIPLE_CHOICE_MAX_LIMIT,
        dataValue: newSettings.multipleChoiceQuizLimit,
      });
    }

    if (originalSettings.writingQuizLimit !== newSettings.writingQuizLimit) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_WRITING_MAX_LIMIT,
        dataValue: newSettings.writingQuizLimit,
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
