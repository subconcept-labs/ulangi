/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { action, computed, observable } from 'mobx';

import { ObservableUser } from '../user/ObservableUser';
import { ObservableStore } from './ObservableStore';

export class ObservableUserStore extends ObservableStore {
  @observable
  public currentUser: null | ObservableUser;

  @computed
  public get existingCurrentUser(): ObservableUser {
    return assertExists(
      this.currentUser,
      'currentUser should not be null or undefined'
    );
  }

  @action
  public reset(newUserStore: ObservableUserStore): void {
    this.currentUser = newUserStore.currentUser;
  }

  public constructor(currentUser: null | ObservableUser) {
    super();
    this.currentUser = currentUser;
  }
}
