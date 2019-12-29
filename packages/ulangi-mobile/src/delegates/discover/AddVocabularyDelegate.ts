/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  PublicVocabularyConverter,
  TranslationConverter,
} from '@ulangi/ulangi-common/converters';
import {
  PublicVocabulary,
  TranslationWithLanguages,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableSetStore } from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';

export class AddVocabularyDelegate {
  private publicVocabularyConverter = new PublicVocabularyConverter();
  private translationConverter = new TranslationConverter();

  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private analytics: AnalyticsAdapter;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    analytics: AnalyticsAdapter,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.analytics = analytics;
  }

  public addVocabularyFromPublicVocabulary(
    publicVocabulary: PublicVocabulary,
    categoryName: undefined | string,
    callback: {
      onAdding: () => void;
      onAddSucceeded: () => void;
      onAddFailed: (errorCode: string) => void;
    },
  ): void {
    this.analytics.logEvent('add_vocab_from_dictionary');
    const vocabulary = this.publicVocabularyConverter.convertToVocabulary(
      publicVocabulary,
      categoryName,
    );
    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__ADD, {
        vocabulary,
        setId: this.setStore.existingCurrentSetId,
      }),
      group(
        on(ActionType.VOCABULARY__ADDING, callback.onAdding),
        once(ActionType.VOCABULARY__ADD_SUCCEEDED, callback.onAddSucceeded),
        once(
          ActionType.VOCABULARY__ADD_FAILED,
          ({ errorCode }): void => callback.onAddFailed(errorCode),
        ),
      ),
    );
  }

  public addVocabularyFromPublicVocabularyList(
    vocabularyList: readonly PublicVocabulary[],
    categoryName: undefined | string,
    callback: {
      onAddingAll: () => void;
      onAddAllSucceeded: () => void;
      onAddAllFailed: (errorCode: string) => void;
    },
  ): void {
    this.analytics.logEvent('add_vocab_from_list');
    const newVocabularyList = vocabularyList.map(
      (vocabulary): Vocabulary => {
        return this.publicVocabularyConverter.convertToVocabulary(
          {
            ...vocabulary,
          },
          categoryName,
        );
      },
    );
    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__ADD_MULTIPLE, {
        vocabularyList: newVocabularyList,
        setId: this.setStore.existingCurrentSetId,
      }),
      group(
        on(ActionType.VOCABULARY__ADDING_MULTIPLE, callback.onAddingAll),
        once(
          ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED,
          callback.onAddAllSucceeded,
        ),
        once(
          ActionType.VOCABULARY__ADD_MULTIPLE_FAILED,
          ({ errorCode }): void => callback.onAddAllFailed(errorCode),
        ),
      ),
    );
  }

  public addVocabularyFromTranslation(
    translationWithLanguages: TranslationWithLanguages,
    callback: {
      onAdding: () => void;
      onAddSucceeded: () => void;
      onAddFailed: (errorCode: string) => void;
    },
  ): void {
    this.analytics.logEvent('add_vocab_from_translation');
    const translation = this.translationConverter.convertToTranslation(
      translationWithLanguages,
      this.setStore.existingCurrentSet.learningLanguageCode,
      this.setStore.existingCurrentSet.translatedToLanguageCode,
    );

    const newVocabulary = this.translationConverter.convertToVocabulary(
      translation,
    );

    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__ADD, {
        vocabulary: newVocabulary,
        setId: this.setStore.existingCurrentSetId,
      }),
      group(
        on(ActionType.VOCABULARY__ADDING, callback.onAdding),
        once(ActionType.VOCABULARY__ADD_SUCCEEDED, callback.onAddSucceeded),
        once(
          ActionType.VOCABULARY__ADD_FAILED,
          ({ errorCode }): void => callback.onAddFailed(errorCode),
        ),
      ),
    );
  }
}
