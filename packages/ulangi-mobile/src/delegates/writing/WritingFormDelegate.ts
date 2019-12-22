/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import {
  ObservableWritingFormState,
  ObservableWritingResult,
  Observer,
} from '@ulangi/ulangi-observable';

export class WritingFormDelegate {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  private observer: Observer;
  private writingFormState: ObservableWritingFormState;
  private writingResult: ObservableWritingResult;

  public constructor(
    observer: Observer,
    writingFormState: ObservableWritingFormState,
    writingResult: ObservableWritingResult
  ) {
    this.observer = observer;
    this.writingFormState = writingFormState;
    this.writingResult = writingResult;
  }

  public recordWhetherHintUsed(): void {
    const vocabularyId = this.writingFormState.currentQuestion.testingVocabulary
      .vocabularyId;
    if (
      this.writingFormState.isCurrentAnswerCorrect &&
      this.writingFormState.numOfHintsUsedForCurrentQuestion === 0
    ) {
      this.writingResult.vocabularyIdsWithNoHintsUsed.push(vocabularyId);
    } else {
      this.writingResult.vocabularyIdsWithHintsUsed.push(vocabularyId);
    }
  }

  public showHint(): void {
    this.writingFormState.numOfHintsUsedForCurrentQuestion++;

    const numberOfCharactersToShow = Array(
      this.writingFormState.numOfHintsUsedForCurrentQuestion
    )
      .fill(null)
      .map((_, index): number => index + 1)
      .reduce((sum, current): number => sum + current);

    const vocabularyTerm = this.vocabularyExtraFieldParser.parse(
      this.writingFormState.currentQuestion.testingVocabulary.vocabularyText
    ).vocabularyTerm;

    this.writingFormState.currentHint = vocabularyTerm.substring(
      0,
      numberOfCharactersToShow
    );

    if (this.writingFormState.currentHint !== vocabularyTerm) {
      this.writingFormState.currentHint =
        this.writingFormState.currentHint + '...';
    }
  }

  public skip(): void {
    this.writingResult.skippedVocabularyIds.push(
      this.writingFormState.currentQuestion.testingVocabulary.vocabularyId
    );
  }

  public fadeOut(callback: () => void): void {
    this.writingFormState.shouldRunFadeOutAnimation = true;
    this.observer.when(
      (): boolean => this.writingFormState.shouldRunFadeOutAnimation === false,
      callback
    );
  }
}
