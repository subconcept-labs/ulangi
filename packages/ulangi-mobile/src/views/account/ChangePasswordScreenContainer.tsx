/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableChangePasswordScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { ChangePasswordScreenIds } from '../../constants/ids/ChangePasswordScreenIds';
import { ChangePasswordScreenFactory } from '../../factories/account/ChangePasswordScreenFactory';
import { ChangePasswordScreen } from './ChangePasswordScreen';
import { ChangePasswordScreenStyle } from './ChangePasswordScreenContainer.style';

@observer
export class ChangePasswordScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ChangePasswordScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ChangePasswordScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ChangePasswordScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableChangePasswordScreen(
    '',
    '',
    '',
    ScreenName.CHANGE_PASSWORD_SCREEN,
    new ObservableTitleTopBar(
      'Change Password',
      new ObservableTopBarButton(
        ChangePasswordScreenIds.BACK_BTN,
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
        ChangePasswordScreenIds.SAVE_BTN,
        'Save',
        null,
        (): void => {
          Keyboard.dismiss();
          this.screenDelegate.changePassword(
            this.observableScreen.currentPassword,
            this.observableScreen.newPassword,
            this.observableScreen.confirmNewPassword,
            {
              onChangingPassword: this.screenDelegate
                .showChangingPasswordDialog,
              onChangePasswordSucceeded: this.screenDelegate
                .showChangePasswordSucceededDialog,
              onChangePasswordFailed: this.screenDelegate
                .showChangePasswordFailedDialog,
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
        ? ChangePasswordScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ChangePasswordScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ChangePasswordScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        userStore={this.props.rootStore.userStore}
        observableScreen={this.observableScreen}
      />
    );
  }
}
