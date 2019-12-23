/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReminderScreen,
  ObservableReminderSettings,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { ReminderScreenIds } from '../../constants/ids/ReminderScreenIds';
import { ReminderScreenFactory } from '../../factories/reminder/ReminderScreenFactory';
import { ReminderScreen } from './ReminderScreen';
import { ReminderScreenStyle } from './ReminderScreenContainer.style';

@observer
export class ReminderScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ReminderScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ReminderScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ReminderScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private reminderSettingsDelegate = this.screenFactory.createReminderSettingsDelegate();

  private currentSettings = this.reminderSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableReminderScreen(
    new ObservableReminderSettings(
      this.currentSettings.reminderEnabled,
      this.currentSettings.hours,
      this.currentSettings.minutes,
    ),
    false,
    ScreenName.REMINDER_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === ReminderScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === ReminderScreenIds.SAVE_BTN) {
      this.screenDelegate.save();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ReminderScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ReminderScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ReminderScreen
        observableScreen={this.observableScreen}
        notificationStore={this.props.rootStore.notificationStore}
        darkModeStore={this.props.rootStore.darkModeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
