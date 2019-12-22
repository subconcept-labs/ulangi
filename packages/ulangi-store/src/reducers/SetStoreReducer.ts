/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import {
  ObservableConverter,
  ObservableSet,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import { ObservableMap } from 'mobx';

import { Reducer } from './Reducer';

export class SetStoreReducer extends Reducer {
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;

  public constructor(
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter
  ) {
    super();
    this.setStore = setStore;
    this.observableConverter = observableConverter;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.SET__FETCH_ALL_SUCCEEDED)) {
      this.fetchAllSucceeded(action);
    } else if (action.is(ActionType.SET__FETCH_SUCCEEDED)) {
      this.fetchSucceeded(action);
    } else if (action.is(ActionType.SET__SELECT)) {
      this.select(action);
    } else if (action.is(ActionType.SET__ADD_SUCCEEDED)) {
      this.addSucceeded(action);
    } else if (action.is(ActionType.SET__EDIT_SUCCEEDED)) {
      this.editSucceeded(action);
    }
  }

  private fetchAllSucceeded(
    action: Action<ActionType.SET__FETCH_ALL_SUCCEEDED>
  ): void {
    const { setList } = action.payload;

    const newSetList = setList.map(
      (set): [string, ObservableSet] => [
        set.setId,
        this.observableConverter.convertToObservableSet(set),
      ]
    );

    this.setStore.allSetList = new ObservableMap(newSetList);
  }

  private fetchSucceeded(
    action: Action<ActionType.SET__FETCH_SUCCEEDED>
  ): void {
    const { setList } = action.payload;

    const newSetList = setList.map(
      (set): [string, ObservableSet] => [
        set.setId,
        this.observableConverter.convertToObservableSet(set),
      ]
    );

    if (this.setStore.allSetList === null) {
      this.setStore.allSetList = new ObservableMap(newSetList);
    } else {
      this.setStore.allSetList.merge(newSetList);
    }
  }

  private select(action: Action<ActionType.SET__SELECT>): void {
    const { setId } = action.payload;
    this.setStore.currentSetId = setId;
  }

  private addSucceeded(action: Action<ActionType.SET__ADD_SUCCEEDED>): void {
    const { set } = action.payload;
    const observableSet = this.observableConverter.convertToObservableSet(set);

    if (this.setStore.allSetList !== null) {
      this.setStore.allSetList.set(set.setId, observableSet);
    } else {
      this.setStore.allSetList = new ObservableMap([
        [set.setId, observableSet],
      ]);
    }
  }

  private editSucceeded(action: Action<ActionType.SET__EDIT_SUCCEEDED>): void {
    const { set } = action.payload;
    const observableSet = this.observableConverter.convertToObservableSet(set);

    if (this.setStore.allSetList !== null) {
      this.setStore.allSetList.set(set.setId, observableSet);
    }
  }
}
