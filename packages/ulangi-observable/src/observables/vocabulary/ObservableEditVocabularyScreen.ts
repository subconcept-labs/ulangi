/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { IObservableValue } from 'mobx';

import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableAddEditVocabularyScreen } from './ObservableAddEditVocabularyScreen';
import { ObservableVocabularyFormState } from './ObservableVocabularyFormState';

export class ObservableEditVocabularyScreen extends ObservableAddEditVocabularyScreen {
  public readonly originalEditingVocabulary: Vocabulary;

  public constructor(
    screenAppearedTimes: number,
    originalEditingVocabulary: Vocabulary,
    currentTab: IObservableValue<'Editor' | 'Preview'>,
    vocabularyFormState: ObservableVocabularyFormState,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(
      screenAppearedTimes,
      currentTab,
      vocabularyFormState,
      screenName,
      topBar
    );
    this.originalEditingVocabulary = originalEditingVocabulary;
  }
}
