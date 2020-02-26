/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAdScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { config } from '../../constants/config';
import { AdScreenFactory } from '../../factories/ad/AdScreenFactory';
import { AdScreen } from './AdScreen';
import { AdScreenStyle } from './AdScreenContainer.style';

export interface AdScreenContainerPassedProps {
  onClose: () => void;
}

@observer
export class AdScreenContainer extends Container<AdScreenContainerPassedProps> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? AdScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : AdScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableAdScreen(
    false,
    this.props.componentId,
    ScreenName.AD_SCREEN,
    new ObservableTitleTopBar('', null, null),
  );

  private screenFactory = new AdScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.showAdOrGoogleConsentForm();
    this.screenDelegate.autoPopOnAdClosedOrConsentStatusChanged();
    this.screenDelegate.closableAfterMs(config.ad.showAdTimeout);

    this.screenDelegate.addBackButtonHandler(
      this.screenDelegate.handleBackButton,
    );
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearAd();
    this.screenDelegate.removeBackButtonHandler(
      this.screenDelegate.handleBackButton,
    );
    this.props.passedProps.onClose();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? AdScreenStyle.SCREEN_FULL_LIGHT_STYLES
        : AdScreenStyle.SCREEN_FULL_DARK_STYLES,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <AdScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
