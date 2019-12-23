/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { PublicSet } from '@ulangi/ulangi-common/interfaces';
import { ObservablePublicSetDetailScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { PublicSetDetailScreenIds } from '../../constants/ids/PublicSetDetailScreenIds';
import { PublicSetDetailScreenFactory } from '../../factories/discover/PublicSetDetailScreenFactory';
import { PublicSetDetailScreen } from './PublicSetDetailScreen';
import { PublicSetDetailScreenStyle } from './PublicSetDetailScreenContainer.style';

export interface PublicSetDetailPassedProps {
  readonly publicSet: PublicSet;
}

@observer
export class PublicSetDetailScreenContainer extends Container<
  PublicSetDetailPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? PublicSetDetailScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : PublicSetDetailScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new PublicSetDetailScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservablePublicSetDetailScreen(
    this.props.observableConverter.convertToObservablePublicSet(
      this.props.passedProps.publicSet,
    ),
    ScreenName.PUBLIC_SET_DETAIL_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === PublicSetDetailScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? PublicSetDetailScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : PublicSetDetailScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <PublicSetDetailScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
