/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableTouchableTopBar } from '../top-bar/ObservableTouchableTopBar';
import { ObservableVocabularyFormState } from './ObservableVocabularyFormState';

export class ObservableAddEditVocabularyScreen extends ObservableScreen {
  @observable
  public currentTab: IObservableValue<'Editor' | 'Preview'>;

  public readonly vocabularyFormState: ObservableVocabularyFormState;

  public constructor(
    currentTab: IObservableValue<'Editor' | 'Preview'>,
    vocabularyFormState: ObservableVocabularyFormState,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar | ObservableTouchableTopBar
  ) {
    super(screenName, topBar);
    this.currentTab = currentTab;
    this.vocabularyFormState = vocabularyFormState;
  }
}
