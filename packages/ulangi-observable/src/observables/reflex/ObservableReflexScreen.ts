/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableArray, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableReflexGameState } from './ObservableReflexGameState';
import { ObservableReflexGameStats } from './ObservableReflexGameStats';

export class ObservableReflexScreen extends ObservableScreen {
  @observable
  public selectedCategoryNames: undefined | IObservableArray<string>;

  @observable
  public gameState: ObservableReflexGameState;

  @observable
  public gameStats: ObservableReflexGameStats;

  @observable
  public noMoreVocabulary: boolean;

  public constructor(
    selectedCategoryNames: undefined | IObservableArray<string>,
    gameState: ObservableReflexGameState,
    gameStats: ObservableReflexGameStats,
    noMoreVocabulary: boolean,
    screenName: ScreenName
  ) {
    super(screenName);
    this.selectedCategoryNames = selectedCategoryNames;
    this.gameState = gameState;
    this.gameStats = gameStats;
    this.noMoreVocabulary = noMoreVocabulary;
  }
}
