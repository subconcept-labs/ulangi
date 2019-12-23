/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ExtraFieldDetail } from '@ulangi/ulangi-common/core';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { ExtraFieldsPickerScreenDelegate } from '../../delegates/vocabulary/ExtraFieldsPickerScreenDelegate';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { ExtraFieldsPickerScreen } from '../vocabulary/ExtraFieldsPickerScreen';

export interface ExtraFieldsPickerScreenPassedProps {
  readonly kind: 'vocabulary' | 'definition';
  readonly selectImages: () => void;
  readonly onPick: (
    extraFieldDetail: ExtraFieldDetail,
    value: string,
    cursor: undefined | number,
  ) => void;
}

@observer
export class ExtraFieldsPickerScreenContainer extends Container<
  ExtraFieldsPickerScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    ScreenName.EXTRA_FIELDS_PICKER_SCREEN,
  );

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = new ExtraFieldsPickerScreenDelegate(
    this.navigatorDelegate,
  );

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
      <ExtraFieldsPickerScreen
        observableLightBox={this.props.observableLightBox}
        screenDelegate={this.screenDelegate}
        darkModeStore={this.props.rootStore.darkModeStore}
        setStore={this.props.rootStore.setStore}
        kind={this.props.passedProps.kind}
        selectImages={this.props.passedProps.selectImages}
        onPick={this.props.passedProps.onPick}
      />
    );
  }
}
