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

export class QuizSettingsDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;

  public constructor(eventBus: EventBus, setStore: ObservableSetStore) {
    this.eventBus = eventBus;
    this.setStore = setStore;
  }

  public getCurrentSettings(): {
    vocabularyPool: 'active' | 'learned';
    multipleChoiceQuizSize: number;
    writingQuizSize: number;
    writingAutoShowKeyboard: boolean;
    writingHighlightOnError: boolean;
  } {
    const vocabularyPool =
      typeof this.setStore.existingCurrentSet.quizVocabularyPool !== 'undefined'
        ? this.setStore.existingCurrentSet.quizVocabularyPool
        : config.quiz.defaultVocabularyPool;

    const multipleChoiceQuizSize =
      typeof this.setStore.existingCurrentSet.quizMultipleChoiceMaxLimit !==
      'undefined'
        ? this.setStore.existingCurrentSet.quizMultipleChoiceMaxLimit
        : config.quiz.multipleChoice.defaultQuizSize;

    const writingQuizSize =
      typeof this.setStore.existingCurrentSet.quizWritingMaxLimit !==
      'undefined'
        ? this.setStore.existingCurrentSet.quizWritingMaxLimit
        : config.quiz.writing.defaultQuizSize;

    const writingAutoShowKeyboard =
      typeof this.setStore.existingCurrentSet.quizWritingAutoShowKeyboard !==
      'undefined'
        ? this.setStore.existingCurrentSet.quizWritingAutoShowKeyboard
        : config.quiz.writing.defaultAutoShowKeyboard;

    const writingHighlightOnError =
      typeof this.setStore.existingCurrentSet.quizWritingHighlightOnError !==
      'undefined'
        ? this.setStore.existingCurrentSet.quizWritingHighlightOnError
        : config.quiz.writing.defaultHighlightOnError;

    return {
      vocabularyPool,
      multipleChoiceQuizSize,
      writingQuizSize,
      writingAutoShowKeyboard,
      writingHighlightOnError,
    };
  }

  public saveSettings(
    newSettings: {
      vocabularyPool: 'learned' | 'active';
      multipleChoiceQuizSize: number;
      writingQuizSize: number;
      writingAutoShowKeyboard: boolean;
      writingHighlightOnError: boolean;
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
    if (originalSettings.vocabularyPool !== newSettings.vocabularyPool) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_VOCABULARY_POOL,
        dataValue: newSettings.vocabularyPool,
      });
    }

    if (
      originalSettings.multipleChoiceQuizSize !==
      newSettings.multipleChoiceQuizSize
    ) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_MULTIPLE_CHOICE_MAX_LIMIT,
        dataValue: newSettings.multipleChoiceQuizSize,
      });
    }

    if (originalSettings.writingQuizSize !== newSettings.writingQuizSize) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_WRITING_MAX_LIMIT,
        dataValue: newSettings.writingQuizSize,
      });
    }

    if (
      originalSettings.writingAutoShowKeyboard !==
      newSettings.writingAutoShowKeyboard
    ) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_WRITING_AUTO_SHOW_KEYBOARD,
        dataValue: newSettings.writingAutoShowKeyboard,
      });
    }

    if (
      originalSettings.writingHighlightOnError !==
      newSettings.writingHighlightOnError
    ) {
      editedExtraData.push({
        dataName: SetExtraDataName.QUIZ_WRITING_HIGHLIGHT_ON_ERROR,
        dataValue: newSettings.writingHighlightOnError,
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
          (errorBag): void => callback.onSaveFailed(errorBag),
        ),
      ),
    );
  }
}
