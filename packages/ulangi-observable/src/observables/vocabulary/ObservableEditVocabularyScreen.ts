/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { IObservableValue } from 'mobx';

import { ObservableAddEditVocabularyScreen } from './ObservableAddEditVocabularyScreen';
import { ObservableVocabularyFormState } from './ObservableVocabularyFormState';

export class ObservableEditVocabularyScreen extends ObservableAddEditVocabularyScreen {
  public readonly originalEditingVocabulary: Vocabulary;

  public constructor(
    originalEditingVocabulary: Vocabulary,
    currentTab: IObservableValue<'Editor' | 'Preview'>,
    vocabularyFormState: ObservableVocabularyFormState,
    screenName: ScreenName
  ) {
    super(currentTab, vocabularyFormState, screenName, undefined);
    this.originalEditingVocabulary = originalEditingVocabulary;
  }
}
