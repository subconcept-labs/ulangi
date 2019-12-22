/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableWritingSettingsScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { WritingSettingsScreenIds } from '../../constants/ids/WritingSettingsScreenIds';
import { WritingSettingsScreenFactory } from '../../factories/writing/WritingSettingsScreenFactory';
import { WritingSettingsScreen } from './WritingSettingsScreen';
import { WritingSettingsScreenStyle } from './WritingSettingsScreenContainer.style';

@observer
export class WritingSettingsScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? WritingSettingsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : WritingSettingsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new WritingSettingsScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private writingSettingsDelegate = this.screenFactory.createWritingSettingsDelegate();

  private originalSettings = this.writingSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableWritingSettingsScreen(
    this.originalSettings.initialInterval,
    this.originalSettings.limit,
    ScreenName.WRITING_SETTINGS_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === WritingSettingsScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === WritingSettingsScreenIds.SAVE_BTN) {
      this.screenDelegate.save();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? WritingSettingsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : WritingSettingsScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <WritingSettingsScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
