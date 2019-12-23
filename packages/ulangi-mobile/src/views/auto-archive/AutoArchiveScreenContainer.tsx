/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableAutoArchiveScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { AutoArchiveScreenIds } from '../../constants/ids/AutoArchiveScreenIds';
import { AutoArchiveScreenFactory } from '../../factories/auto-archive/AutoArchiveScreenFactory';
import { AutoArchiveScreen } from './AutoArchiveScreen';
import { AutoArchiveScreenStyle } from './AutoArchiveScreenContainer.style';

@observer
export class AutoArchiveScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? AutoArchiveScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : AutoArchiveScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new AutoArchiveScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private autoArchiveSettingsDelegate = this.screenFactory.createAutoArchiveSettingsDelegate();

  protected observableScreen = new ObservableAutoArchiveScreen(
    this.autoArchiveSettingsDelegate.getCurrentSettings(),
    ScreenName.AUTO_ARCHIVE_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === AutoArchiveScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === AutoArchiveScreenIds.SAVE_BTN) {
      this.screenDelegate.save();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? AutoArchiveScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : AutoArchiveScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <AutoArchiveScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
