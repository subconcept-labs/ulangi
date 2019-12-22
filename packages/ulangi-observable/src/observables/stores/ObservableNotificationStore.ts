/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

import { ObservableStore } from './ObservableStore';

export class ObservableNotificationStore extends ObservableStore {
  @observable
  public hasPermission: null | boolean;

  public constructor(hasPermission: null | boolean) {
    super();
    this.hasPermission = hasPermission;
  }
}
