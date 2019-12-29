/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { LightBoxActionMenuScreen } from './LightBoxActionMenuScreen';

@observer
export class LightBoxActionMenuScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
    null,
  );

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? this.props.styles
          ? this.props.styles.light
          : {}
        : this.props.styles
        ? this.props.styles.dark
        : {},
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <LightBoxActionMenuScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableLightBox={this.observableLightBox}
        navigatorDelegate={this.navigatorDelegate}
      />
    );
  }
}
