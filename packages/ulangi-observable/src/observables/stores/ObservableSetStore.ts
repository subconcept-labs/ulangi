/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SetStatus } from '@ulangi/ulangi-common/enums';
import { ObservableMap, computed, observable } from 'mobx';

import { ObservableSet } from '../set/ObservableSet';
import { ObservableStore } from './ObservableStore';

export class ObservableSetStore extends ObservableStore {
  @observable
  public currentSetId: null | string;

  @computed
  public get existingCurrentSetId(): string {
    return assertExists(
      this.currentSetId,
      'currentSetId should not be null or undefined'
    );
  }

  @observable
  public allSetList: null | ObservableMap<string, ObservableSet>;

  @computed
  public get existingAllSetList(): ObservableMap<string, ObservableSet> {
    return assertExists(
      this.allSetList,
      'allSetList should not be null or undefined'
    );
  }

  @computed
  public get activeSetList(): null | ObservableMap<string, ObservableSet> {
    if (this.allSetList === null) {
      return null;
    } else {
      const activeSetList = new ObservableMap();
      this.allSetList.forEach(
        (set): void => {
          if (set.setStatus === SetStatus.ACTIVE) {
            activeSetList.set(set.setId, set);
          }
        }
      );
      return activeSetList;
    }
  }

  @computed
  public get existingActiveSetList(): ObservableMap<string, ObservableSet> {
    return assertExists(
      this.activeSetList,
      'activeSetList should not be null or undefined'
    );
  }

  @computed
  public get archivedSetList(): null | ObservableMap<string, ObservableSet> {
    if (this.allSetList === null) {
      return null;
    } else {
      const archivedSetList = new ObservableMap();
      this.allSetList.forEach(
        (set): void => {
          if (set.setStatus === SetStatus.ARCHIVED) {
            archivedSetList.set(set.setId, set);
          }
        }
      );
      return archivedSetList;
    }
  }

  @computed
  public get existingArchivedSetList(): ObservableMap<string, ObservableSet> {
    return assertExists(
      this.archivedSetList,
      'archivedSetList should not be null or undefined'
    );
  }

  @computed
  public get deletedSetList(): null | ObservableMap<string, ObservableSet> {
    if (this.allSetList === null) {
      return null;
    } else {
      const deletedSetList = new ObservableMap();
      this.allSetList.forEach(
        (set): void => {
          if (set.setStatus === SetStatus.DELETED) {
            deletedSetList.set(set.setId, set);
          }
        }
      );
      return deletedSetList;
    }
  }

  @computed
  public get existingDeletedSetList(): ObservableMap<string, ObservableSet> {
    return assertExists(
      this.deletedSetList,
      'deletedSetList should not be null or undefined'
    );
  }

  @observable
  public originalEditingSet: null | ObservableSet;

  @computed
  public get currentSet(): null | ObservableSet {
    if (this.currentSetId === null) {
      return null;
    } else {
      const allSetList = assertExists(
        this.allSetList,
        'allSetList should not be null or undefined'
      );
      return assertExists(
        allSetList.get(this.currentSetId),
        'currentSet should not be null or undefined'
      );
    }
  }

  @computed
  public get existingCurrentSet(): ObservableSet {
    const allSetList = assertExists(
      this.allSetList,
      'allSetList should not be null or undefined'
    );
    return assertExists(
      allSetList.get(this.existingCurrentSetId),
      'currentSet should not be null or undefined'
    );
  }

  public constructor(
    currentSetId: null | string,
    allSetList: null | ObservableMap<string, ObservableSet>,
    originalEditingSet: null | ObservableSet
  ) {
    super();
    this.currentSetId = currentSetId;
    this.allSetList = allSetList;
    this.originalEditingSet = originalEditingSet;
  }
}
