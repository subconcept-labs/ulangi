/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableAddEditSetScreen,
  ObservableSetFormState,
  ObservableSetPickerState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { EditSetScreenIds } from '../../constants/ids/EditSetScreenIds';
import { EditSetScreenFactory } from '../../factories/set/EditSetScreenFactory';
import { AddEditSetScreen } from './AddEditSetScreen';
import { EditSetScreenStyle } from './EditSetScreenContainer.style';

export interface EditSetScreenPassedProps {
  readonly originalSet: Set;
}

@observer
export class EditSetScreenContainer extends Container<
  EditSetScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? EditSetScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : EditSetScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new EditSetScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected observableScreen = new ObservableAddEditSetScreen(
    new ObservableSetFormState(
      this.props.passedProps.originalSet.setId,
      this.props.passedProps.originalSet.setName,
      this.props.passedProps.originalSet.learningLanguageCode,
      this.props.passedProps.originalSet.translatedToLanguageCode,
      true,
      new ObservableSetPickerState(null, false, false),
      this.props.rootStore.remoteConfigStore,
    ),
    ScreenName.EDIT_SET_SCREEN,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === EditSetScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === EditSetScreenIds.SAVE_BTN) {
      Keyboard.dismiss();
      this.screenDelegate.saveEdit(this.props.passedProps.originalSet, {
        onSaving: this.screenDelegate.showSavingDialog,
        onSaveSucceeded: this.screenDelegate.showSaveSucceededDialog,
        onSaveFailed: this.screenDelegate.showSaveFailedDialog,
      });
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? EditSetScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : EditSetScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <AddEditSetScreen
        testID={EditSetScreenIds.SCREEN}
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
