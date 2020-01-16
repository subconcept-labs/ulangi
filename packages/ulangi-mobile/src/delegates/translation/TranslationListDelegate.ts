/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState, ErrorCode } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableSetStore,
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';

export class TranslationListDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private translationListState: ObservableTranslationListState;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    translationListState: ObservableTranslationListState,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.translationListState = translationListState;
  }

  public canTranslate(): boolean {
    return (
      !this.setStore.existingCurrentSet.isUsingAnyLanguage &&
      !this.setStore.existingCurrentSet.isUsingSameSourceTargetLanguages
    );
  }

  public translate(term: string, translator: string): void {
    if (this.setStore.existingCurrentSet.isUsingAnyLanguage) {
      this.translationListState.translateState.set(ActivityState.ERROR);
      this.translationListState.translateError.set(
        ErrorCode.TRANSLATION__SPECIFIC_LANGUAGE_REQUIRED,
      );
    } else if (
      this.setStore.existingCurrentSet.isUsingSameSourceTargetLanguages
    ) {
      this.translationListState.translateState.set(ActivityState.ERROR);
      this.translationListState.translateError.set(
        ErrorCode.TRANSLATION__SAME_SOURCE_DESTINATION_LANGUAGE,
      );
    } else {
      this.eventBus.pubsub(
        createAction(ActionType.TRANSLATION__TRANSLATE, {
          sourceText: term,
          sourceLanguageCode: this.setStore.existingCurrentSet
            .learningLanguageCode,
          translatedToLanguageCode: this.setStore.existingCurrentSet
            .translatedToLanguageCode,
          translator,
        }),
        group(
          on(
            ActionType.TRANSLATION__TRANSLATING,
            (): void => {
              this.translationListState.translateState.set(
                ActivityState.ACTIVE,
              );
            },
          ),
          once(
            ActionType.TRANSLATION__TRANSLATE_SUCCEEDED,
            ({ translations }): void => {
              this.translationListState.isRefreshing.set(false);
              this.translationListState.translateState.set(
                ActivityState.INACTIVE,
              );
              this.translationListState.translations = observable.array(
                translations.slice(),
              );
            },
          ),
          once(
            ActionType.TRANSLATION__TRANSLATE_FAILED,
            (errorBag): void => {
              this.translationListState.isRefreshing.set(false);
              this.translationListState.translateState.set(ActivityState.ERROR);
              this.translationListState.translateError.set(errorBag.errorCode);
            },
          ),
        ),
      );
    }
  }

  public clearTranslations(): void {
    this.translationListState.isRefreshing.set(false);
    this.translationListState.translateState.set(ActivityState.INACTIVE);
    this.translationListState.translateError.set(undefined);
    this.translationListState.translations = null;
    this.eventBus.publish(
      createAction(ActionType.TRANSLATION__CLEAR_TRANSLATIONS, null),
    );
  }

  public translateBidrection(term: string): void {
    if (this.setStore.existingCurrentSet.isUsingAnyLanguage) {
      this.translationListState.translateState.set(ActivityState.ERROR);
      this.translationListState.translateError.set(
        ErrorCode.TRANSLATION__SPECIFIC_LANGUAGE_REQUIRED,
      );
    } else if (
      this.setStore.existingCurrentSet.isUsingSameSourceTargetLanguages
    ) {
      this.translationListState.translateState.set(ActivityState.ERROR);
      this.translationListState.translateError.set(
        ErrorCode.TRANSLATION__SAME_SOURCE_DESTINATION_LANGUAGE,
      );
    } else {
      this.eventBus.pubsub(
        createAction(ActionType.TRANSLATION__TRANSLATE_BIDIRECTION, {
          languageCodePair: this.setStore.existingCurrentSet.languageCodePair,
          sourceText: term,
        }),
        group(
          on(
            ActionType.TRANSLATION__TRANSLATING_BIDIRECTION,
            (): void => {
              this.translationListState.translateState.set(
                ActivityState.ACTIVE,
              );
            },
          ),
          once(
            ActionType.TRANSLATION__TRANSLATE_BIDIRECTION_SUCCEEDED,
            ({ translations }): void => {
              this.translationListState.isRefreshing.set(false);
              this.translationListState.translateState.set(
                ActivityState.INACTIVE,
              );
              this.translationListState.translationsWithLanguages = observable(
                translations.slice(),
              );
            },
          ),
          once(
            ActionType.TRANSLATION__TRANSLATE_BIDIRECTION_FAILED,
            (): void => {
              this.translationListState.isRefreshing.set(false);
              this.translationListState.translateState.set(ActivityState.ERROR);
            },
          ),
        ),
      );
    }
  }

  public clearBidirectionalTranslations(): void {
    this.translationListState.translationsWithLanguages = null;
    this.translationListState.translateState.set(ActivityState.INACTIVE);
    this.translationListState.translateError.set(undefined);
    this.translationListState.isRefreshing.set(false);
    this.eventBus.publish(
      createAction(
        ActionType.TRANSLATION__CLEAR_BIDIRECTIONAL_TRANSLATIONS,
        null,
      ),
    );
  }

  public refreshBidirectionalTranslations(term: string): void {
    this.clearBidirectionalTranslations();
    this.translationListState.isRefreshing.set(true);
    this.translateBidrection(term);
  }
}
