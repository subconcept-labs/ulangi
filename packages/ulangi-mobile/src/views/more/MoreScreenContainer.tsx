/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableMoreScreen } from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { config } from '../../constants/config';
import { MoreScreenFactory } from '../../factories/more/MoreScreenFactory';
import { MoreScreen } from './MoreScreen';
import { MoreScreenStyle } from './MoreScreenContainer.style';

@observer
export class MoreScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? MoreScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : MoreScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableMoreScreen(
    observable.array(),
    observable.box(0),
    ScreenName.MORE_SCREEN
  );

  private screenFactory = new MoreScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public componentDidMount(): void {
    this.screenDelegate.autoUpdateBottomTabs();
  }

  public componentDidAppear(): void {
    if (config.app.showInAppRatingInMoreScreen === true) {
      this.screenDelegate.autoShowInAppRating();
    }

    this.screenDelegate.autoUpdateCarouselMessages();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? MoreScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : MoreScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <MoreScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        userStore={this.props.rootStore.userStore}
        networkStore={this.props.rootStore.networkStore}
        syncStore={this.props.rootStore.syncStore}
        adStore={this.props.rootStore.adStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
