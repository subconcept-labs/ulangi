/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ObservableVocabularyListState } from '@ulangi/ulangi-observable';
import { runInAction } from 'mobx';

export class VocabularySelectionDelegate {
  private vocabularyListState: ObservableVocabularyListState;

  public constructor(vocabularyListState: ObservableVocabularyListState) {
    this.vocabularyListState = vocabularyListState;
  }

  public setSelection(vocabularyId: string, selection: boolean): void {
    if (this.vocabularyListState.vocabularyList !== null) {
      if (this.vocabularyListState.vocabularyList.has(vocabularyId)) {
        const vocabulary = assertExists(
          this.vocabularyListState.vocabularyList.get(vocabularyId)
        );
        vocabulary.isSelected.set(selection);
      }

      this.vocabularyListState.isSelectionModeOn.set(true);
    }
  }

  public clearSelections(): void {
    this.vocabularyListState.isSelectionModeOn.set(false);

    runInAction(
      (): void => {
        if (this.vocabularyListState.vocabularyList !== null) {
          return Array.from(
            this.vocabularyListState.vocabularyList.values()
          ).forEach(
            (vocabulary): void => {
              vocabulary.isSelected.set(false);
            }
          );
        }
      }
    );
  }

  public selectAll(): void {
    this.vocabularyListState.isSelectionModeOn.set(true);

    runInAction(
      (): void => {
        if (this.vocabularyListState.vocabularyList !== null) {
          return Array.from(
            this.vocabularyListState.vocabularyList.values()
          ).forEach(
            (vocabulary): void => {
              vocabulary.isSelected.set(true);
            }
          );
        }
      }
    );
  }
}
