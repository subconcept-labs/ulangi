/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { IObservableArray, computed, observable } from 'mobx';

export class ObservableWritingResult {
  @observable
  public vocabularyIdsWithNoHintsUsed: IObservableArray<string>;

  @observable
  public vocabularyIdsWithHintsUsed: IObservableArray<string>;

  @observable
  public disabledVocabularyIds: IObservableArray<string>;

  @observable
  public skippedVocabularyIds: IObservableArray<string>;

  @computed
  public get total(): number {
    return (
      this.vocabularyIdsWithHintsUsed.length +
      this.vocabularyIdsWithNoHintsUsed.length +
      this.disabledVocabularyIds.length +
      this.skippedVocabularyIds.length
    );
  }

  @computed
  public get passPercentage(): number {
    return Math.round(
      (this.vocabularyIdsWithNoHintsUsed.length / this.total) * 100
    );
  }

  @computed
  public get grade(): string {
    return (
      _.findKey(
        this.gradeScale,
        ([lower, upper]): boolean =>
          this.passPercentage >= lower && this.passPercentage <= upper
      ) || 'N/A'
    );
  }

  private gradeScale: { [P in string]: [number, number] };

  public constructor(
    gradeScale: { [P in string]: [number, number] },
    vocabularyIdsWithNoHintsUsed: IObservableArray<string>,
    vocabularyIdsWithHintsUsed: IObservableArray<string>,
    disabledVocabularyIds: IObservableArray<string>,
    skippedVocabularyIds: IObservableArray<string>
  ) {
    this.gradeScale = gradeScale;
    this.vocabularyIdsWithNoHintsUsed = vocabularyIdsWithNoHintsUsed;
    this.vocabularyIdsWithHintsUsed = vocabularyIdsWithHintsUsed;
    this.disabledVocabularyIds = disabledVocabularyIds;
    this.skippedVocabularyIds = skippedVocabularyIds;
  }
}
