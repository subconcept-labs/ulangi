/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import { VocabularyExtraFields } from '@ulangi/ulangi-common/interfaces';
import { DictionaryEntry } from '@ulangi/wiktionary-core';
import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';

import { ObservableDictionaryEntryState } from '../dictionary/ObservableDictionaryEntryState';
import { ObservableSuggestion } from './ObservableSuggestion';

export class ObservableSuggestionListState {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  @observable
  public currentVocabularyText: string;

  public readonly dictionaryEntryState: ObservableDictionaryEntryState;

  @action
  public reset(currentVocabularyText: string): void {
    this.currentVocabularyText = currentVocabularyText;
    this.dictionaryEntryState.reset();
  }

  @computed
  public get currentVocabularyTerm(): string {
    return this.vocabularyExtraFieldParser.parse(this.currentVocabularyText)
      .vocabularyTerm;
  }

  @computed
  public get currentVocabularyExtraFields(): VocabularyExtraFields {
    return this.vocabularyExtraFieldParser.parse(this.currentVocabularyText)
      .extraFields;
  }

  @computed
  public get suggestionsFromDictionaryEntry(): null | ObservableSuggestion[] {
    if (this.dictionaryEntryState.dictionaryEntry !== null) {
      return this.generateSuggestionsFromDictionaryEntry(
        this.dictionaryEntryState.dictionaryEntry
      );
    } else {
      return null;
    }
  }

  @computed
  public get suggestionsFromTraditionalEntry(): null | ObservableSuggestion[] {
    if (this.dictionaryEntryState.traditionalEntry !== null) {
      return this.generateSuggestionsFromDictionaryEntry(
        this.dictionaryEntryState.traditionalEntry
      );
    } else {
      return null;
    }
  }

  @computed
  public get suggestionsFromMasculineEntry(): null | ObservableSuggestion[] {
    if (this.dictionaryEntryState.masculineEntry !== null) {
      return this.generateSuggestionsFromDictionaryEntry(
        this.dictionaryEntryState.masculineEntry
      );
    } else {
      return null;
    }
  }

  public onSelect: (fieldName: string, value: string) => void;

  public constructor(
    currentVocabularyText: string,
    dictionaryEntryState: ObservableDictionaryEntryState,
    onSelect: (fieldName: string, value: string) => void
  ) {
    this.currentVocabularyText = currentVocabularyText;
    this.dictionaryEntryState = dictionaryEntryState;
    this.onSelect = onSelect;
  }

  private generateSuggestionsFromDictionaryEntry(
    dictionaryEntry: DictionaryEntry
  ): ObservableSuggestion[] {
    const suggestions: ObservableSuggestion[] = [];

    const mapping: {
      [P in keyof Partial<DictionaryEntry>]: {
        fieldName: keyof VocabularyExtraFields;
        message: string;
        importance: 'OPTIONAL' | 'RECOMMENDED';
      }
    } = {
      reading: {
        fieldName: 'reading',
        message: 'Suggested kanji reading(s):',
        importance: 'OPTIONAL',
      },
      hiragana: {
        fieldName: 'hiragana',
        message: 'Suggested hiragana form(s):',
        importance: 'OPTIONAL',
      },
      romaji: {
        fieldName: 'romaji',
        message: 'Suggested romaji:',
        importance: 'OPTIONAL',
      },
      pinyin: {
        fieldName: 'pinyin',
        message: 'Suggested pinyin:',
        importance: 'OPTIONAL',
      },
      zhuyin: {
        fieldName: 'zhuyin',
        message: 'Suggested zhuyin:',
        importance: 'OPTIONAL',
      },
      simplified: {
        fieldName: 'simplified',
        message: 'Suggested simplified form:',
        importance: 'OPTIONAL',
      },
      traditional: {
        fieldName: 'traditional',
        message: 'Suggested traditional form:',
        importance: 'OPTIONAL',
      },
      romanization: {
        fieldName: 'romanization',
        message: 'Suggested romanization:',
        importance: 'OPTIONAL',
      },
      ipa: {
        fieldName: 'ipa',
        message: 'Suggested IPA:',
        importance: 'OPTIONAL',
      },
      gender: {
        fieldName: 'gender',
        message: 'Suggested gender:',
        importance: 'OPTIONAL',
      },
      plural: {
        fieldName: 'plural',
        message: 'Suggested plural form(s):',
        importance: 'OPTIONAL',
      },
      feminine: {
        fieldName: 'female',
        message: 'Suggested feminine form:',
        importance: 'OPTIONAL',
      },
      masculine: {
        fieldName: 'male',
        message: 'Suggested masculine form:',
        importance: 'OPTIONAL',
      },
    };

    for (const key of Object.keys(mapping) as (keyof DictionaryEntry)[]) {
      if (typeof dictionaryEntry[key] !== 'undefined') {
        const { fieldName, message, importance } = assertExists(mapping[key]);

        const suggestedValues = _.difference(
          dictionaryEntry[key] as string[],
          this.currentVocabularyExtraFields[fieldName]
            .map(_.first)
            .filter((value): value is string => _.isUndefined(value))
        );

        if (suggestedValues.length > 0) {
          suggestions.push(
            new ObservableSuggestion(
              importance,
              message,
              observable.array(
                suggestedValues.map(
                  (value): { text: string; onPress: () => void } => {
                    return {
                      text: `+ [${fieldName}: ${value}]`,
                      onPress: (): void => {
                        this.onSelect(fieldName, value);
                      },
                    };
                  }
                )
              )
            )
          );
        }
      }
    }

    return suggestions;
  }
}
