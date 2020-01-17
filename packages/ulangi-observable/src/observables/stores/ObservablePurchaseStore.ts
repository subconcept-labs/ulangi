/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { observable } from 'mobx';

import { ObservableStore } from './ObservableStore';

export class ObservablePurchaseStore extends ObservableStore {
  @observable
  public premiumLifetimeProductId: null | string;

  @observable
  public premiumLifetimeProcessState: ActivityState;

  @observable
  public premiumLifetimeProcessResult: null | {
    success: boolean;
    errorBag: null | ErrorBag;
  };

  public constructor(
    premiumLifetimeProductId: null | string,
    premiumLifetimeProcessState: ActivityState,
    premiumLifetimeProcessResult: null | {
      success: boolean;
      errorBag: null | ErrorBag;
    }
  ) {
    super();
    this.premiumLifetimeProductId = premiumLifetimeProductId;
    this.premiumLifetimeProcessState = premiumLifetimeProcessState;
    this.premiumLifetimeProcessResult = premiumLifetimeProcessResult;
  }
}
