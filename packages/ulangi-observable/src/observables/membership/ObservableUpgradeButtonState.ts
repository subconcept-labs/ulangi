/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { action, observable } from 'mobx';

export class ObservableUpgradeButtonState {
  @observable
  public text: string;

  @observable
  public price: undefined | string;

  @observable
  public currency: undefined | string;

  @observable
  public onPress: undefined | (() => void);

  public constructor(
    text: string,
    price?: string,
    currency?: string,
    onPress?: () => void
  ) {
    this.text = text;
    this.price = price;
    this.currency = currency;
    this.onPress = onPress;
  }

  @action
  public reset(
    text: string,
    price?: string,
    currency?: string,
    onPress?: () => void
  ): void {
    this.text = text;
    this.price = price;
    this.currency = currency;
    this.onPress = onPress;
  }
}
