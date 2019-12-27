/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ActivityState,
  ScreenName,
  SetStatus,
} from '@ulangi/ulangi-common/enums';
import { ObservableMap, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableSet } from './ObservableSet';

export class ObservableSetManagementScreen extends ObservableScreen {
  @observable
  public selectedSetStatus: SetStatus;

  @observable
  public setList: null | ObservableMap<string, ObservableSet>;

  @observable
  public fetchState: ActivityState;

  @observable
  public refreshing: boolean;

  public constructor(
    selectedSetStatus: SetStatus,
    setList: null | ObservableMap<string, ObservableSet>,
    fetchState: ActivityState,
    refreshing: boolean,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.selectedSetStatus = selectedSetStatus;
    this.setList = setList;
    this.fetchState = fetchState;
    this.refreshing = refreshing;
  }
}
