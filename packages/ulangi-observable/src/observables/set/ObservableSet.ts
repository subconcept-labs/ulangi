/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ReviewPriority,
  ReviewStrategy,
  SetExtraDataName,
  SetStatus,
} from '@ulangi/ulangi-common/enums';
import {
  FeatureSettings,
  QuizMultipleChoiceMaxLimit,
  QuizVocabularyPool,
  QuizWritingAutoShowKeyboard,
  QuizWritingMaxLimit,
  Set,
  SetFeatureSettings,
  SpacedRepetitionAutoplayAudio,
  SpacedRepetitionFeedbackButtons,
  SpacedRepetitionInitialInterval,
  SpacedRepetitionMaxLimit,
  SpacedRepetitionReviewPriority,
  SpacedRepetitionReviewStrategy,
  WritingAutoShowKeyboard,
  WritingAutoplayAudio,
  WritingFeedbackButtons,
  WritingInitialInterval,
  WritingMaxLimit,
  WritingReviewPriority,
} from '@ulangi/ulangi-common/interfaces';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import { computed, observable } from 'mobx';

import { ObservableLanguage } from '../language/ObservableLanguage';
import { ObservableRemoteConfigStore } from '../stores/ObservableRemoteConfigStore';

export class ObservableSet {
  @observable
  public setId: string;

  @observable
  public setName: string;

  @observable
  public learningLanguageCode: string;

  @observable
  public translatedToLanguageCode: string;

  @observable
  public setStatus: SetStatus;

  @observable
  public createdAt: Date;

  @observable
  public updatedAt: Date;

  @observable
  public updatedStatusAt: Date;

  @observable
  public firstSyncedAt: null | Date;

  @observable
  public lastSyncedAt: null | Date;

  @observable
  public extraData: readonly SetExtraDataItem[];

  @computed
  public get featureSettings(): undefined | FeatureSettings {
    const data = this.extraData.find(
      (data): data is SetFeatureSettings =>
        data.dataName === SetExtraDataName.SET_FEATURE_SETTINGS
    );

    return data ? data.dataValue : undefined;
  }

  @computed
  public get spacedRepetitionAutoplayAudio(): undefined | boolean {
    const data = this.extraData.find(
      (data): data is SpacedRepetitionAutoplayAudio =>
        data.dataName === SetExtraDataName.SPACED_REPETITION_AUTOPLAY_AUDIO
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get spacedRepetitionInitialInterval(): undefined | number {
    const data = this.extraData.find(
      (data): data is SpacedRepetitionInitialInterval =>
        data.dataName === SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get spacedRepetitionMaxLimit(): undefined | number {
    const data = this.extraData.find(
      (data): data is SpacedRepetitionMaxLimit =>
        data.dataName === SetExtraDataName.SPACED_REPETITION_MAX_LIMIT
    );

    return data ? data.dataValue : undefined;
  }

  @computed
  public get spacedRepetitionReviewStrategy(): undefined | ReviewStrategy {
    const data = this.extraData.find(
      (data): data is SpacedRepetitionReviewStrategy =>
        data.dataName === SetExtraDataName.SPACED_REPETITION_REVIEW_STRATEGY
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get spacedRepetitionReviewPriority(): undefined | ReviewPriority {
    const data = this.extraData.find(
      (data): data is SpacedRepetitionReviewPriority =>
        data.dataName === SetExtraDataName.SPACED_REPETITION_REVIEW_PRIORITY
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get spacedRepetitionFeedbackButtons(): undefined | 3 | 4 | 5 {
    const data = this.extraData.find(
      (data): data is SpacedRepetitionFeedbackButtons =>
        data.dataName === SetExtraDataName.SPACED_REPETITION_FEEDBACK_BUTTONS
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get writingAutoplayAudio(): undefined | boolean {
    const data = this.extraData.find(
      (data): data is WritingAutoplayAudio =>
        data.dataName === SetExtraDataName.WRITING_AUTOPLAY_AUDIO
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get writingInitialInterval(): undefined | number {
    const data = this.extraData.find(
      (data): data is WritingInitialInterval =>
        data.dataName === SetExtraDataName.WRITING_INITIAL_INTERVAL
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get writingMaxLimit(): undefined | number {
    const data = this.extraData.find(
      (data): data is WritingMaxLimit =>
        data.dataName === SetExtraDataName.WRITING_MAX_LIMIT
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get writingReviewPriority(): undefined | ReviewPriority {
    const data = this.extraData.find(
      (data): data is WritingReviewPriority =>
        data.dataName === SetExtraDataName.WRITING_REVIEW_PRIORITY
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get writingAutoShowKeyboard(): undefined | boolean {
    const data = this.extraData.find(
      (data): data is WritingAutoShowKeyboard =>
        data.dataName === SetExtraDataName.WRITING_AUTO_SHOW_KEYBOARD
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get writingFeedbackButtons(): undefined | 3 | 4 | 5 {
    const data = this.extraData.find(
      (data): data is WritingFeedbackButtons =>
        data.dataName === SetExtraDataName.WRITING_FEEDBACK_BUTTONS
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get quizVocabularyPool(): undefined | 'learned' | 'active' {
    const data = this.extraData.find(
      (data): data is QuizVocabularyPool =>
        data.dataName === SetExtraDataName.QUIZ_VOCABULARY_POOL
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get quizWritingMaxLimit(): undefined | number {
    const data = this.extraData.find(
      (data): data is QuizWritingMaxLimit =>
        data.dataName === SetExtraDataName.QUIZ_WRITING_MAX_LIMIT
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get quizMultipleChoiceMaxLimit(): undefined | number {
    const data = this.extraData.find(
      (data): data is QuizMultipleChoiceMaxLimit =>
        data.dataName === SetExtraDataName.QUIZ_MULTIPLE_CHOICE_MAX_LIMIT
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get quizWritingAutoShowKeyboard(): undefined | boolean {
    const data = this.extraData.find(
      (data): data is QuizWritingAutoShowKeyboard =>
        data.dataName === SetExtraDataName.QUIZ_WRITING_AUTO_SHOW_KEYBOARD
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get learningLanguage(): ObservableLanguage {
    return assertExists(
      this.remoteConfigStore.existingRemoteConfig.languages.find(
        (language): boolean =>
          language.languageCode === this.learningLanguageCode
      ),
      'learningLanguage must not be null or undefined'
    );
  }

  @computed
  public get languageCodePair(): string {
    return this.learningLanguageCode + '-' + this.translatedToLanguageCode;
  }

  @computed
  public get translatedToLanguage(): ObservableLanguage {
    return assertExists(
      this.remoteConfigStore.existingRemoteConfig.languages.find(
        (language): boolean =>
          language.languageCode === this.translatedToLanguageCode
      ),
      'translatedToLanguage must not be null or undefined'
    );
  }

  @computed
  public get dictionaryAvailable(): boolean {
    const supportedLanguagePairs = this.remoteConfigStore.existingRemoteConfig
      .supportedLanguagePairs;
    const hasDictionary =
      supportedLanguagePairs.findIndex(
        (pair): boolean => {
          return (
            pair.learningLanguageCode === this.learningLanguageCode &&
            pair.translatedToLanguageCode === this.translatedToLanguageCode &&
            pair.builtInDictionary === true
          );
        }
      ) !== -1;
    return hasDictionary;
  }

  @computed
  public get shouldShowPremadeFlashcards(): boolean {
    const supportedLanguagePairs = this.remoteConfigStore.existingRemoteConfig
      .supportedLanguagePairs;
    const shouldShowPremadeFlashcards =
      supportedLanguagePairs.findIndex(
        (pair): boolean => {
          return (
            pair.learningLanguageCode === this.learningLanguageCode &&
            pair.translatedToLanguageCode === this.translatedToLanguageCode &&
            pair.showPremadeFlashcards === true
          );
        }
      ) !== -1;
    return shouldShowPremadeFlashcards;
  }

  @computed
  public get isUsingAnyLanguage(): boolean {
    return (
      this.learningLanguageCode === 'any' ||
      this.translatedToLanguageCode === 'any'
    );
  }

  @computed
  public get isUsingSameSourceTargetLanguages(): boolean {
    return this.learningLanguageCode === this.translatedToLanguageCode;
  }

  public get raw(): Set {
    return {
      setId: this.setId,
      setName: this.setName,
      learningLanguageCode: this.learningLanguageCode,
      translatedToLanguageCode: this.translatedToLanguageCode,
      setStatus: this.setStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      updatedStatusAt: this.updatedStatusAt,
      firstSyncedAt: this.firstSyncedAt,
      lastSyncedAt: this.lastSyncedAt,
      extraData: this.extraData,
    };
  }

  private remoteConfigStore: ObservableRemoteConfigStore;

  public constructor(
    remoteConfigStore: ObservableRemoteConfigStore,
    setId: string,
    setName: string,
    learningLanguageCode: string,
    translatedToLanguageCode: string,
    setStatus: SetStatus,
    createdAt: Date,
    updatedAt: Date,
    updatedStatusAt: Date,
    firstSyncedAt: null | Date,
    lastSyncedAt: null | Date,
    extraData: readonly SetExtraDataItem[]
  ) {
    this.remoteConfigStore = remoteConfigStore;
    this.setId = setId;
    this.setName = setName;
    this.learningLanguageCode = learningLanguageCode;
    this.translatedToLanguageCode = translatedToLanguageCode;
    this.setStatus = setStatus;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedStatusAt = updatedStatusAt;
    this.firstSyncedAt = firstSyncedAt;
    this.lastSyncedAt = lastSyncedAt;
    this.extraData = extraData;
  }
}
