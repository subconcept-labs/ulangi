/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ThemeTrigger } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

export class ObservableThemeSettings {
  @observable
  public trigger: ThemeTrigger;

  public constructor(trigger: ThemeTrigger) {
    this.trigger = trigger;
  }
}
