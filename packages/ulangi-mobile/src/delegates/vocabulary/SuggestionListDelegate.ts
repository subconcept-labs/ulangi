import { assertExists } from '@ulangi/assert';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState, ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  DictionaryEntry,
  VocabularyExtraFields,
} from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableSuggestion,
  ObservableSuggestionListState,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';

export class SuggestionListDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private suggestionListState: ObservableSuggestionListState;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    suggestionListState: ObservableSuggestionListState,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.suggestionListState = suggestionListState;
  }

  public getSuggestions(
    updateVocabularyText: (extraField: string) => void,
  ): void {
    if (
      this.setStore.existingCurrentSet.learningLanguageCode === 'any' ||
      this.setStore.existingCurrentSet.translatedToLanguageCode === 'any'
    ) {
      this.suggestionListState.fetchState.set(ActivityState.ERROR);
      this.suggestionListState.fetchError.set(
        ErrorCode.SUGGESTION__SPECIFIC_LANAGUAGE_REQUIRED,
      );
    } else if (this.setStore.existingCurrentSet.dictionaryAvailable === false) {
      this.suggestionListState.fetchState.set(ActivityState.ERROR);
      this.suggestionListState.fetchError.set(
        ErrorCode.SUGGESTION__UNSUPPORTED,
      );
    } else {
      this.eventBus.pubsub(
        createAction(ActionType.DICTIONARY__GET_ENTRY, {
          searchTerm: this.suggestionListState.currentVocabularyTerm,
          searchTermLanguageCode: this.setStore.existingCurrentSet
            .learningLanguageCode,
          translatedToLanguageCode: this.setStore.existingCurrentSet
            .translatedToLanguageCode,
        }),
        group(
          on(
            ActionType.DICTIONARY__GETTING_ENTRY,
            (): void => {
              this.suggestionListState.fetchState.set(ActivityState.ACTIVE);
            },
          ),
          once(
            ActionType.DICTIONARY__GET_ENTRY_SUCCEEDED,
            ({ dictionaryEntry }): void => {
              if (dictionaryEntry.definitions.length === 0) {
                this.suggestionListState.fetchState.set(ActivityState.ERROR);
                this.suggestionListState.fetchError.set(
                  ErrorCode.SUGGESTION__NO_RESULTS,
                );
              } else {
                this.suggestionListState.fetchState.set(ActivityState.INACTIVE);
              }

              this.updateSuggestions(dictionaryEntry, updateVocabularyText);
            },
          ),
          once(
            ActionType.DICTIONARY__GET_ENTRY_FAILED,
            (errorBag): void => {
              this.suggestionListState.fetchState.set(ActivityState.ERROR);
              this.suggestionListState.fetchError.set(errorBag.errorCode);
            },
          ),
        ),
      );
    }
  }

  public clearSuggestions(): void {
    this.suggestionListState.fetchState.set(ActivityState.INACTIVE);
    this.suggestionListState.suggestionList = null;
    this.eventBus.publish(
      createAction(ActionType.DICTIONARY__CLEAR_ENTRY, null),
    );
  }

  private updateSuggestions(
    dictionaryEntry: DictionaryEntry,
    updateVocabularyText: (vocabularyText: string) => void,
  ): void {
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
        message: 'Add kanji reading to know how to read it.',
        importance: 'OPTIONAL',
      },
      hiragana: {
        fieldName: 'hiragana',
        message: 'Add hiragana to know how to pronounce it.',
        importance: 'OPTIONAL',
      },
      romaji: {
        fieldName: 'romaji',
        message: 'Add romaji to know how to pronounce it.',
        importance: 'OPTIONAL',
      },
      pinyin: {
        fieldName: 'pinyin',
        message: 'Add pinyin to know how to pronounce it.',
        importance: 'OPTIONAL',
      },
      zhuyin: {
        fieldName: 'zhuyin',
        message: 'Add zhuyin to know how to pronounce it.',
        importance: 'OPTIONAL',
      },
      simplified: {
        fieldName: 'simplified',
        message: 'Add simplified to know how to pronounce it.',
        importance: 'OPTIONAL',
      },
      traditional: {
        fieldName: 'traditional',
        message: 'Add traditional to know how to pronounce it.',
        importance: 'OPTIONAL',
      },
      romanization: {
        fieldName: 'romanization',
        message: 'Add romanization to know how to pronounce it.',
        importance: 'OPTIONAL',
      },
      ipa: {
        fieldName: 'ipa',
        message: 'Add IPA for pronunciation.',
        importance: 'OPTIONAL',
      },
      gender: {
        fieldName: 'gender',
        message: 'Add gender.',
        importance: 'OPTIONAL',
      },
      plural: {
        fieldName: 'plural',
        message: 'Add plural form.',
        importance: 'OPTIONAL',
      },
      feminine: {
        fieldName: 'female',
        message: 'Add feminine form.',
        importance: 'OPTIONAL',
      },
      masculine: {
        fieldName: 'male',
        message: 'Add masculine form.',
        importance: 'OPTIONAL',
      },
    };

    for (const key of Object.keys(mapping) as (keyof DictionaryEntry)[]) {
      if (typeof dictionaryEntry[key] !== 'undefined') {
        const { fieldName, message, importance } = assertExists(mapping[key]);

        const suggestedValues = _.difference(
          dictionaryEntry[key] as string[],
          this.suggestionListState.currentVocabularyExtraFields[fieldName]
            .map(_.first)
            .filter((value): value is string => _.isUndefined(value)),
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
                        this.suggestionListState.currentVocabularyText +=
                          '\n' + `[${fieldName}: ${value}]`;

                        updateVocabularyText(
                          this.suggestionListState.currentVocabularyText,
                        );

                        this.updateSuggestions(
                          dictionaryEntry,
                          updateVocabularyText,
                        );
                      },
                    };
                  },
                ),
              ),
            ),
          );
        }
      }
    }

    this.suggestionListState.suggestionList = observable.array(suggestions);

    const observableDictionaryEntry = this.observableConverter.convertToObservableDictionaryEntry(
      dictionaryEntry,
    );

    this.suggestionListState.attributions = observable.array(
      observableDictionaryEntry.attributions,
    );
  }
}
