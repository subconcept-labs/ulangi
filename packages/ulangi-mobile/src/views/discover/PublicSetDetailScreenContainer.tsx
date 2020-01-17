/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { PublicSet } from '@ulangi/ulangi-common/interfaces';
import {
  ObservablePublicSetDetailScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
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
    new ObservableTitleTopBar(
      'Detail',
      new ObservableTopBarButton(
        PublicSetDetailScreenIds.BACK_BTN,
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

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

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
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
