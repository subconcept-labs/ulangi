/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservablePreloadScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { PreloadScreenFactory } from '../../factories/preload/PreloadScreenFactory';
import { PreloadScreen } from './PreloadScreen';
import { PreloadScreenStyle } from './PreloadScreenContainer.style';

@observer
export class PreloadScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? PreloadScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : PreloadScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new PreloadScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservablePreloadScreen(
    '',
    this.props.componentId,
    ScreenName.PRELOAD_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.autoUpdateMessage();
    this.screenDelegate.preload();
  }

  public onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? PreloadScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : PreloadScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return <PreloadScreen observableScreen={this.observableScreen} />;
  }
}
