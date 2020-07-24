/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  Category,
  Definition,
  LanguagePair,
  PixabayImage,
  PublicDefinition,
  PublicSet,
  PublicVocabulary,
  Set,
  Translation,
  User,
  Vocabulary,
  VocabularyCategory,
  VocabularyWriting,
} from '@ulangi/ulangi-common/interfaces';
import { DictionaryDefinition, DictionaryEntry } from '@ulangi/wiktionary-core';
import { observable } from 'mobx';

import { ObservableCategory } from '../observables/category/ObservableCategory';
import { ObservableDictionaryDefinition } from '../observables/dictionary/ObservableDictionaryDefinition';
import { ObservableDictionaryEntry } from '../observables/dictionary/ObservableDictionaryEntry';
import { ObservablePublicDefinition } from '../observables/discover/ObservablePublicDefinition';
import { ObservablePublicSet } from '../observables/discover/ObservablePublicSet';
import { ObservablePublicVocabulary } from '../observables/discover/ObservablePublicVocabulary';
import { ObservablePixabayImage } from '../observables/image/ObservablePixabayImage';
import { ObservableLanguagePair } from '../observables/language/ObservableLanguagePair';
import { ObservableSet } from '../observables/set/ObservableSet';
import { ObservableRootStore } from '../observables/stores/ObservableRootStore';
import { ObservableTranslation } from '../observables/translation/ObservableTranslation';
import { ObservableUser } from '../observables/user/ObservableUser';
import { ObservableDefinition } from '../observables/vocabulary/ObservableDefinition';
import { ObservableVocabulary } from '../observables/vocabulary/ObservableVocabulary';
import { ObservableVocabularyCategory } from '../observables/vocabulary/ObservableVocabularyCategory';
import { ObservableVocabularyWriting } from '../observables/vocabulary/ObservableVocabularyWriting';

export class ObservableConverter {
  private rootStore: ObservableRootStore;

  public constructor(rootStore: ObservableRootStore) {
    this.rootStore = rootStore;
  }

  public convertToObservableUser(
    user: User,
    isSessionValid: null | boolean
  ): ObservableUser {
    return new ObservableUser(
      user.userId,
      user.email,
      user.membership,
      user.membershipExpiredAt,
      user.updatedAt,
      user.createdAt,
      user.extraData,
      isSessionValid
    );
  }

  public convertToObservableSet(set: Set): ObservableSet {
    return new ObservableSet(
      this.rootStore.remoteConfigStore,
      set.setId,
      set.setName,
      set.learningLanguageCode,
      set.translatedToLanguageCode,
      set.setStatus,
      set.createdAt,
      set.updatedAt,
      set.updatedStatusAt,
      set.firstSyncedAt,
      set.lastSyncedAt,
      set.extraData
    );
  }

  public convertToObservableLanguagePair(
    pair: LanguagePair
  ): ObservableLanguagePair {
    return new ObservableLanguagePair(
      this.rootStore.remoteConfigStore,
      pair.learningLanguageCode,
      pair.translatedToLanguageCode,
      pair.builtInDictionary,
      pair.showPremadeFlashcards,
      pair.disabled,
      pair.priority
    );
  }

  public convertToObservableVocabulary(
    vocabulary: Vocabulary
  ): ObservableVocabulary {
    return new ObservableVocabulary(
      vocabulary.vocabularyId,
      vocabulary.vocabularyText,
      vocabulary.vocabularyStatus,
      vocabulary.definitions.map(
        (definition): ObservableDefinition => {
          return this.convertToObservableDefinition(definition);
        }
      ),
      vocabulary.level,
      vocabulary.lastLearnedAt,
      vocabulary.createdAt,
      vocabulary.updatedAt,
      vocabulary.updatedStatusAt,
      vocabulary.firstSyncedAt,
      vocabulary.lastSyncedAt,
      vocabulary.extraData.slice(),
      typeof vocabulary.category !== 'undefined'
        ? this.convertToObservableVocabularyCategory(vocabulary.category)
        : undefined,
      typeof vocabulary.writing !== 'undefined'
        ? this.convertToObservableVocabularyWriting(vocabulary.writing)
        : undefined,
      false
    );
  }

  public convertToObservableVocabularyCategory(
    vocabularyWriting: VocabularyCategory
  ): ObservableVocabularyCategory {
    return new ObservableVocabularyCategory(
      vocabularyWriting.categoryName,
      vocabularyWriting.createdAt,
      vocabularyWriting.updatedAt,
      vocabularyWriting.firstSyncedAt,
      vocabularyWriting.lastSyncedAt
    );
  }
  public convertToObservableVocabularyWriting(
    vocabularyWriting: VocabularyWriting
  ): ObservableVocabularyWriting {
    return new ObservableVocabularyWriting(
      vocabularyWriting.level,
      vocabularyWriting.lastWrittenAt,
      vocabularyWriting.disabled,
      vocabularyWriting.createdAt,
      vocabularyWriting.updatedAt,
      vocabularyWriting.firstSyncedAt,
      vocabularyWriting.lastSyncedAt
    );
  }

  public convertToObservableDefinition(
    definition: Definition
  ): ObservableDefinition {
    return new ObservableDefinition(
      definition.definitionId,
      definition.definitionStatus,
      definition.meaning,
      definition.wordClasses,
      definition.source,
      definition.createdAt,
      definition.updatedAt,
      definition.updatedStatusAt,
      definition.firstSyncedAt,
      definition.lastSyncedAt,
      definition.extraData.slice()
    );
  }

  public convertToObservableCategory(category: Category): ObservableCategory {
    return new ObservableCategory(
      category.categoryName,
      category.totalCount,
      category.srLevel0Count,
      category.srLevel1To3Count,
      category.srLevel4To6Count,
      category.srLevel7To8Count,
      category.srLevel9To10Count,
      category.wrLevel0Count,
      category.wrLevel1To3Count,
      category.wrLevel4To6Count,
      category.wrLevel7To8Count,
      category.wrLevel9To10Count,
      false
    );
  }

  public convertToObservableDictionaryEntry(
    dictionaryEntry: DictionaryEntry
  ): ObservableDictionaryEntry {
    return new ObservableDictionaryEntry(
      dictionaryEntry.vocabularyTerm,
      dictionaryEntry.definitions.map(
        (definition): ObservableDictionaryDefinition => {
          return this.convertToObservableDictionaryDefinition(definition);
        }
      ),
      dictionaryEntry.categories,
      dictionaryEntry.tags,
      dictionaryEntry.ipa,
      dictionaryEntry.gender,
      dictionaryEntry.plural,
      dictionaryEntry.pinyin,
      dictionaryEntry.zhuyin,
      dictionaryEntry.simplified,
      dictionaryEntry.traditional,
      dictionaryEntry.hiragana,
      dictionaryEntry.reading,
      dictionaryEntry.romaji,
      dictionaryEntry.romanization,
      dictionaryEntry.feminine,
      dictionaryEntry.masculine,
      dictionaryEntry.sources
    );
  }

  public convertToObservableDictionaryDefinition(
    definition: DictionaryDefinition
  ): ObservableDictionaryDefinition {
    return new ObservableDictionaryDefinition(
      definition.wordClasses,
      definition.meaning,
      definition.source,
      false
    );
  }

  public convertToObservableTranslation(
    translation: Translation
  ): ObservableTranslation {
    return new ObservableTranslation(
      translation.sourceText,
      translation.translatedText,
      translation.translatedBy,
      false
    );
  }

  public convertToObservablePublicSet(
    publicSet: PublicSet
  ): ObservablePublicSet {
    return new ObservablePublicSet(
      publicSet.publicSetId,
      publicSet.title,
      publicSet.subtitle,
      publicSet.difficulty,
      observable.array(publicSet.tags.slice()),
      observable.array(
        publicSet.vocabularyList.map(
          (vocabulary): ObservablePublicVocabulary => {
            return this.convertToObservablePublicVocabulary(vocabulary);
          }
        )
      ),
      observable.array(publicSet.authors.slice()),
      publicSet.isCurated
    );
  }

  public convertToObservablePublicVocabulary(
    publicVocabulary: PublicVocabulary
  ): ObservablePublicVocabulary {
    return new ObservablePublicVocabulary(
      publicVocabulary.publicVocabularyId,
      publicVocabulary.vocabularyText,
      observable.array(
        publicVocabulary.definitions.map(
          (definition): ObservablePublicDefinition => {
            return this.convertToObservablePublicDefinition(definition);
          }
        )
      ),
      observable.array(publicVocabulary.categories.slice()),
      typeof publicVocabulary.sources !== 'undefined'
        ? observable.array(publicVocabulary.sources.slice())
        : undefined
    );
  }

  public convertToObservablePublicDefinition(
    publicDefinition: PublicDefinition
  ): ObservablePublicDefinition {
    return new ObservablePublicDefinition(
      publicDefinition.meaning,
      publicDefinition.wordClasses,
      publicDefinition.source
    );
  }

  public convertToObservablePixabayImage(
    image: PixabayImage
  ): ObservablePixabayImage {
    return new ObservablePixabayImage(
      image.id,
      image.previewURL,
      image.previewWidth,
      image.previewHeight,
      image.webformatURL,
      image.webformatWidth,
      image.webformatHeight,
      image.largeImageURL,
      observable.box(false)
    );
  }
}
