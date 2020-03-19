import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState, ErrorCode } from '@ulangi/ulangi-common/enums';
import { DictionaryEntry } from '@ulangi/ulangi-common/interfaces';
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

    if (typeof dictionaryEntry.pinyin !== 'undefined') {
      const suggestedPinyin = _.difference(
        dictionaryEntry.pinyin,
        this.suggestionListState.currentVocabularyExtraFields.pinyin
          .map(_.first)
          .filter((pinyin): pinyin is string => _.isUndefined(pinyin)),
      );

      if (suggestedPinyin.length > 0) {
        suggestions.push(
          this.createPinyinSuggestion(
            suggestedPinyin,
            (pinyin: string): void => {
              this.suggestionListState.currentVocabularyText +=
                '\n' + `[pinyin: ${pinyin}]`;

              updateVocabularyText(
                this.suggestionListState.currentVocabularyText,
              );

              this.updateSuggestions(dictionaryEntry, updateVocabularyText);
            },
          ),
        );
      }
    }

    if (typeof dictionaryEntry.romaji !== 'undefined') {
      const suggestedRomaji = _.difference(
        dictionaryEntry.romaji,
        this.suggestionListState.currentVocabularyExtraFields.romaji
          .map(_.first)
          .filter((romaji): romaji is string => _.isUndefined(romaji)),
      );

      if (suggestedRomaji.length > 0) {
        suggestions.push(
          this.createRomajiSuggestion(
            suggestedRomaji,
            (romaji: string): void => {
              this.suggestionListState.currentVocabularyText +=
                '\n' + `[romaji: ${romaji}]`;

              updateVocabularyText(
                this.suggestionListState.currentVocabularyText,
              );

              this.updateSuggestions(dictionaryEntry, updateVocabularyText);
            },
          ),
        );
      }
    }

    if (typeof dictionaryEntry.romanization !== 'undefined') {
      const suggestedRomanization = _.difference(
        dictionaryEntry.romanization,
        this.suggestionListState.currentVocabularyExtraFields.romanization
          .map(_.first)
          .filter(
            (romanization): romanization is string =>
              _.isUndefined(romanization),
          ),
      );

      if (suggestedRomanization.length > 0) {
        suggestions.push(
          this.createRomanizationSuggestion(
            suggestedRomanization,
            (romanization: string): void => {
              this.suggestionListState.currentVocabularyText +=
                '\n' + `[romanization: ${romanization}]`;

              updateVocabularyText(
                this.suggestionListState.currentVocabularyText,
              );

              this.updateSuggestions(dictionaryEntry, updateVocabularyText);
            },
          ),
        );
      }
    }

    if (typeof dictionaryEntry.ipa !== 'undefined') {
      const suggestedIpa = _.difference(
        dictionaryEntry.ipa,
        this.suggestionListState.currentVocabularyExtraFields.ipa
          .map(_.first)
          .filter((ipa): ipa is string => _.isUndefined(ipa)),
      );

      if (suggestedIpa.length > 0) {
        suggestions.push(
          this.createIPASuggestion(
            suggestedIpa,
            (ipa: string): void => {
              this.suggestionListState.currentVocabularyText +=
                '\n' + `[ipa: ${ipa}]`;

              updateVocabularyText(
                this.suggestionListState.currentVocabularyText,
              );

              this.updateSuggestions(dictionaryEntry, updateVocabularyText);
            },
          ),
        );
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

  private createIPASuggestion(
    suggestedIpa: string[],
    onSelect: (ipa: string) => void,
  ): ObservableSuggestion {
    return new ObservableSuggestion(
      'OPTIONAL',
      'Add IPA to know how to pronounce it.',
      observable.array(
        suggestedIpa.map(
          (ipa): { text: string; onPress: () => void } => {
            return {
              text: `+ [ipa: ${ipa}]`,
              onPress: (): void => {
                onSelect(ipa);
              },
            };
          },
        ),
      ),
    );
  }

  private createPinyinSuggestion(
    suggestedPinyin: string[],
    onSelect: (pinyin: string) => void,
  ): ObservableSuggestion {
    return new ObservableSuggestion(
      'OPTIONAL',
      'Add pinyin to know how to pronounce it.',
      observable.array(
        suggestedPinyin.map(
          (pinyin): { text: string; onPress: () => void } => {
            return {
              text: `+ [pinyin: ${pinyin}]`,
              onPress: (): void => {
                onSelect(pinyin);
              },
            };
          },
        ),
      ),
    );
  }

  private createRomajiSuggestion(
    suggestedRomaji: string[],
    onSelect: (pinyin: string) => void,
  ): ObservableSuggestion {
    return new ObservableSuggestion(
      'OPTIONAL',
      'Add romaji to know how to pronounce it.',
      observable.array(
        suggestedRomaji.map(
          (romaji): { text: string; onPress: () => void } => {
            return {
              text: `+ [romaji: ${romaji}]`,
              onPress: (): void => {
                onSelect(romaji);
              },
            };
          },
        ),
      ),
    );
  }

  private createRomanizationSuggestion(
    suggestedRomanization: string[],
    onSelect: (pinyin: string) => void,
  ): ObservableSuggestion {
    return new ObservableSuggestion(
      'OPTIONAL',
      'Add romanization to know how to pronounce it.',
      observable.array(
        suggestedRomanization.map(
          (romanization): { text: string; onPress: () => void } => {
            return {
              text: `+ [romanization: ${romanization}]`,
              onPress: (): void => {
                onSelect(romanization);
              },
            };
          },
        ),
      ),
    );
  }
}
