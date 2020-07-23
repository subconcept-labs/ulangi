/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAutoArchiveScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
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
    this.props.componentId,
    ScreenName.AUTO_ARCHIVE_SCREEN,
    new ObservableTitleTopBar(
      'Auto Archive',
      new ObservableTopBarButton(
        AutoArchiveScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      new ObservableTopBarButton(
        AutoArchiveScreenIds.SAVE_BTN,
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
        ? AutoArchiveScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : AutoArchiveScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <AutoArchiveScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
