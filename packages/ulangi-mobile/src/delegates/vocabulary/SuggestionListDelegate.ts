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
              this.suggestionListState.fetchState.set(ActivityState.INACTIVE);
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
