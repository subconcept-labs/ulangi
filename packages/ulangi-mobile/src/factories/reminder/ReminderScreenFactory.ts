/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableReminderScreen } from '@ulangi/ulangi-observable';

import { ReminderDelegate } from '../../delegates/reminder/ReminderDelegate';
import { ReminderScreenDelegate } from '../../delegates/reminder/ReminderScreenDelegate';
import { ReminderSettingsDelegate } from '../../delegates/reminder/ReminderSettingsDelegate';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class ReminderScreenFactory extends ScreenFactory {
  public createReminderSettingsDelegate(): ReminderSettingsDelegate {
    return new ReminderSettingsDelegate(
      this.props.rootStore.userStore,
      this.props.rootStore.notificationStore
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableReminderScreen
  ): ReminderScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const reminderDelegate = new ReminderDelegate(this.eventBus);

    return new ReminderScreenDelegate(
      this.eventBus,
      this.props.rootStore.notificationStore,
      observableScreen,
      reminderDelegate,
      dialogDelegate,
      navigatorDelegate
    );
  }
}
