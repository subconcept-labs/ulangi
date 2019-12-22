/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ScreenTitle } from '@ulangi/ulangi-common/interfaces';
import { IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableVocabularyFormState } from './ObservableVocabularyFormState';

export class ObservableAddEditVocabularyScreen extends ObservableScreen {
  @observable
  public currentTab: IObservableValue<'Editor' | 'Preview'>;

  public readonly vocabularyFormState: ObservableVocabularyFormState;

  public constructor(
    currentTab: IObservableValue<'Editor' | 'Preview'>,
    vocabularyFormState: ObservableVocabularyFormState,
    screenName: ScreenName,
    screenTitle?: ScreenTitle
  ) {
    super(screenName, screenTitle);
    this.currentTab = currentTab;
    this.vocabularyFormState = vocabularyFormState;
  }
}
