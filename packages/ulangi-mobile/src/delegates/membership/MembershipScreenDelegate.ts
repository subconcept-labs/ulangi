/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ActivityState,
  ContactUsFormType,
  ScreenName,
  UserMembership,
} from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableMembershipScreen,
  ObservablePurchaseStore,
  ObservableUserStore,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Platform } from 'react-native';

import { env } from '../../constants/env';
import { errorConverter } from '../../converters/ErrorConverter';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class MembershipScreenDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private userStore: ObservableUserStore;
  private purchaseStore: ObservablePurchaseStore;
  private observableScreen: ObservableMembershipScreen;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    userStore: ObservableUserStore,
    purchaseStore: ObservablePurchaseStore,
    observableScreen: ObservableMembershipScreen,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.userStore = userStore;
    this.purchaseStore = purchaseStore;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public fetchLocalizedPrice(): void {
    if (
      typeof env.IOS_PREMIUM_LIFETIME_PRODUCT_ID !== 'undefined' &&
      typeof env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID !== 'undefined'
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.IAP__GET_PRODUCTS, {
          skus: [
            Platform.select({
              ios: env.IOS_PREMIUM_LIFETIME_PRODUCT_ID,
              android: env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID,
            }),
          ],
        }),
        group(
          once(
            ActionType.IAP__GET_PRODUCTS_SUCCEEDED,
            ({ products }): void => {
              if (products.length === 0) {
                this.observableScreen.premiumLifetimeProduct = null;
                this.observableScreen.upgradeButtonState.reset(
                  'Product not found',
                );
              } else {
                this.observableScreen.premiumLifetimeProduct = products[0];
                this.observableScreen.upgradeButtonState.reset(
                  'Upgrade to Premium (Lifetime)',
                  this.observableScreen.premiumLifetimeProduct.localizedPrice,
                  this.observableScreen.premiumLifetimeProduct.currency,
                  this.upgradeToPremium,
                );
              }
            },
          ),
          once(
            ActionType.IAP__GET_PRODUCTS_FAILED,
            (): void => {
              this.observableScreen.premiumLifetimeProduct = null;
              this.observableScreen.upgradeButtonState.reset(
                'Failed to fetch product',
              );
            },
          ),
        ),
      );
    } else {
      console.warn(
        'Cannot fetch localized price. Missing environment variables.',
      );
    }
  }

  public restorePurchases(): void {
    if (
      this.userStore.existingCurrentUser.membership === UserMembership.REGULAR
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.IAP__RESTORE_PURCHASES, null),
        group(
          on(
            ActionType.IAP__RESTORING_PURCHASES,
            (): void => {
              this.showRestoringPurchasesDialog();
            },
          ),
          once(
            ActionType.IAP__RESTORE_PURCHASES_SUCCEEDED,
            (): void => {
              this.dialogDelegate.dismiss();
            },
          ),
          once(
            ActionType.IAP__RESTORE_PURCHASES_FAILED,
            (errorBag): void => {
              this.showFailedToRestorePurchases(errorBag);
            },
          ),
        ),
      );
    } else {
      this.showPurchasesAlreadyAppliedDialog();
    }
  }

  public autoUpdateUpgradeButton(): void {
    this.observer.autorun(
      (): void => {
        if (
          this.purchaseStore.premiumLifetimeProcessState ===
          ActivityState.ACTIVE
        ) {
          this.observableScreen.upgradeButtonState.reset(
            'Processing purchase...',
          );
        } else if (this.purchaseStore.premiumLifetimeProcessResult !== null) {
          const {
            success,
            errorBag,
          } = this.purchaseStore.premiumLifetimeProcessResult;
          this.observableScreen.upgradeButtonState.reset(
            success === true
              ? 'Processed purchase successfully'
              : errorBag !== null
              ? errorConverter.convertToMessage(errorBag)
              : 'Invalid state',
          );
        }
      },
    );
  }

  public showAdsDialog(): void {
    this.dialogDelegate.show({
      message:
        "We've have been crafting this app with love. To keep it clean and less intrusive, we don't put any banner ads. We only show interstitial ads between several review sessions.",
      showCloseButton: true,
      closeOnTouchOutside: true,
    });
  }

  public navigateToFeatureRequestScreen(): void {
    this.navigatorDelegate.push(ScreenName.CONTACT_US_SCREEN, {
      initialFormType: ContactUsFormType.FEATURE_REQUEST,
    });
  }

  private upgradeToPremium(): void {
    if (
      typeof env.IOS_PREMIUM_LIFETIME_PRODUCT_ID !== 'undefined' &&
      typeof env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID !== 'undefined'
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.IAP__REQUEST_PURCHASE, {
          sku: Platform.select({
            ios: env.IOS_PREMIUM_LIFETIME_PRODUCT_ID,
            android: env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID,
          }),
        }),
        group(
          on(
            ActionType.IAP__REQUESTING_PURCHASE,
            (): void => {
              // Do not show light box on Android
              // as it's not automatically closed.
              if (Platform.OS !== 'android') {
                this.showRequestingPurchaseDialog();
              }
            },
          ),
          once(
            ActionType.IAP__REQUEST_PURCHASE_SUCCEEDED,
            (): void => {
              this.dialogDelegate.dismiss();
            },
          ),
          once(
            ActionType.IAP__REQUEST_PURCHASE_FAILED,
            (errorBag): void => {
              this.showFailedToRequestPurchase(errorBag);
            },
          ),
        ),
      );
    } else {
      console.warn('Cannot upgrade to premium. Missing environment variables.');
    }
  }

  private showPurchasesAlreadyAppliedDialog(): void {
    this.dialogDelegate.show({
      message: 'Purchases were already applied.',
      showCloseButton: true,
    });
  }

  private showRequestingPurchaseDialog(): void {
    this.dialogDelegate.show({
      message: 'Requesting purchase...',
    });
  }

  private showFailedToRequestPurchase(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'FAILED TO REQUEST PURCHASE',
    });
  }

  private showRestoringPurchasesDialog(): void {
    this.dialogDelegate.show({
      message: 'Restoring purchases...',
    });
  }

  private showFailedToRestorePurchases(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'FAILED TO RESTORE PURCHASES',
    });
  }
}
