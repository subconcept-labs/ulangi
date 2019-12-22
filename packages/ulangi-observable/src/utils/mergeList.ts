/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableMap, observable } from 'mobx';

export function mergeList<T>(
  currentList: null | ObservableMap<string, T>,
  newList: readonly [string, T][]
): ObservableMap<string, T> {
  if (currentList === null) {
    currentList = observable.map();
  }

  return currentList.merge(newList);
}
