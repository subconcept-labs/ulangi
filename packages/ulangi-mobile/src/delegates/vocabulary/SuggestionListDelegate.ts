import { ObservableSuggestionListState } from '@ulangi/ulangi-observable';

import { DictionaryEntryDelegate } from '../dictionary/DictionaryEntryDelegate';

export class SuggestionListDelegate {
  private suggestionListState: ObservableSuggestionListState;
  private dictionaryEntryDelegate: DictionaryEntryDelegate;
  private onSelect: (fieldName: string, value: string) => string;

  public constructor(
    suggestionListState: ObservableSuggestionListState,
    dictionaryEntryDelegate: DictionaryEntryDelegate,
    onSelect: (fieldName: string, value: string) => string,
  ) {
    this.suggestionListState = suggestionListState;
    this.dictionaryEntryDelegate = dictionaryEntryDelegate;
    this.onSelect = onSelect;
  }

  public getSuggestions(): void {
    this.dictionaryEntryDelegate.getDictionaryEntry(
      this.suggestionListState.currentVocabularyTerm,
    );
  }

  public clearSuggestions(): void {
    this.dictionaryEntryDelegate.clearDictionaryEntry();
  }

  public onSelectSuggestion(fieldName: string, value: string): void {
    this.suggestionListState.currentVocabularyText = this.onSelect(
      fieldName,
      value,
    );
  }
}
