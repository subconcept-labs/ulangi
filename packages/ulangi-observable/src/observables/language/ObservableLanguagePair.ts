/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { LanguagePair } from '@ulangi/ulangi-common/interfaces';
import { computed, observable } from 'mobx';

import { ObservableRemoteConfigStore } from '../stores/ObservableRemoteConfigStore';
import { ObservableLanguage } from './ObservableLanguage';

export class ObservableLanguagePair {
  @observable
  public learningLanguageCode: string;

  @observable
  public translatedToLanguageCode: string;

  @observable
  public builtInDictionary: boolean;

  @observable
  public showPremadeFlashcards?: boolean;

  @observable
  public disabled?: boolean;

  @observable
  public priority?: number;

  @computed
  public get learningLanguage(): ObservableLanguage {
    return assertExists(
      this.remoteConfigStore.existingRemoteConfig.languages.find(
        (language): boolean =>
          language.languageCode === this.learningLanguageCode
      ),
      'language must not be null or undefined'
    );
  }

  @computed
  public get translatedToLanguage(): ObservableLanguage {
    return assertExists(
      this.remoteConfigStore.existingRemoteConfig.languages.find(
        (language): boolean =>
          language.languageCode === this.translatedToLanguageCode
      ),
      'language must not be null or undefined'
    );
  }

  public get raw(): LanguagePair {
    return {
      learningLanguageCode: this.learningLanguageCode,
      translatedToLanguageCode: this.translatedToLanguageCode,
      builtInDictionary: this.builtInDictionary,
      disabled: this.disabled,
      showPremadeFlashcards: this.showPremadeFlashcards,
      priority: this.priority,
    };
  }

  private remoteConfigStore: ObservableRemoteConfigStore;

  public constructor(
    remoteConfigStore: ObservableRemoteConfigStore,
    learningLanguageCode: string,
    translatedToLanguageCode: string,
    builtInDictionary: boolean,
    showPremadeFlashcards: undefined | boolean,
    disabled: undefined | boolean,
    priority: undefined | number
  ) {
    this.remoteConfigStore = remoteConfigStore;
    this.learningLanguageCode = learningLanguageCode;
    this.translatedToLanguageCode = translatedToLanguageCode;
    this.builtInDictionary = builtInDictionary;
    this.showPremadeFlashcards = showPremadeFlashcards;
    this.disabled = disabled;
    this.priority = priority;
  }
}
