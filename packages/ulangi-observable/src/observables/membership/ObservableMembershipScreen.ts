/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Product } from '@ulangi/ulangi-common/interfaces';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableUpgradeButtonState } from './ObservableUpgradeButtonState';

export class ObservableMembershipScreen extends ObservableScreen {
  @observable
  public premiumLifetimeProduct: null | Product;

  @observable
  public upgradeButtonState: ObservableUpgradeButtonState;

  public constructor(
    premiumLifetimeProduct: null | Product,
    upgradeButtonState: ObservableUpgradeButtonState,
    screenName: ScreenName
  ) {
    super(screenName);
    this.premiumLifetimeProduct = premiumLifetimeProduct;
    this.upgradeButtonState = upgradeButtonState;
  }
}
