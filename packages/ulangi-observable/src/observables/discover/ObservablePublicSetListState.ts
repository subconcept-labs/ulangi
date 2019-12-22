/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
import { IObservableValue, ObservableMap, observable } from 'mobx';

import { ObservablePublicSet } from './ObservablePublicSet';

export class ObservablePublicSetListState {
  @observable
  public publicSetList: null | ObservableMap<string, ObservablePublicSet>;

  @observable
  public noMore: boolean;

  public readonly searchState: IObservableValue<ActivityState>;

  public readonly isRefreshing: IObservableValue<boolean>;

  public constructor(
    publicSetList: null | ObservableMap<string, ObservablePublicSet>,
    noMore: boolean,
    searchState: IObservableValue<ActivityState>,
    isRefreshing: IObservableValue<boolean>
  ) {
    this.publicSetList = publicSetList;
    this.noMore = noMore;
    this.searchState = searchState;
    this.isRefreshing = isRefreshing;
  }
}
