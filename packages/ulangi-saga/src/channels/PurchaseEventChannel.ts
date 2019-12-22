/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Iap from 'react-native-iap';
import { EventChannel, eventChannel } from 'redux-saga';

export class PurchaseEventChannel {
  private iap: typeof Iap;

  public constructor(iap: typeof Iap) {
    this.iap = iap;
  }

  public createChannel(): EventChannel<Iap.ProductPurchase> {
    return eventChannel(
      (emitter): (() => void) => {
        const subscription = this.iap.purchaseUpdatedListener(
          (purchase: Iap.ProductPurchase): void => {
            emitter(purchase);
          }
        );

        return (): void => subscription.remove();
      }
    );
  }
}
