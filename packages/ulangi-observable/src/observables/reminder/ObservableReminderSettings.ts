/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableReminderSettings {
  @observable
  public reminderEnabled: boolean;

  @observable
  public hours: number;

  @observable
  public minutes: number;

  public constructor(reminderEnabled: boolean, hours: number, minutes: number) {
    this.reminderEnabled = reminderEnabled;
    this.hours = hours;
    this.minutes = minutes;
  }
}
