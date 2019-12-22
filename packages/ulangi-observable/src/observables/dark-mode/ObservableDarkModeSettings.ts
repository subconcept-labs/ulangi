/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DarkModeTrigger } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

export class ObservableDarkModeSettings {
  @observable
  public trigger: DarkModeTrigger;

  public constructor(trigger: DarkModeTrigger) {
    this.trigger = trigger;
  }
}
