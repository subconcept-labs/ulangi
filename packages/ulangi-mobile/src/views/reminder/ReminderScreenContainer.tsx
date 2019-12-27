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
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
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
    new ObservableTitleTopBar(
      'Reminder',
      new ObservableTopBarButton(
        ReminderScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      new ObservableTopBarButton(
        ReminderScreenIds.SAVE_BTN,
        'Save',
        null,
        (): void => {
          this.screenDelegate.save();
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

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
