/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeScreen,
  ObservableDarkModeSettings,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { DarkModeScreenIds } from '../../constants/ids/DarkModeScreenIds';
import { DarkModeScreenFactory } from '../../factories/dark-mode/DarkModeScreenFactory';
import { DarkModeScreen } from './DarkModeScreen';
import { DarkModeScreenStyle } from './DarkModeScreenContainer.style';

@observer
export class DarkModeScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? DarkModeScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : DarkModeScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new DarkModeScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private darkModeSettingsDelegate = this.screenFactory.createDarkModeSettingsDelegate();

  private currentSettings = this.darkModeSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableDarkModeScreen(
    new ObservableDarkModeSettings(this.currentSettings.trigger),
    ScreenName.DARK_MODE_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === DarkModeScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === DarkModeScreenIds.SAVE_BTN) {
      this.screenDelegate.save();
    }
  }

  public onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? DarkModeScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : DarkModeScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <DarkModeScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
