/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAddEditSetScreen,
  ObservableSetFormState,
  ObservableSetPickerState,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';
import * as uuid from 'uuid';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { AddSetScreenIds } from '../../constants/ids/AddSetScreenIds';
import { AddSetScreenFactory } from '../../factories/set/AddSetScreenFactory';
import { AddEditSetScreen } from './AddEditSetScreen';
import { AddSetScreenStyle } from './AddSetScreenContainer.style';

@observer
export class AddSetScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? AddSetScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : AddSetScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private addSetScreenFactory = new AddSetScreenFactory(
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
      true,
      new ObservableSetPickerState(null, false, false),
      this.props.rootStore.remoteConfigStore,
    ),
    ScreenName.ADD_SET_SCREEN,
    new ObservableTitleTopBar(
      'Add Set',
      new ObservableTopBarButton(
        AddSetScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      new ObservableTopBarButton(
        AddSetScreenIds.SAVE_BTN,
        'Save',
        null,
        (): void => {
          Keyboard.dismiss();
          this.screenDelegate.saveAdd({
            onSaving: this.screenDelegate.showSavingDialog,
            onSaveSucceeded: this.screenDelegate.showSaveSucceededDialog,
            onSaveFailed: this.screenDelegate.showSaveFailedDialog,
          });
        },
      ),
    ),
  );

  private navigatorDelegate = this.addSetScreenFactory.createNavigatorDelegate();

  private screenDelegate = this.addSetScreenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? AddSetScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : AddSetScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <AddEditSetScreen
        testID={AddSetScreenIds.SCREEN}
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
