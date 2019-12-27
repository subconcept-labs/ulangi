/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableReminderSettings } from './ObservableReminderSettings';

export class ObservableReminderScreen extends ObservableScreen {
  public readonly reminderSettings: ObservableReminderSettings;

  @observable
  public shouldShowTimePicker: boolean;

  public constructor(
    reminderSettings: ObservableReminderSettings,
    shouldShowTimePicker: boolean,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.reminderSettings = reminderSettings;
    this.shouldShowTimePicker = shouldShowTimePicker;
  }
}
