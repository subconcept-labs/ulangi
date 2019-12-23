/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import {
  ScreenName,
  SetFormPickerType,
  Theme,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableAddEditSetScreen,
  ObservableSetFormState,
  ObservableSetPickerState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import * as uuid from 'uuid';

import { Container, ContainerPassedProps } from '../../Container';
import { CreateFirstSetScreenIds } from '../../constants/ids/CreateFirstSetScreenIds';
import { CreateFirstSetScreenFactory } from '../../factories/set/CreateFirstSetScreenFactory';
import { CreateFirstSetScreen } from './CreateFirstSetScreen';
import { CreateFirstSetScreenStyle } from './CreateFirstSetScreenContainer.style';

@observer
export class CreateFirstSetScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? CreateFirstSetScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : CreateFirstSetScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new CreateFirstSetScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableAddEditSetScreen(
    new ObservableSetFormState(
      uuid.v4(),
      '',
      null,
      'en',
      false,
      new ObservableSetPickerState(SetFormPickerType.LEARN, false, false),
      this.props.rootStore.remoteConfigStore,
    ),
    ScreenName.CREATE_FIRST_SET_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === CreateFirstSetScreenIds.LOG_OUT_BTN) {
      this.screenDelegate.showConfirmLogout();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? CreateFirstSetScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : CreateFirstSetScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <CreateFirstSetScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
