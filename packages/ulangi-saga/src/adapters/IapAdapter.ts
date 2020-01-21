import { EmitterSubscription } from 'react-native';
import * as RNIap from 'react-native-iap';

// eslint-disable-next-line
export namespace Iap {
  export type Purchase = RNIap.Purchase;
}

export class IapAdapter {
  private connectionInited: boolean = false;

  private iap: typeof RNIap;

  public constructor(iap: typeof RNIap) {
    this.iap = iap;
  }

  public endConnection(): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          if (this.connectionInited === true) {
            await this.iap.endConnectionAndroid();
            this.connectionInited = false;
            resolve();
          } else {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public initConnection(): Promise<string> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const value = await this.iap.initConnection();
          this.connectionInited = true;

          resolve(value);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getProducts(skus: string[]): Promise<RNIap.Product[]> {
    return this.iap.getProducts(skus);
  }

  public getAvailablePurchases(): ReturnType<
    typeof RNIap.getAvailablePurchases
  > {
    return this.iap.getAvailablePurchases();
  }

  public acknowledgePurchaseAndroid(
    purchaseToken: string
  ): Promise<void | RNIap.PurchaseResult> {
    return this.iap.acknowledgePurchaseAndroid(purchaseToken);
  }

  public finishTransactionIOS(transactionId: string): Promise<void> {
    return this.iap.finishTransactionIOS(transactionId);
  }

  public purchaseUpdatedListener(e: any): EmitterSubscription {
    return this.iap.purchaseUpdatedListener(e);
  }

  public requestPurchase(sku: string): Promise<RNIap.Purchase> {
    return this.iap.requestPurchase(sku, false);
  }
}
