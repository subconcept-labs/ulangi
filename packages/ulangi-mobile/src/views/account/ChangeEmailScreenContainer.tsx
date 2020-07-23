/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableChangeEmailScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { ChangeEmailScreenIds } from '../../constants/ids/ChangeEmailScreenIds';
import { ChangeEmailScreenFactory } from '../../factories/account/ChangeEmailScreenFactory';
import { ChangeEmailScreen } from './ChangeEmailScreen';
import { ChangeEmailScreenStyle } from './ChangeEmailScreenContainer.style';

@observer
export class ChangeEmailScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ChangeEmailScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ChangeEmailScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ChangeEmailScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableChangeEmailScreen(
    '',
    '',
    this.props.componentId,
    ScreenName.CHANGE_EMAIL_SCREEN,
    new ObservableTitleTopBar(
      'Change Email',
      new ObservableTopBarButton(
        ChangeEmailScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      new ObservableTopBarButton(
        ChangeEmailScreenIds.SAVE_BTN,
        'Save',
        null,
        (): void => {
          Keyboard.dismiss();
          this.screenDelegate.changeEmail(
            this.observableScreen.email,
            this.observableScreen.password,
            {
              onChangingEmail: this.screenDelegate.showChangingEmailDialog,
              onChangeEmailSucceeded: this.screenDelegate
                .showChangeEmailSucceededDialog,
              onChangeEmailFailed: this.screenDelegate
                .showChangeEmailFailedDialog,
            },
          );
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ChangeEmailScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ChangeEmailScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ChangeEmailScreen
        themeStore={this.props.rootStore.themeStore}
        userStore={this.props.rootStore.userStore}
        observableScreen={this.observableScreen}
      />
    );
  }
}
