/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import {
  ContactUsFormType,
  ScreenName,
  Theme,
} from '@ulangi/ulangi-common/enums';
import { ObservableContactUsScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { ContactUsScreenIds } from '../../constants/ids/ContactUsScreenIds';
import { ContactUsScreenFactory } from '../../factories/contact-us/ContactUsScreenFactory';
import { ContactUsScreen } from './ContactUsScreen';
import { ContactUsScreenStyle } from './ContactUsScreenContainer.style';

export interface ContactUsScreenPassedProps {
  initialFormType: ContactUsFormType;
  message?: string;
}

@observer
export class ContactUsScreenContainer extends Container<
  ContactUsScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ContactUsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ContactUsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ContactUsScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableContactUsScreen(
    this.props.passedProps.initialFormType,
    this.props.passedProps.message || '',
    ScreenName.CONTACT_US_SCREEN,
    {
      title: this.props.passedProps.initialFormType,
    },
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === ContactUsScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === ContactUsScreenIds.SEND_BTN) {
      Keyboard.dismiss();
      switch (this.observableScreen.formType) {
        case ContactUsFormType.FEATURE_REQUEST:
          this.screenDelegate.sendFeatureRequest(
            this.props.rootStore.userStore.existingCurrentUser.email,
            this.observableScreen.text,
          );
          break;
        case ContactUsFormType.REPORT_A_BUG:
          this.screenDelegate.sendBugReport(
            this.props.rootStore.userStore.existingCurrentUser.email,
            this.observableScreen.text,
          );
          break;
        case ContactUsFormType.REPORT_AN_ERROR:
          this.screenDelegate.sendAnErrorReport(
            this.props.rootStore.userStore.existingCurrentUser.email,
            this.observableScreen.text,
          );
          break;
        default:
          this.screenDelegate.sendSupportMessage(
            this.props.rootStore.userStore.existingCurrentUser.email,
            this.observableScreen.text,
          );
      }
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ContactUsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ContactUsScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ContactUsScreen
        userStore={this.props.rootStore.userStore}
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
      />
    );
  }
}
