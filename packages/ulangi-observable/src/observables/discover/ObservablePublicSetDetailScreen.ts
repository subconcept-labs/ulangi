/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservablePublicSet } from './ObservablePublicSet';

export class ObservablePublicSetDetailScreen extends ObservableScreen {
  @observable
  public publicSet: ObservablePublicSet;

  public constructor(publicSet: ObservablePublicSet, screenName: ScreenName) {
    super(screenName);
    this.publicSet = publicSet;
  }
}
