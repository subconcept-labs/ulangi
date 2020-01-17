/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { SynchronizerScreenIds } from '../../constants/ids/SynchronizerScreenIds';
import { SynchronizerScreenFactory } from '../../factories/sync/SynchronizerScreenFactory';
import { SynchronizerScreen } from './SynchronizerScreen';
import { SynchronizerScreenStyle } from './SynchronizerScreenContainer.style';

@observer
export class SynchronizerScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SynchronizerScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SynchronizerScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    ScreenName.SYNCHRONIZER_SCREEN,
    new ObservableTitleTopBar(
      'Synchronizer',
      new ObservableTopBarButton(
        SynchronizerScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      null,
    ),
  );

  private screenFactory = new SynchronizerScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SynchronizerScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SynchronizerScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SynchronizerScreen
        themeStore={this.props.rootStore.themeStore}
        syncStore={this.props.rootStore.syncStore}
        networkStore={this.props.rootStore.networkStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
