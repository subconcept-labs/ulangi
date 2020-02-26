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
import { BackHandler } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { LightBoxDialogScreen } from './LightBoxDialogScreen';

@observer
export class LightBoxDialogScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.LIGHT_BOX_DIALOG_SCREEN,
    null,
  );

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  public componentDidMount(): void {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  public componentWillUnmount(): void {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

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

  private handleBackButton = (): boolean => {
    // Only allow to dismiss light box when showCloseButton or closeOnTouchOutside is true
    if (
      this.observableLightBox.dialog !== null &&
      (this.observableLightBox.dialog.showCloseButton === true ||
        this.observableLightBox.dialog.closeOnTouchOutside === true)
    ) {
      this.navigatorDelegate.dismissLightBox();
    }
    return true;
  };

  public render(): React.ReactElement<any> {
    return (
      <LightBoxDialogScreen
        themeStore={this.props.rootStore.themeStore}
        observableLightBox={this.observableLightBox}
        navigatorDelegate={this.navigatorDelegate}
      />
    );
  }
}
