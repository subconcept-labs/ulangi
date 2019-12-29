/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
import { IObservableValue, ObservableMap, computed, observable } from 'mobx';

import { ObservableVocabulary } from './ObservableVocabulary';

export class ObservableVocabularyListState {
  @observable
  public vocabularyList: null | ObservableMap<string, ObservableVocabulary>;

  @observable
  public noMore: boolean;

  public readonly fetchState: IObservableValue<ActivityState>;

  public readonly shouldShowSyncingNotice: IObservableValue<boolean>;

  public readonly shouldShowRefreshNotice: IObservableValue<boolean>;

  public readonly isRefreshing: IObservableValue<boolean>;

  public readonly isSelectionModeOn: IObservableValue<boolean>;

  @computed
  public get selectedVocabularyIds(): string[] {
    if (this.vocabularyList !== null) {
      return Array.from(this.vocabularyList.values())
        .filter(
          (vocabulary): boolean => {
            return vocabulary.isSelected.get() === true;
          }
        )
        .map((vocabulary): string => vocabulary.vocabularyId);
    } else {
      return [];
    }
  }

  @computed
  public get numOfVocabularySelected(): number {
    return this.selectedVocabularyIds.length;
  }

  public constructor(
    vocabularyList: null | ObservableMap<string, ObservableVocabulary>,
    noMore: boolean,
    fetchState: IObservableValue<ActivityState>,
    shouldShowSyncingNotice: IObservableValue<boolean>,
    shouldShowRefreshNotice: IObservableValue<boolean>,
    isSelectionModeOn: IObservableValue<boolean>,
    isRefreshing: IObservableValue<boolean>
  ) {
    this.vocabularyList = vocabularyList;
    this.noMore = noMore;
    this.fetchState = fetchState;
    this.shouldShowSyncingNotice = shouldShowSyncingNotice;
    this.shouldShowRefreshNotice = shouldShowRefreshNotice;
    this.isRefreshing = isRefreshing;
    this.isSelectionModeOn = isSelectionModeOn;
  }
}
