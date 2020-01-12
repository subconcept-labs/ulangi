/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { action, observable } from 'mobx';

export class ObservableReviewActionButton {
  @observable
  public title: string;

  @observable
  public subtitle: undefined | string;

  @observable
  public testID: string;

  @observable
  public icon: {
    light: any;
    dark: any;
  };

  @observable
  public disabled: boolean;

  @observable
  public loading: boolean;

  @observable
  public onPress: () => void;

  public constructor(
    title: string,
    subtitle: undefined | string,
    testID: string,
    icon: { light: any; dark: any },
    disabled: boolean,
    loading: boolean,
    onPress: () => void
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.testID = testID;
    this.icon = icon;
    this.disabled = disabled;
    this.loading = loading;
    this.onPress = onPress;
  }

  @action
  public reset(
    title: string,
    subtitle: undefined | string,
    testID: string,
    icon: { light: any; dark: any },
    disabled: boolean,
    onPress: () => void
  ): void {
    this.title = title;
    this.subtitle = subtitle;
    this.testID = testID;
    this.icon = icon;
    this.disabled = disabled;
    this.onPress = onPress;
  }
}
