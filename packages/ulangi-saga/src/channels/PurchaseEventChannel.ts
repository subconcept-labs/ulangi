/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { EventChannel, eventChannel } from 'redux-saga';

import { Iap, IapAdapter } from '../adapters/IapAdapter';

export class PurchaseEventChannel {
  private iap: IapAdapter;

  public constructor(iap: IapAdapter) {
    this.iap = iap;
  }

  public createChannel(): EventChannel<Iap.Purchase> {
    return eventChannel(
      (emitter): (() => void) => {
        const subscription = this.iap.purchaseUpdatedListener(
          (purchase: Iap.Purchase): void => {
            emitter(purchase);
          }
        );

        return (): void => subscription.remove();
      }
    );
  }
}
